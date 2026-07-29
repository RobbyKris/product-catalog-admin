import { formatPrice, formatRating } from "../../../utils/format-number";
import type { Product } from "../types/product";

type ProductDetailProps = {
  product: Product;
};

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-field border border-border bg-surface-2/70 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-text">
        {value}
      </p>
    </div>
  );
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-card border border-border bg-surface-2">
          <img
            alt={product.title}
            className="aspect-square h-full w-full object-contain"
            src={product.thumbnail}
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">
            {product.brand || "Unbranded"}
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-text">
            {product.title}
          </h2>

          <p className="mt-2 inline-flex rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            {product.category}
          </p>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Price
              </p>
              <p className="mt-1 text-2xl font-semibold text-text">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Rating
              </p>
              <p className="mt-1 text-lg font-semibold text-text">
                {formatRating(product.rating)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DetailItem label="Discount" value={`${product.discountPercentage}%`} />
        <DetailItem label="Stock" value={`${product.stock} units`} />
        <DetailItem label="Rating" value={`${product.rating} / 5`} />
        <DetailItem label="Category" value={product.category} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text">Description</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">
          {product.description}
        </p>
      </div>
    </div>
  );
}
