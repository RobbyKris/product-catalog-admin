import { useEffect, useState } from "react";

import { Alert } from "../../../components/ui/alert";
import { EmptyState } from "../../../components/ui/empty-state";
import { Pagination } from "../../../components/ui/pagination";
import { ProductTableSkeleton } from "../../../components/ui/skeleton";
import { useDebounce } from "../../../hooks/use-debounce";
import { ProductCardList } from "../components/product-card-list";
import { ProductTable } from "../components/product-table";
import { ProductToolbar } from "../components/product-toolbar";
import { useProductStore } from "../store/product.store";
import type { ProductSortField, SortOrder } from "../types/product";

export function ProductsPage() {
  const products = useProductStore((state) => state.products);
  const page = useProductStore((state) => state.page);
  const limit = useProductStore((state) => state.limit);
  const total = useProductStore((state) => state.total);
  const sortBy = useProductStore((state) => state.sortBy);
  const sortOrder = useProductStore((state) => state.sortOrder);
  const search = useProductStore((state) => state.search);
  const category = useProductStore((state) => state.category);
  const categories = useProductStore((state) => state.categories);

  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  const setPage = useProductStore((state) => state.setPage);
  const setSearch = useProductStore((state) => state.setSearch);
  const setCategory = useProductStore((state) => state.setCategory);
  const setSort = useProductStore((state) => state.setSort);
  const resetFilters = useProductStore((state) => state.resetFilters);
  const fetchCategories = useProductStore((state) => state.fetchCategories,);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400,);

  useEffect(() => {
    const normalizedInput = searchInput.trim();
    const normalizedSearch = debouncedSearch.trim();

    if (normalizedSearch !== normalizedInput) {
      return;
    }

    if (
      normalizedSearch &&
      category !== "all"
    ) {
      setCategory("all");
    }

    if (normalizedSearch !== search) {
      setSearch(normalizedSearch);
    }
  }, [
    category,
    debouncedSearch,
    search,
    searchInput,
    setCategory,
    setSearch,
  ]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    void fetchProducts();
  }, [category, fetchProducts, page, search, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(total / limit),);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  function handleCategoryChange(
    nextCategory: string,
  ) {
    setSearchInput("");
    setSearch("");
    setCategory(nextCategory);
  }

  function handleSortChange(
    nextSortBy: ProductSortField,
    nextSortOrder: SortOrder,
  ) {
    setSort(
      nextSortBy,
      nextSortOrder,
    );
  }

  function handleResetFilters() {
    setSearchInput("");
    resetFilters();
  }

  const isEmpty = !isLoading && !error && products.length === 0;
  const hasProducts = !isLoading && !error && products.length > 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Catalog Admin
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-text">Products</h1>
          <p className="max-w-2xl text-sm text-muted">
            Browse the current product catalog before we wire search, filters,
            and CRUD actions into the next steps.
          </p>
        </div>
      </header>

      <ProductToolbar
        categories={categories}
        category={category}
        onCategoryChange={handleCategoryChange}
        onReset={handleResetFilters}
        onSearchChange={setSearchInput}
        onSortChange={handleSortChange}
        searchValue={searchInput}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {isLoading ? <ProductTableSkeleton rows={6} /> : null}

      {!isLoading && error ? (
        <Alert
          actionLabel="Try Again"
          description="The latest product list could not be loaded yet."
          onAction={() => {
            void fetchProducts();
          }}
          title={error}
        />
      ) : null}

      {isEmpty ? (
        <EmptyState
          description={
            search
              ? `No products match "${search}".`
              : category !== "all"
                ? `No products found in category "${category}".`
                : "Products will appear here once the list API returns data."
          }
          title="No products found"
        />
      ) : null}

      {hasProducts ? (
        <>
          <div className="hidden md:block">
            <ProductTable products={products} />
          </div>

          <div className="md:hidden">
            <ProductCardList products={products} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted">
              Page{" "}
              <strong className="text-text">
                {page}
              </strong>{" "}
              of{" "}
              <strong className="text-text">
                {totalPages}
              </strong>
            </p>

            <Pagination
              onPageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </>
      ) : null}
    </main>
  );
}
