export type Product = {
  id: number;
  thumbnail: string;
  title: string;
  brand?: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  rating: number;
  description: string;
};

export type ProductSortField = "title" | "price" | "rating" | "stock";

export type SortOrder = "asc" | "desc";

export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductCategory = {
  slug: string;
  name: string;
  url: string;
};

export type ProductQuery = {
  limit: number;
  skip: number;
  sortBy?: ProductSortField;
  sortOrder?: SortOrder;
};

export type ProductFormValues = {
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  rating: number;
  description: string;
  thumbnail: string;
};
