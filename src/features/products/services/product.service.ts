import type {
  Product,
  ProductCategory,
  ProductListResponse,
  ProductQuery,
} from "../types/product";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(
  query: ProductQuery,
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    limit: String(query.limit),
    skip: String(query.skip),
  });

  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder) {
    params.set("order", query.sortOrder);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function searchProducts(
  search: string,
  query: ProductQuery,
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    q: search,
    limit: String(query.limit),
    skip: String(query.skip),
  });

  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder) {
    params.set("order", query.sortOrder);
  }

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  return response.json();
}

export async function getCategories(): Promise<ProductCategory[]> {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function getProductsByCategory(
  category: string,
  query: ProductQuery,
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    limit: String(query.limit),
    skip: String(query.skip),
  });

  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder) {
    params.set("order", query.sortOrder);
  }

  const response = await fetch(
    `${BASE_URL}/category/${encodeURIComponent(category)}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }

  return response.json();
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product detail");
  }

  return response.json();
}
