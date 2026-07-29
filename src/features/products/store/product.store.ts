import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getMatchingCreatedProducts,
  mergeProductPage,
} from "../utils/product-state";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "../services/product.service";

import type {
  Product,
  ProductCategory,
  ProductFormValues,
  ProductListResponse,
  ProductSortField,
  SortOrder,
} from "../types/product";

type ProductState = {
  products: Product[];
  selectedProduct: Product | null;
  categories: ProductCategory[];

  page: number;
  limit: number;
  total: number;

  search: string;
  category: string;

  sortBy: ProductSortField;
  sortOrder: SortOrder;

  isLoading: boolean;
  error: string | null;

  createdProducts: Product[];
  updatedProducts: Record<number, Product>;
  deletedProductIds: number[];

  setSelectedProduct: (product: Product | null) => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSort: (sortBy: ProductSortField, sortOrder: SortOrder) => void;
  resetFilters: () => void;
  clearError: () => void;
  fetchCategories: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  createProduct: (values: ProductFormValues) => Promise<Product>;
  updateProduct: (id: number, values: ProductFormValues,) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
};

type PersistedProductState = Pick<
  ProductState,
  "createdProducts" | "updatedProducts" | "deletedProductIds"
>;

const DEFAULT_SORT_BY: ProductSortField = "title";
const DEFAULT_SORT_ORDER: SortOrder = "asc";
const DEFAULT_CATEGORY = "all";

function normalizeSearch(search: string) {
  return search.trim();
}

function buildProduct(id: number, values: ProductFormValues): Product {
  return {
    id,
    ...values,
  };
}

function getDeletedCountForTotal(
  data: ProductListResponse,
  deletedProductIds: number[],
  search: string,
  category: string,
) {
  if (search === "" && category === DEFAULT_CATEGORY) {
    return deletedProductIds.length;
  }

  return data.products.filter((product) =>
    deletedProductIds.includes(product.id),
  ).length;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      categories: [],
      page: 1,
      limit: 10,
      total: 0,
      search: "",
      category: DEFAULT_CATEGORY,
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
      isLoading: false,
      error: null,
      createdProducts: [],
      updatedProducts: {},
      deletedProductIds: [],

      setSelectedProduct: (product) => {
        set({ selectedProduct: product });
      },

      setPage: (page) => {
        set({ page });
      },

      setSearch: (search) => {
        set({
          search,
          page: 1,
        });
      },

      setCategory: (category) => {
        set({
          category,
          page: 1,
        });
      },

      setSort: (sortBy, sortOrder) => {
        set({
          sortBy,
          sortOrder,
          page: 1,
        });
      },

      resetFilters: () => {
        set({
          search: "",
          category: DEFAULT_CATEGORY,
          sortBy: DEFAULT_SORT_BY,
          sortOrder: DEFAULT_SORT_ORDER,
          page: 1,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      fetchCategories: async () => {
        try {
          const categories = await getCategories();

          set({ categories });
        } catch {
          set({ categories: [] });
        }
      },

      fetchProducts: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const state = get();
          const skip = (state.page - 1) * state.limit;
          const query = {
            limit: state.limit,
            skip,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
          };
          const normalizedSearch = normalizeSearch(state.search);

          let data: ProductListResponse;

          if (normalizedSearch) {
            data = await searchProducts(normalizedSearch, query);
          } else if (state.category !== DEFAULT_CATEGORY) {
            data = await getProductsByCategory(state.category, query);
          } else {
            data = await getProducts(query);
          }

          const matchingCreatedProducts = getMatchingCreatedProducts(
            state.createdProducts,
            normalizedSearch,
            state.category,
          );

          const mergedProducts = mergeProductPage({
            apiProducts: data.products,
            createdProducts: state.createdProducts,
            updatedProducts: state.updatedProducts,
            deletedProductIds: state.deletedProductIds,
            search: normalizedSearch,
            category: state.category,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
            page: state.page,
            limit: state.limit,
          });

          const deletedCount = getDeletedCountForTotal(
            data,
            state.deletedProductIds,
            normalizedSearch,
            state.category,
          );

          set({
            products: mergedProducts,
            total: Math.max(
              0,
              data.total - deletedCount + matchingCreatedProducts.length,
            ),
            isLoading: false,
          });
        } catch {
          set({
            products: [],
            total: 0,
            isLoading: false,
            error: "Failed to fetch products",
          });
        }
      },

      createProduct: async (values) => {
        const state = get();

        const product = buildProduct(Date.now(), values);

        set({
          createdProducts: [
            ...state.createdProducts,
            product,
          ],
          page: 1,
        });

        await get().fetchProducts();

        return product;
      },

      updateProduct: async (
        id,
        values,
      ) => {
        const state = get();

        const existingCreatedProduct =
          state.createdProducts.find(
            (product) => product.id === id,
          );

        const baseProduct =
          existingCreatedProduct ??
          state.updatedProducts[id] ??
          state.products.find(
            (product) => product.id === id,
          );

        if (!baseProduct) {
          throw new Error(`Product with id ${id} not found`);
        }

        const nextProduct: Product = {
          ...baseProduct,
          ...values,
          id,
        };

        if (existingCreatedProduct) {
          set({
            createdProducts:
              state.createdProducts.map(
                (product) =>
                  product.id === id
                    ? nextProduct
                    : product,
              ),

            selectedProduct:
              state.selectedProduct?.id === id
                ? nextProduct
                : state.selectedProduct,
          });
        } else {
          set({
            updatedProducts: {
              ...state.updatedProducts,
              [id]: nextProduct,
            },

            selectedProduct:
              state.selectedProduct?.id === id
                ? nextProduct
                : state.selectedProduct,
          });
        }

        await get().fetchProducts();

        return nextProduct;
      },

      deleteProduct: async (id) => {
        const state = get();

        const isCreatedProduct =
          state.createdProducts.some(
            (product) => product.id === id,
          );

        if (isCreatedProduct) {
          set({
            createdProducts:
              state.createdProducts.filter(
                (product) =>
                  product.id !== id,
              ),

            page: 1,
          });
        } else {
          const nextUpdatedProducts = {
            ...state.updatedProducts,
          };

          delete nextUpdatedProducts[id];

          set({
            updatedProducts:
              nextUpdatedProducts,

            deletedProductIds:
              state.deletedProductIds.includes(id)
                ? state.deletedProductIds
                : [
                  ...state.deletedProductIds,
                  id,
                ],

            page: 1,
          });
        }

        await get().fetchProducts();
      },
    }),
    {
      name: "product-catalog-store",
      partialize: (state): PersistedProductState => ({
        createdProducts: state.createdProducts,
        updatedProducts: state.updatedProducts,
        deletedProductIds: state.deletedProductIds,
      }),
    },
  ),
);
