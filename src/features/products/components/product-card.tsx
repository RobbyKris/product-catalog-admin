import {
  Card,
  CardBody,
  CardFooter,
  CardMedia,
} from "../../../components/ui/card";
import { formatPrice, formatRating } from "../../../utils/format-number";
import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

type ActionButtonProps = {
  label: string;
  onClick?: () => void;
};

type StockMeta = {
  label: string;
  toneClassName: string;
};

function getStockMeta(stock: number): StockMeta {
  if (stock === 0) {
    return {
      label: "Out of stock",
      toneClassName: "border-danger/20 bg-danger-soft text-danger",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low stock",
      toneClassName: "border-warning/20 bg-warning-soft text-warning",
    };
  }

  return {
    label: "In stock",
    toneClassName: "border-success/20 bg-success-soft text-success",
  };
}

function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button
      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-field border border-border bg-surface px-3 text-sm font-semibold text-text transition hover:-translate-y-px hover:bg-surface-2 disabled:hover:translate-y-0 disabled:hover:bg-surface"
      disabled={!onClick}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const stockMeta = getStockMeta(product.stock);
  const brandAndCategory = [product.brand, product.category]
    .filter(Boolean)
    .join(" / ");

  return (
    <Card as="article" role="listitem">
      <CardBody>
        <div className="flex items-start gap-3">
          <CardMedia className="h-20 w-20 shrink-0">
            <img
              alt={product.title}
              className="h-full w-full object-cover"
              loading="lazy"
              src={product.thumbnail}
            />
          </CardMedia>

          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-base font-semibold text-text">
              {product.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {brandAndCategory || "Uncategorized product"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-field bg-surface-2/75 p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Price
            </p>
            <p className="mt-1 text-base font-semibold text-text">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Rating
            </p>
            <p className="mt-1 text-base font-semibold text-text">
              {formatRating(product.rating)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stockMeta.toneClassName}`}
          >
            {stockMeta.label}
          </span>

          <p className="text-sm text-muted">{product.stock} units available</p>
        </div>
      </CardBody>

      <CardFooter className="flex gap-2">
        <ActionButton
          label="View"
          onClick={
            onView
              ? () => {
                  onView(product);
                }
              : undefined
          }
        />
        <ActionButton
          label="Edit"
          onClick={
            onEdit
              ? () => {
                  onEdit(product);
                }
              : undefined
          }
        />
        <ActionButton
          label="Delete"
          onClick={
            onDelete
              ? () => {
                  onDelete(product);
                }
              : undefined
          }
        />
      </CardFooter>
    </Card>
  );
}
