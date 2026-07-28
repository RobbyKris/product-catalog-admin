import { create } from "zustand";
import { getProducts } from "../services/product.service";
import type {
  Product,
  ProductSortField,
  SortOrder,
  ProductCategory,
} from "../types/product";

// state definition
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
  clearError: () => void;
  fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  // initial values
  products: [],
  selectedProduct: null,
  categories: [],

  page: 1,
  limit: 10,
  total: 0,

  search: "",
  category: "all",

  sortBy: "title",
  sortOrder: "asc",

  isLoading: false,
  error: null,

  createdProducts: [],
  updatedProducts: {},
  deletedProductIds: [],

  // setter actions
  setSelectedProduct: (product) => {
    set({
      selectedProduct: product,
    });
  },

  setPage: (page) => {
    set({
      page,
    });
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

  clearError: () => {
    set({
      error: null,
    });
  },

  fetchProducts: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const state = get();

      const skip = (state.page - 1) * state.limit;

      const data = await getProducts({
        limit: state.limit,
        skip,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      });

      set({
        products: data.products,
        total: data.total,
        isLoading: false,
      });
    } catch {
      set({
        products: [],
        isLoading: false,
        error: "Failed to fetch products",
      });
    }
  },
}));
