import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatPrice, formatRating } from "../../../utils/format-number";
import type { Product } from "../types/product";
import { ProductImage } from "./product-image";

type ProductTableProps = {
  products: Product[];
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
      className="inline-flex min-h-9 items-center justify-center rounded-field border border-border bg-surface px-3 text-xs font-semibold text-text transition hover:-translate-y-px hover:bg-surface-2 disabled:hover:translate-y-0 disabled:hover:bg-surface"
      disabled={!onClick}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <section className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="hover:bg-surface-2/70">
              <TableHead scope="col">Product</TableHead>
              <TableHead scope="col">Category</TableHead>
              <TableHead className="text-right" scope="col">
                Price
              </TableHead>
              <TableHead className="text-right" scope="col">
                Rating
              </TableHead>
              <TableHead className="text-right" scope="col">
                Stock
              </TableHead>
              <TableHead className="text-right" scope="col">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => {
              const stockMeta = getStockMeta(product.stock);

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-field border border-border bg-surface-2">
                        <ProductImage
                          alt={product.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={product.thumbnail}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text">
                          {product.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted">
                          {product.brand ?? "Unbranded"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex rounded-full border border-primary/15 bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-strong">
                      {product.category}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {formatPrice(product.price)}
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="font-medium text-text">
                      {formatRating(product.rating)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stockMeta.toneClassName}`}
                      >
                        {stockMeta.label}
                      </span>
                      <span className="text-xs text-muted">
                        {product.stock} units
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
