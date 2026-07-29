import { CardList } from "../../../components/ui/card-list";
import type { Product } from "../types/product";
import { ProductCard } from "./product-card";

type ProductCardListProps = {
  products: Product[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

export function ProductCardList({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductCardListProps) {
  return (
    <CardList aria-label="Product list" role="list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          product={product}
        />
      ))}
    </CardList>
  );
}
