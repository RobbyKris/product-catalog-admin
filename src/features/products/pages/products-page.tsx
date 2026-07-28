import { useEffect } from "react";
import { useProductStore } from "../store/product.store";

export function ProductsPage() {
  const products = useProductStore((state) => state.products);
  const page = useProductStore((state) => state.page);
  const sortBy = useProductStore((state) => state.sortBy);
  const sortOrder = useProductStore((state) => state.sortOrder);

  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts, page, sortBy, sortOrder]);

  const isEmpty = !isLoading && !error && products.length === 0;

  const hasProducts = !isLoading && !error && products.length > 0;

  return (
    <main>
      <h1>Products</h1>

      {/* Loading state */}
      {isLoading && <p role="status">Loading products...</p>}

      {/* Error state */}
      {!isLoading && error && (
        <div role="alert">
          <p>{error}</p>

          <button type="button" onClick={() => void fetchProducts()}>
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div>
          <p>No products found.</p>
          <p>Try changing your search or filter.</p>
        </div>
      )}

      {/* Success state */}
      {hasProducts && (
        <div>
          {products.map((product) => (
            <p key={product.id}>{product.title}</p>
          ))}
        </div>
      )}
    </main>
  );
}
