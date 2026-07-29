import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../components/ui/button";
import { FormField } from "../../../components/ui/form-field";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { productFormSchema } from "../schemas/product-form.schema";
import type {
  Product,
  ProductCategory,
  ProductFormValues,
} from "../types/product";

type ProductFormMode = "create" | "edit";

type ProductFormProps = {
  mode: ProductFormMode;
  categories: ProductCategory[];
  product?: Product | null;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
};

function getDefaultValues(product?: Product | null): ProductFormValues {
  return {
    title: product?.title ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "",
    price: product?.price ?? Number.NaN,
    discountPercentage: product?.discountPercentage ?? Number.NaN,
    stock: product?.stock ?? Number.NaN,
    rating: product?.rating ?? 0,
    description: product?.description ?? "",
    thumbnail: product?.thumbnail ?? "",
  };
}

function getNumberValue(value: number): number | "" {
  return Number.isNaN(value) ? "" : value;
}

function readNumberValue(value: string, valueAsNumber: number): number {
  return value === "" ? Number.NaN : valueAsNumber;
}

export function ProductForm({
  mode,
  categories,
  product,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(product),
  });

  useEffect(() => {
    reset(getDefaultValues(product));
  }, [product, reset]);

  async function handleValidSubmit(values: ProductFormValues) {
    await onSubmit(values);
  }

  const submitLabel = mode === "create" ? "Add Product" : "Save Changes";
  const loadingLabel = mode === "create" ? "Adding..." : "Saving...";

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          error={errors.title?.message}
          htmlFor="product-title"
          label="Product Title"
          required
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                hasError={Boolean(errors.title)}
                id="product-title"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="Example: Wireless Headphones"
                value={field.value}
              />
            )}
          />
        </FormField>

        <FormField
          error={errors.brand?.message}
          htmlFor="product-brand"
          label="Brand"
        >
          <Controller
            control={control}
            name="brand"
            render={({ field }) => (
              <Input
                hasError={Boolean(errors.brand)}
                id="product-brand"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="Example: Sony"
                value={field.value}
              />
            )}
          />
        </FormField>
      </div>

      <FormField
        error={errors.category?.message}
        htmlFor="product-category"
        label="Category"
        required
      >
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              hasError={Boolean(errors.category)}
              id="product-category"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          error={errors.price?.message}
          htmlFor="product-price"
          label="Price"
          required
        >
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input
                hasError={Boolean(errors.price)}
                id="product-price"
                min="0"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(
                    readNumberValue(
                      event.target.value,
                      event.target.valueAsNumber,
                    ),
                  );
                }}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={getNumberValue(field.value)}
              />
            )}
          />
        </FormField>

        <FormField
          error={errors.discountPercentage?.message}
          htmlFor="product-discount"
          label="Discount Percentage"
        >
          <Controller
            control={control}
            name="discountPercentage"
            render={({ field }) => (
              <Input
                hasError={Boolean(errors.discountPercentage)}
                id="product-discount"
                max="100"
                min="0"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(
                    readNumberValue(
                      event.target.value,
                      event.target.valueAsNumber,
                    ),
                  );
                }}
                placeholder="0"
                step="0.01"
                type="number"
                value={getNumberValue(field.value)}
              />
            )}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          error={errors.stock?.message}
          htmlFor="product-stock"
          label="Stock"
          required
        >
          <Controller
            control={control}
            name="stock"
            render={({ field }) => (
              <Input
                hasError={Boolean(errors.stock)}
                id="product-stock"
                min="0"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(
                    readNumberValue(
                      event.target.value,
                      event.target.valueAsNumber,
                    ),
                  );
                }}
                placeholder="0"
                step="1"
                type="number"
                value={getNumberValue(field.value)}
              />
            )}
          />
        </FormField>

        <FormField
          error={errors.rating?.message}
          htmlFor="product-rating"
          label="Rating"
        >
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <Input
                hasError={Boolean(errors.rating)}
                id="product-rating"
                max="5"
                min="0"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(
                    readNumberValue(
                      event.target.value,
                      event.target.valueAsNumber,
                    ),
                  );
                }}
                placeholder="0"
                step="0.1"
                type="number"
                value={getNumberValue(field.value)}
              />
            )}
          />
        </FormField>
      </div>

      <FormField
        error={errors.thumbnail?.message}
        helperText="Paste a public image URL."
        htmlFor="product-thumbnail"
        label="Thumbnail URL"
      >
        <Controller
          control={control}
          name="thumbnail"
          render={({ field }) => (
            <Input
              hasError={Boolean(errors.thumbnail)}
              id="product-thumbnail"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="https://example.com/product.jpg"
              type="url"
              value={field.value}
            />
          )}
        />
      </FormField>

      <FormField
        error={errors.description?.message}
        htmlFor="product-description"
        label="Description"
        required
      >
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              hasError={Boolean(errors.description)}
              id="product-description"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Describe the product..."
              rows={5}
              value={field.value}
            />
          )}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
          variant="secondary"
        >
          Cancel
        </Button>

        <Button
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loadingLabel={loadingLabel}
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
