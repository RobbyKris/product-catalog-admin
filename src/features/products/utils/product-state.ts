import type { Product, ProductSortField, SortOrder } from "../types/product";

type MergeProductOptions = {
    apiProducts: Product[];
    createdProducts: Product[];
    updatedProducts: Record<number, Product>;
    deletedProductIds: number[];

    search: string;
    category: string;
    sortBy: ProductSortField;
    sortOrder: SortOrder;

    page: number;
    limit: number;
};

function matchesQuery(
    product: Product,
    search: string,
    category: string,
) {
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch =
        normalizedSearch === "" ||
        product.title
            .toLowerCase()
            .includes(normalizedSearch) ||
        product.brand
            ?.toLowerCase()
            .includes(normalizedSearch);

    const matchesCategory = category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
}

function compareProducts(
    first: Product,
    second: Product,
    sortBy: ProductSortField,
    sortOrder: SortOrder,
) {
    const result =
        sortBy === "title"
            ? first.title.localeCompare(second.title)
            : first[sortBy] - second[sortBy];

    return sortOrder === "asc"
        ? result
        : -result;
}

export function getMatchingCreatedProducts(
    createdProducts: Product[],
    search: string,
    category: string,
) {
    return createdProducts.filter((product) => matchesQuery(product, search, category));
}

export function mergeProductPage({
    apiProducts,
    createdProducts,
    updatedProducts,
    deletedProductIds,
    search,
    category,
    sortBy,
    sortOrder,
    page,
    limit,
}: MergeProductOptions): Product[] {
    const mergedApiProducts = apiProducts
        .filter((product) => !deletedProductIds.includes(product.id))
        .map((product) => updatedProducts[product.id] ?? product);

    const matchingCreatedProducts =
        page === 1
            ? getMatchingCreatedProducts(createdProducts, search, category)
            : [];

    return [
        ...matchingCreatedProducts,
        ...mergedApiProducts,
    ]
        .sort((first, second) => compareProducts(first, second, sortBy, sortOrder))
        .slice(0, limit);
}
