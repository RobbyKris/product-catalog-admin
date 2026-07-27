# UI Components

Komponen pada `src/components/ui` adalah primitive UI lintas fitur untuk **Product Catalog Admin**.

Dokumentasi ini hanya memuat komponen yang benar-benar diperlukan untuk technical test frontend.

Tampilan dibuat:

- sederhana
- konsisten
- responsive
- mudah digunakan
- mudah dirawat

Tidak ada:

- light/dark mode
- theme switcher
- komponen RBAC
- date picker
- chart
- component library yang terlalu besar

---

## Daftar Isi

- [Typography](#typography)
- [Daftar Komponen](#daftar-komponen)
- [Aturan Penggunaan](#aturan-penggunaan)
- [Button](#button)
- [IconButton](#iconbutton)
- [FormField](#formfield)
- [Input dan Textarea](#input-dan-textarea)
- [Select](#select)
- [SearchInput](#searchinput)
- [Badge](#badge)
- [Table](#table)
- [Pagination](#pagination)
- [Modal](#modal)
- [ConfirmDialog](#confirmdialog)
- [Skeleton](#skeleton)
- [EmptyState](#emptystate)
- [Alert](#alert)
- [Product Image](#product-image)
- [Responsive UI](#responsive-ui)
- [Formatting Helper](#formatting-helper)
- [Aksesibilitas](#aksesibilitas)
- [Contoh Penggunaan](#contoh-penggunaan)

---

# Typography

Gunakan font yang sederhana dan mudah dibaca, misalnya `Inter`.

Skala typography:

| Class | Ukuran | Penggunaan |
|---|---:|---|
| `text-xs` | 12px | Metadata, helper, table header |
| `text-sm` | 14px | Body, table cell, form, button |
| `text-base` | 16px | Judul section dan modal |
| `text-xl` | 20px | Judul halaman |
| `text-2xl` | 24px | Heading utama bila diperlukan |

Aturan:

- Body utama menggunakan `14px`.
- Jangan menggunakan teks di bawah `12px`.
- Gunakan `font-medium` atau `font-semibold` untuk label dan action.
- Gunakan maksimal tiga level heading visual dalam satu halaman.
- Hindari arbitrary font size jika ukuran standar sudah cukup.

---

# Daftar Komponen

Komponen global yang diperlukan:

| Komponen | Kegunaan |
|---|---|
| `Button` | Primary, secondary, danger, loading |
| `IconButton` | Action kecil seperti View, Edit, Delete |
| `FormField` | Label, helper text, required, error |
| `Input` | Title, brand, price, stock, rating, discount, image URL |
| `Textarea` | Description |
| `Select` | Category dan sorting |
| `SearchInput` | Search product |
| `Badge` | Category, stock status, atau context singkat |
| `Table` | Product list desktop dan tablet |
| `Pagination` | Navigasi halaman |
| `Modal` | Product detail dan create/edit form |
| `ConfirmDialog` | Konfirmasi delete |
| `Skeleton` | Loading product list/detail |
| `EmptyState` | Hasil kosong |
| `Alert` | Feedback error atau success sederhana |

Komponen khusus Product tetap berada di:

```txt
features/products/components/
```

Contoh:

```txt
product-table.tsx
product-card.tsx
product-card-list.tsx
product-detail.tsx
product-form.tsx
product-toolbar.tsx
product-image.tsx
```

---

# Aturan Penggunaan

- Import primitive langsung dari file component.
- Gunakan `Button` untuk action berteks.
- Gunakan `IconButton` hanya untuk action ikon.
- `IconButton` wajib memiliki `aria-label`.
- Form control dibungkus dengan `FormField`.
- Gunakan `SearchInput` khusus pencarian.
- Gunakan `Select` untuk category dan sort.
- Gunakan `Table` untuk product list desktop dan tablet.
- Gunakan `ProductCardList` untuk product list mobile.
- `ProductCardList` merender satu `ProductCard` untuk setiap product.
- Gunakan `Modal` untuk detail dan create/edit product.
- Gunakan `ConfirmDialog` sebelum delete.
- Gunakan `Skeleton`, `EmptyState`, dan error feedback secara eksplisit.
- Business logic tidak boleh diletakkan di primitive UI.
- Search, filter, sort, pagination, dan CRUD tetap menjadi tanggung jawab feature/store.
- Jangan membuat variant atau component baru jika kebutuhan yang ada sudah bisa dipenuhi primitive saat ini.

---

# Button

Variant yang diperlukan:

```txt
primary
secondary
ghost
danger
```

Contoh:

```tsx
<Button>Add Product</Button>

<Button variant="secondary">
  Cancel
</Button>

<Button variant="danger">
  Delete
</Button>
```

Loading:

```tsx
<Button
  disabled={isSubmitting}
  isLoading={isSubmitting}
>
  Save Product
</Button>
```

Aturan:

- `primary` untuk action utama.
- `secondary` untuk Cancel atau action pendamping.
- `ghost` untuk action ringan.
- `danger` hanya untuk destructive action.
- Disable tombol saat action sedang diproses.

---

# IconButton

Digunakan untuk action table yang ringkas.

Contoh:

```tsx
<IconButton
  aria-label="View product"
  onClick={() => handleView(product)}
>
  <EyeIcon />
</IconButton>
```

```tsx
<IconButton
  aria-label="Edit product"
  onClick={() => handleEdit(product)}
>
  <EditIcon />
</IconButton>
```

```tsx
<IconButton
  aria-label="Delete product"
  onClick={() => handleDelete(product)}
>
  <TrashIcon />
</IconButton>
```

Aturan:

- Wajib memiliki `aria-label`.
- Jangan menggunakan ikon tanpa konteks yang jelas.
- Tooltip boleh ditambahkan jika diperlukan, tetapi tidak wajib.

---

# FormField

`FormField` menangani:

```txt
label
required marker
helper text
error message
```

Contoh:

```tsx
<FormField
  error={errors.title}
  htmlFor="product-title"
  label="Product Title"
  required
>
  <Input
    id="product-title"
    hasError={Boolean(errors.title)}
  />
</FormField>
```

Error harus tampil dekat field terkait.

---

# Input dan Textarea

## Input

Digunakan untuk:

```txt
Title
Brand
Price
Stock
Rating
Discount
Thumbnail URL
```

State:

```txt
normal
focus
disabled
error
```

Gunakan `type="number"` untuk:

```txt
price
stock
rating
discount
```

Tetap validasi nilai pada form.

---

## Textarea

Digunakan untuk:

```txt
Description
```

Tidak perlu editor rich text.

Contoh:

```tsx
<Textarea
  id="description"
  rows={4}
/>
```

---

# Select

Digunakan untuk:

```txt
Category Filter
Product Category
Sort
```

Contoh filter:

```txt
All Categories
Beauty
Furniture
Groceries
Smartphones
...
```

Contoh sort:

```txt
Title A-Z
Price Low-High
Price High-Low
Rating High-Low
Stock High-Low
```

Tidak perlu membuat combobox searchable jika native/select sederhana sudah cukup.

---

# SearchInput

Digunakan untuk pencarian produk.

`SearchInput` hanya menangani nilai input dan event perubahan. Component ini tidak memanggil DummyJSON secara langsung.

UX yang digunakan:

```txt
User mengetik
   |
   v
Input langsung berubah
   |
   v
Debounce 400 ms
   |
   v
Update query search di Zustand
   |
   v
Reset page = 1
   |
   v
GET DummyJSON Search
```

Tidak perlu tombol Search dan tidak perlu menunggu user menekan Enter.

Contoh penggunaan:

```tsx
const [searchInput, setSearchInput] = useState("");

const debouncedSearch = useDebounce(searchInput, 400);

useEffect(() => {
  setSearch(debouncedSearch);
  setPage(1);
}, [debouncedSearch, setPage, setSearch]);

return (
  <SearchInput
    onChange={(event) => setSearchInput(event.target.value)}
    placeholder="Search products..."
    value={searchInput}
  />
);
```

Ketika query hasil debounce berubah, Product feature melakukan request:

```txt
GET /products/search?q={search}&limit={limit}&skip={skip}
```

Contoh:

```txt
GET /products/search?q=phone&limit=10&skip=0
```

Aturan:

- `searchInput` mengikuti keyboard secara langsung.
- Tidak melakukan request pada setiap karakter.
- Debounce direkomendasikan `400 ms`.
- Query search yang berubah selalu mengembalikan pagination ke page `1`.
- Search utama menggunakan DummyJSON API, bukan `.filter()` hanya pada data page yang sedang tampil.
- Loading hasil search harus terlihat bila request belum selesai.

# Badge

Variant minimal:

```txt
neutral
primary
success
warning
danger
```

Contoh penggunaan:

```txt
Category       → primary / neutral
In Stock       → success
Low Stock      → warning
Out of Stock   → danger
```

Contoh:

```tsx
<Badge variant="success">
  In Stock
</Badge>
```

Status tidak boleh dibedakan hanya dengan warna.

Tetap gunakan label teks.

---

# Table

Table menjadi tampilan utama product list pada desktop.

Struktur:

| Product | Category | Price | Rating | Stock | Actions |
|---|---|---:|---:|---:|---|

Kolom Product dapat menampilkan:

```txt
Thumbnail
Title
Brand
```

Aturan:

- Header jelas.
- Kolom Actions berada di kanan.
- Gunakan `overflow-x-auto` pada viewport kecil.
- Table hanya menangani presentasi.
- Sorting tidak ditanam di primitive Table kecuali hanya event callback presentasional.
- Gunakan `product.id` sebagai key.
- Jangan menggunakan index array sebagai key.

Contoh:

```tsx
<Table>
  <TableHeader>
    ...
  </TableHeader>

  <TableBody>
    ...
  </TableBody>
</Table>
```

---

# ProductCard dan ProductCardList

`ProductCard` adalah component khusus feature Product untuk menampilkan satu product pada viewport mobile.

Lokasi:

```txt
features/products/components/product-card.tsx
```

`ProductCardList` bertanggung jawab merender kumpulan `ProductCard`.

Lokasi:

```txt
features/products/components/product-card-list.tsx
```

Kedua component ini **bukan primitive global** karena hanya digunakan pada domain Product.

---

## ProductCard

Informasi yang ditampilkan cukup yang paling penting:

```txt
Thumbnail

Title
Brand · Category

Price
Rating

Stock Status

View
Edit
Delete
```

Contoh wireframe:

```txt
┌─────────────────────────────────┐
│ ┌───────┐                       │
│ │ Image │  iPhone X             │
│ │       │  Apple · Smartphones  │
│ └───────┘                       │
│                                 │
│ $899.00              ★ 4.6      │
│ In Stock                        │
│                                 │
│ [ View ] [ Edit ] [ Delete ]    │
└─────────────────────────────────┘
```

Aturan:

- Gunakan `ProductImage` untuk thumbnail dan fallback.
- Title menjadi informasi paling menonjol.
- Brand dan category menjadi metadata sekunder.
- Price dan rating tetap mudah ditemukan.
- Stock menggunakan `Badge`.
- Action tetap sama dengan desktop: View, Edit, Delete.
- Jangan menampilkan seluruh description pada card.
- Jangan menambahkan terlalu banyak metadata agar card tetap ringkas.
- Seluruh card tidak perlu clickable jika sudah tersedia tombol `View`.
- Gunakan `product.id` sebagai key.

Contoh:

```tsx
<ProductCard
  product={product}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

Props minimal:

```ts
type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};
```

---

## ProductCardList

`ProductCardList` menerima daftar product yang sudah diproses oleh store atau page.

Component ini hanya menangani presentasi.

```tsx
<ProductCardList
  products={products}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

Props minimal:

```ts
type ProductCardListProps = {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};
```

Contoh implementasi:

```tsx
export function ProductCardList({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductCardListProps) {
  return (
    <div className="grid gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

Search, filter, sort, pagination, loading, error, dan empty state tetap tidak menjadi tanggung jawab `ProductCardList`.

---

## Responsive Product List

Gunakan dua presentasi dari data yang sama:

```txt
Desktop / Tablet
      ↓
ProductTable

Mobile
      ↓
ProductCardList
```

Contoh responsive rendering:

```tsx
<div className="hidden md:block">
  <ProductTable
    products={products}
    onView={handleView}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
</div>

<div className="md:hidden">
  <ProductCardList
    products={products}
    onView={handleView}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
</div>
```

`ProductTable` dan `ProductCardList` harus menerima source data yang sama.

Jangan membuat state product terpisah khusus mobile.

---

# Pagination

Pagination digunakan pada desktop maupun mobile.

Pagination **tidak diganti dengan infinite scroll**.

Props minimal:

```ts
type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
```

UI:

```txt
Previous
1
2
3
Next
```

DummyJSON menggunakan:

```txt
limit
skip
```

Rumus:

```txt
skip = (page - 1) * limit
```

Contoh:

```txt
Page 1 -> limit=10&skip=0
Page 2 -> limit=10&skip=10
Page 3 -> limit=10&skip=20
```

Ketika search aktif:

```txt
GET /products/search?q=phone&limit=10&skip=0
```

Ketika user pindah ke page 2, query search tetap dipertahankan:

```txt
GET /products/search?q=phone&limit=10&skip=10
```

Aturan:

- Disable `Previous` pada halaman pertama.
- Disable `Next` pada halaman terakhir.
- Search berubah -> page `1`.
- Category berubah -> page `1`.
- Sort berubah -> page `1`.
- Pindah page tidak menghapus search/filter/sort aktif.
- Pagination tetap ditampilkan di bawah `ProductTable` maupun `ProductCardList`.
- Jangan menjadikan Enter pada SearchInput sebagai syarat agar pagination/search berjalan.
- Tidak perlu infinite scroll atau lazy-load-on-scroll.

# Modal

Modal digunakan untuk:

```txt
Product Detail
Create Product
Edit Product
```

Modal controlled oleh feature.

Props minimal:

```ts
type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
};
```

Aturan:

- Bisa ditutup dengan tombol Close atau Cancel.
- Bisa ditutup dengan `Escape`.
- Focus state tetap jelas.
- Pada mobile, lebar hampir memenuhi viewport.
- Content dapat scroll jika form panjang.
- Footer action selalu terlihat atau mudah dijangkau.

---

# ConfirmDialog

Digunakan hanya untuk destructive action.

Contoh:

```txt
Delete Product?

Are you sure you want to delete
"iPhone X"?

Cancel
Delete
```

Props minimal:

```ts
type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
```

Tidak perlu confirmation untuk:

```txt
search
filter
sort
view detail
```

---

# Skeleton

Digunakan untuk initial loading atau pergantian data yang membutuhkan request.

Minimum:

```txt
Product Table Skeleton
Product Detail Skeleton
```

Skeleton tidak perlu meniru UI secara terlalu detail.

Tujuannya hanya menjaga layout dan memberi feedback bahwa data sedang dimuat.

---

# EmptyState

Digunakan ketika:

```txt
API tidak mengembalikan product
search tidak menemukan product
category tidak memiliki result
```

Contoh:

```txt
No products found.

Try changing your search or category filter.
```

Boleh memiliki action:

```txt
Clear Filters
```

Props minimal:

```ts
type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};
```

---

# Alert

Gunakan feedback sederhana.

Variant:

```txt
success
danger
```

Contoh success:

```txt
Product created successfully.
```

Contoh error:

```txt
Failed to load products.
```

Tidak perlu membangun notification system kompleks.

Alert dapat digunakan sebagai:

- inline banner
- toast sederhana

Pilih satu pendekatan dan gunakan secara konsisten.

---

# Product Image

Product image adalah component khusus feature, bukan primitive global.

Lokasi:

```txt
features/products/components/product-image.tsx
```

Tanggung jawab:

- render product thumbnail
- `alt` text
- fallback jika image gagal dimuat

Contoh:

```tsx
<ProductImage
  alt={product.title}
  src={product.thumbnail}
/>
```

Jika image gagal:

```txt
render placeholder
```

Jangan menampilkan broken image icon sebagai final UI.

---

# Responsive UI

## Desktop

```txt
Topbar

Products                         Add Product

Search | Category | Sort

Product Table

Pagination
```

---

## Mobile

```txt
Topbar

Products

Add Product

Search

Category

Sort

Product Card List

Pagination
```

Aturan:

- Toolbar menjadi stacked.
- Button Add Product boleh full-width.
- Product list menggunakan `ProductCardList`, bukan table.
- Setiap item menggunakan `ProductCard`.
- Pagination tetap digunakan di bawah card list.
- Modal hampir full-width.
- Form menggunakan satu kolom.
- Data, search, filter, sort, pagination, dan CRUD tetap memakai state yang sama dengan desktop.

---

# Formatting Helper

Formatting tidak ditulis berulang di component.

Gunakan helper di:

```txt
src/utils/format-number.ts
```

## Price

Locale:

```txt
en-US
```

Contoh:

```ts
formatPrice(29.99)
```

Output:

```txt
$29.99
```

Contoh implementasi:

```ts
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
```

---

## Rating

Tidak perlu formatting kompleks.

Contoh:

```txt
4.6
```

Boleh ditampilkan:

```txt
★ 4.6
```

Tetap sertakan nilai angka.

---

## Stock

Gunakan number normal.

Contoh:

```txt
35
```

Badge status dapat ditentukan di feature:

```txt
stock === 0       → Out of Stock
stock <= 10       → Low Stock
stock > 10        → In Stock
```

Threshold merupakan aturan UI dan dapat diletakkan di Product feature.

---

# Aksesibilitas

Minimum requirement:

- Input memiliki label.
- Search memiliki accessible label.
- Icon button memiliki `aria-label`.
- Product image memiliki `alt`.
- Focus state terlihat.
- Modal dapat digunakan dengan keyboard.
- Error form ditampilkan dekat field.
- Submit disabled ketika proses berjalan.
- Delete menggunakan confirmation.
- Status tidak dibedakan hanya menggunakan warna.
- Table desktop memakai elemen semantic `table`, `thead`, `tbody`, `th`, dan `td`.
- Product card mobile menggunakan struktur semantic yang jelas seperti `article`.
- Button menggunakan teks yang menjelaskan action.

---

# Contoh Penggunaan

## Product Page Header

```tsx
<div className="flex items-center justify-between gap-4">
  <div>
    <h1>Products</h1>
    <p>Manage your product catalog.</p>
  </div>

  <Button onClick={handleCreate}>
    Add Product
  </Button>
</div>
```

---

## Product Toolbar

```tsx
<div className="flex flex-wrap gap-3">
  <SearchInput
    onChange={(event) => setSearchInput(event.target.value)}
    placeholder="Search products..."
    value={searchInput}
  />

  <Select
    onChange={handleCategoryChange}
    value={category}
  >
    ...
  </Select>

  <Select
    onChange={handleSortChange}
    value={sort}
  >
    ...
  </Select>
</div>
```

---

## Product Action

```tsx
<IconButton
  aria-label="View product"
  onClick={() => handleView(product)}
>
  <EyeIcon />
</IconButton>

<IconButton
  aria-label="Edit product"
  onClick={() => handleEdit(product)}
>
  <EditIcon />
</IconButton>

<IconButton
  aria-label="Delete product"
  onClick={() => handleDelete(product)}
>
  <TrashIcon />
</IconButton>
```

---

## Responsive Product List

```tsx
<>
  <div className="hidden md:block">
    <ProductTable
      products={products}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onView={handleView}
    />
  </div>

  <div className="md:hidden">
    <ProductCardList
      products={products}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onView={handleView}
    />
  </div>
</>
```

---

## Empty Result

```tsx
if (!isLoading && products.length === 0) {
  return (
    <EmptyState
      title="No products found"
      description="Try changing your search or category filter."
      action={
        <Button
          onClick={handleClearFilters}
          variant="secondary"
        >
          Clear Filters
        </Button>
      }
    />
  );
}
```

---

## Product Form Modal

```tsx
<Modal
  isOpen={isFormOpen}
  onOpenChange={setIsFormOpen}
  title={selectedProduct ? "Edit Product" : "Add Product"}
>
  <ProductForm
    product={selectedProduct}
    onCancel={() => setIsFormOpen(false)}
    onSuccess={() => setIsFormOpen(false)}
  />
</Modal>
```

---

## Delete Confirmation

```tsx
<ConfirmDialog
  description={`Are you sure you want to delete "${product.title}"?`}
  isLoading={isDeleting}
  isOpen={isDeleteOpen}
  onCancel={handleCancelDelete}
  onConfirm={handleConfirmDelete}
  title="Delete Product"
/>
```

---

# Ringkasan Komponen Final

Primitive UI global:

```txt
Button
IconButton
FormField
Input
Textarea
Select
SearchInput
Badge
Table
Pagination
Modal
ConfirmDialog
Skeleton
EmptyState
Alert
```

Component khusus Product:

```txt
ProductToolbar
ProductTable
ProductCard
ProductCardList
ProductDetail
ProductForm
ProductImage
```

Tidak perlu menambahkan primitive baru kecuali kebutuhan tersebut benar-benar muncul dan memberi manfaat yang jelas.
