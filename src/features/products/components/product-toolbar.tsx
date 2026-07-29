import { Button } from "../../../components/ui/button";
import { SearchInput } from "../../../components/ui/search-input";
import { Select } from "../../../components/ui/select";

import type {
    ProductCategory,
    ProductSortField,
    SortOrder,
} from "../types/product";
import { FiRefreshCw } from "react-icons/fi";

type ProductToolbarProps = {
    searchValue: string;
    category: string;
    categories: ProductCategory[];
    sortBy: ProductSortField;
    sortOrder: SortOrder;

    onSearchChange: (value: string) => void;
    onCategoryChange: (category: string) => void;
    onSortChange: (sortBy: ProductSortField, sortOrder: SortOrder,) => void;
    onReset: () => void;
};

type SortOptionValue = `${ProductSortField}-${SortOrder}`;

const sortOptions: Array<{
    label: string;
    value: SortOptionValue;
}> = [
        { label: "Title A-Z", value: "title-asc", },
        { label: "Price Low-High", value: "price-asc", },
        { label: "Price High-Low", value: "price-desc", },
        { label: "Rating High-Low", value: "rating-desc", },
        { label: "Stock High-Low", value: "stock-desc", },
    ];

export function ProductToolbar({
    searchValue,
    category,
    categories,
    sortBy,
    sortOrder,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onReset,
}: ProductToolbarProps) {
    function handleSortChange(value: string) {
        const [
            nextSortBy,
            nextSortOrder,
        ] = value.split("-") as [
            ProductSortField,
            SortOrder,
        ];

        onSortChange(nextSortBy, nextSortOrder);
    }

    const isResetDisabled = searchValue.trim() === "" && category === "all" && sortBy === "title" && sortOrder === "asc";

    return (
        <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
            <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_auto] lg:grid-cols-[minmax(260px,1fr)_220px_220px_auto]">
                <SearchInput
                    containerClassName="w-full"
                    label="Search products"
                    onChange={(event) => {
                        onSearchChange(
                            event.target.value,
                        );
                    }}
                    placeholder="Search products..."
                    value={searchValue}
                />

                {/* [BARU — CATEGORY] */}
                <Select
                    aria-label="Filter products by category"
                    onChange={(event) => {
                        onCategoryChange(
                            event.target.value,
                        );
                    }}
                    value={category}
                >
                    <option value="all">All Categories</option>

                    {categories.map(
                        (categoryOption) => (
                            <option key={categoryOption.slug} value={categoryOption.slug}>
                                {categoryOption.name}
                            </option>
                        ),
                    )}
                </Select>

                {/* [BARU — SORTING] */}
                <Select
                    aria-label="Sort products"
                    onChange={(event) => {
                        handleSortChange(
                            event.target.value,
                        );
                    }}
                    value={`${sortBy}-${sortOrder}`}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>

                <Button
                    className="w-full md:w-auto"
                    disabled={isResetDisabled}
                    leadingIcon={(
                        <FiRefreshCw
                            aria-hidden="true"
                            className="h-4 w-4"
                        />
                    )}
                    onClick={onReset}
                    type="button"
                    variant="secondary"
                >
                    Reset
                </Button>
            </div>
        </section>
    );
}
