# Arsitektur Frontend Product Catalog Admin

Frontend menggunakan pendekatan **domain-oriented + sederhana**, disesuaikan dengan requirement technical test.

Aplikasi hanya memiliki satu domain utama:

```txt
products
```

Arsitektur sengaja dibuat ringkas agar tidak over-engineered.

Tech stack utama:

- Vite
- React
- TypeScript
- Zustand
- Tailwind CSS
- DummyJSON Products API
- localStorage

Tidak ada:

- login
- authentication
- role / permission
- backend custom
- database custom
- dark mode
- dashboard kompleks

---

## Daftar Isi

- [Status Arsitektur Saat Ini](#status-arsitektur-saat-ini)
- [Prinsip Arsitektur](#prinsip-arsitektur)
- [Struktur Folder](#struktur-folder)
- [Domain Utama](#domain-utama)
- [Data Source](#data-source)
- [Data Flow](#data-flow)
- [Product Service](#product-service)
- [Zustand Store](#zustand-store)
- [Local Persistence](#local-persistence)
- [Search Filter Sort dan Pagination](#search-filter-sort-dan-pagination)
- [Routing](#routing)
- [UI Composition](#ui-composition)
- [Styling](#styling)
- [Aturan Dependency](#aturan-dependency)
- [Standar Penulisan Kode](#standar-penulisan-kode)
- [Aksesibilitas dan UX](#aksesibilitas-dan-ux)
- [Quality Gate](#quality-gate)
- [Hal yang Sengaja Tidak Digunakan](#hal-yang-sengaja-tidak-digunakan)

---

# Status Arsitektur Saat Ini

Update verifikasi terakhir: 29 Juli 2026.

Status arsitektur yang saat ini benar-benar aktif di code:

- `src/main.tsx` sudah merender `App`.
- `src/app/app.tsx` langsung merender `ProductsPage`.
- `src/app/router.tsx` masih kosong dan belum dipakai.
- Jalur aktif aplikasi saat ini adalah `ProductsPage -> ProductToolbar/ProductTable/ProductCardList -> useProductStore -> product.service.ts`.
- `product.service.ts` sudah menangani `getProducts`, `searchProducts`, `getCategories`, `getProductsByCategory`, dan `getProductById`.
- `product.store.ts` sudah menangani list products, query state, selected product, local CRUD state, dan persistence lewat `zustand/middleware/persist`.
- `product-state.ts` sudah dipakai untuk merge API products dengan `createdProducts`, `updatedProducts`, dan `deletedProductIds`.
- `src/lib/storage.ts` belum dipakai karena persistence saat ini terpusat langsung di store.
- `src/styles/index.css` saat ini hanya berisi base style, token warna, dan theme mapping Tailwind.
- Primitive UI global di `src/components/ui` mayoritas sudah ada implementasinya.
- `Topbar` sudah ada di `src/components/layout/topbar.tsx`, tetapi belum dipasang ke halaman aktif.
- Feature components yang sudah aktif dipakai di halaman: `product-toolbar.tsx`, `product-table.tsx`, `product-card.tsx`, `product-card-list.tsx`, `product-detail.tsx`, `product-form.tsx`, dan `products-page.tsx`.
- File feature yang masih kosong saat ini: `product-image.tsx`.
- Validasi form sudah terhubung ke UI melalui `ProductForm + react-hook-form + zodResolver(productFormSchema)`.
- Persistence local CRUD sudah diverifikasi di level runtime store dengan simulasi rehydrate `localStorage`.

---

# Prinsip Arsitektur

Prioritas utama:

```txt
Benar
↓
Mudah dibaca
↓
Sederhana
↓
Mudah dirawat
↓
Reusable jika memang diperlukan
```

Aturan:

- Jangan membuat abstraction sebelum benar-benar diperlukan.
- Jangan membuat folder kosong.
- Product page hanya menyusun component.
- API request tidak ditulis langsung di component.
- Zustand menjadi pemilik utama product state.
- localStorage hanya menyimpan perubahan local.
- UI primitive tidak menyimpan business logic.
- State kecil seperti modal open/close tetap menggunakan local state.
- Tidak perlu membuat banyak domain karena aplikasi hanya berfokus pada product catalog.
- Search, filter, sort, dan pagination harus tetap sinkron.

---

# Struktur Folder

Struktur yang direkomendasikan:

```txt
src/
├── app/
│   ├── app.tsx
│   └── router.tsx
│
├── components/
│   ├── layout/
│   │   └── topbar.tsx
│   │
│   └── ui/
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── confirm-dialog.tsx
│       ├── empty-state.tsx
│       ├── form-field.tsx
│       ├── icon-button.tsx
│       ├── input.tsx
│       ├── modal.tsx
│       ├── pagination.tsx
│       ├── search-input.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── table.tsx
│       └── textarea.tsx
│
├── features/
│   └── products/
│       ├── components/
│       │   ├── product-card.tsx
│       │   ├── product-card-list.tsx
│       │   ├── product-detail.tsx
│       │   ├── product-form.tsx
│       │   ├── product-image.tsx
│       │   ├── product-table.tsx
│       │   └── product-toolbar.tsx
│       │
│       ├── pages/
│       │   └── products-page.tsx
│       │
│       ├── services/
│       │   └── product.service.ts
│       │
│       ├── store/
│       │   └── product.store.ts
│       │
│       ├── types/
│       │   └── product.ts
│       │
│       └── utils/
│           └── product-state.ts
│
├── hooks/
│   └── use-debounce.ts
│
├── lib/
│   └── storage.ts
│
├── styles/
│   └── index.css
│
├── utils/
│   ├── format-number.ts
│   └── pagination.ts
│
└── main.tsx
```

Struktur dibuat berdasarkan kebutuhan nyata.

Tidak perlu menambahkan folder baru jika belum digunakan.

Catatan snapshot code saat ini:

- `src/components/classnames.ts` sudah ada sebagai helper kecil untuk join class string.
- `src/features/products/schemas/product-form.schema.ts` sudah ada sebagai pondasi validasi form.
- `src/lib/storage.ts` dan `src/utils/pagination.ts` masih kosong.

---

# Domain Utama

Aplikasi hanya memiliki satu feature utama:

```txt
features/products/
```

Tanggung jawab domain Product:

- fetch products
- fetch categories
- search
- filter
- sort
- pagination
- selected product
- detail product
- create
- update
- delete
- merge API dan local changes
- persistence local CRUD

---

## Product Components

```txt
product-toolbar.tsx
product-table.tsx
product-card.tsx
product-card-list.tsx
product-detail.tsx
product-form.tsx
```

### `product-toolbar.tsx`

Tanggung jawab:

- search input
- category filter
- sort selection
- add product button

Tidak melakukan fetch langsung.

---

### `product-table.tsx`

Tanggung jawab:

- render product rows untuk desktop/tablet
- thumbnail
- title
- category
- price
- rating
- stock
- action buttons

Tidak memiliki logic request API.

---

### `product-card.tsx` dan `product-card-list.tsx`

Tanggung jawab:

- render product list pada mobile
- menggunakan data yang sama dengan `ProductTable`
- menampilkan thumbnail, title, brand/category, price, rating, stock, dan actions
- boleh menyusun UI dari primitive global `Card` dan `CardList`

Tidak memiliki store atau query state terpisah khusus mobile.

---

### `product-detail.tsx`

Tanggung jawab:

- menampilkan detail selected product
- image
- title
- brand
- category
- price
- discount
- rating
- stock
- description

Dapat dirender di dalam modal atau drawer.

---

### `product-form.tsx`

Digunakan untuk:

```txt
Create Product
Edit Product
```

Form create dan edit memakai component yang sama.

Perbedaan ditentukan dari:

```txt
mode = create
atau
mode = edit
```

---

# Data Source

Sumber data aplikasi terdiri dari dua bagian:

```txt
DummyJSON API
+
Local Changes
```

DummyJSON menjadi sumber data awal.

Local changes berasal dari:

```txt
created products
updated products
deleted product IDs
```

---

# DummyJSON API

Endpoint utama:

## Product List

```txt
GET https://dummyjson.com/products?limit=10&skip=0
```

## Search

```txt
GET https://dummyjson.com/products/search?q=phone
```

## Categories

```txt
GET https://dummyjson.com/products/categories
```

## Category

```txt
GET https://dummyjson.com/products/category/smartphones
```

## Detail

```txt
GET https://dummyjson.com/products/:id
```

---

# Data Flow

Alur initial load:

```txt
App Start
   |
   v
Hydrate localStorage
   |
   v
Load product query state
   |
   v
Fetch DummyJSON
   |
   v
Merge API data + local changes
   |
   v
Render products
```

CRUD:

```txt
Create / Edit / Delete
        |
        v
Product Store
        |
        v
Update Local Changes
        |
        v
Persist localStorage
        |
        v
Recalculate Visible Products
        |
        v
Update UI
```

---

# Product Service

Semua request DummyJSON berada di:

```txt
features/products/services/product.service.ts
```

Service minimal:

```ts
getProducts()
searchProducts()
getCategories()
getProductsByCategory()
getProductById()
```

Contoh kontrak:

```ts
type GetProductsParams = {
  limit: number;
  skip: number;
};
```

Response list:

```ts
type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
```

---

## Tanggung Jawab Service

Service boleh:

- memanggil `fetch`
- membangun URL query
- parsing response
- normalisasi error sederhana

Service tidak boleh:

- membuka modal
- mengubah route
- menampilkan toast
- mengubah localStorage
- mengakses React component state

---

# Zustand Store

Zustand menjadi owner utama state product.

File:

```txt
features/products/store/product.store.ts
```

State minimal:

```ts
type ProductState = {
  products: Product[];
  selectedProduct: Product | null;

  categories: ProductCategory[];

  page: number;
  limit: number;
  total: number;

  search: string;
  category: string;
  sortBy: ProductSortField;
  sortOrder: SortOrder;

  isLoading: boolean;
  error: string | null;

  createdProducts: Product[];
  updatedProducts: Record<number, Product>;
  deletedProductIds: number[];
};
```

Action:

```txt
fetchProducts
fetchCategories
fetchProductDetail

setSelectedProduct

setSearch
setCategory
setSort
setPage

createProduct
updateProduct
deleteProduct

hydrateLocalChanges
clearError
```

Behavior action CRUD:

```txt
createProduct
-> tambah ke createdProducts

updateProduct
-> jika product API: updatedProducts[id] = latestProduct
-> jika product local: update item di createdProducts

deleteProduct
-> jika product API: tambah id ke deletedProductIds
-> jika product local: remove dari createdProducts
```

---

# State yang Tidak Perlu Masuk Zustand

Gunakan local component state untuk:

```txt
isCreateModalOpen
isEditModalOpen
isDetailModalOpen
isDeleteDialogOpen
form sementara
hover
dropdown kecil
```

Zustand tidak perlu menyimpan semua state UI.

---

# Source of Truth

Product yang tampil dihitung dari:

```txt
API Products
+
Created Products
+
Updated Products
-
Deleted Product IDs
=
Visible Products
```

Aturan:

- API product menjadi baseline.
- Created product ditambahkan ke baseline.
- Updated product menggantikan versi API berdasarkan `product.id`.
- Deleted product tidak ditampilkan.
- Local changes tetap berlaku setelah refresh atau browser dibuka kembali.
- `visibleProducts` adalah derived data dan tidak menjadi persistence source baru.

Urutan merge:

```txt
API Products
    |
    v
Remove Deleted IDs
    |
    v
Apply Local Updates
    |
    v
Append Created Products
    |
    v
Visible Products
```

Contoh fungsi:

```ts
function mergeProducts(
  apiProducts: Product[],
  createdProducts: Product[],
  updatedProducts: Record<number, Product>,
  deletedProductIds: number[],
): Product[] {
  const mergedApiProducts = apiProducts
    .filter(
      (product) =>
        !deletedProductIds.includes(product.id),
    )
    .map(
      (product) =>
        updatedProducts[product.id] ?? product,
    );

  return [
    ...mergedApiProducts,
    ...createdProducts,
  ];
}
```

Aturan penting:

```txt
updatedProducts[product.id] ada
-> pakai versi local

tidak ada
-> pakai versi API
```

---

# Local Persistence

localStorage hanya digunakan untuk perubahan client.

State yang dipersist:

```ts
createdProducts: Product[];
updatedProducts: Record<number, Product>;
deletedProductIds: number[];
```

Tidak perlu mempersist:

```txt
products dari API
visibleProducts
selectedProduct
isLoading
error
modal state
search input sementara
```

Tujuannya menjaga satu source of truth yang jelas.

---

## Struktur `updatedProducts`

`updatedProducts` menggunakan:

```ts
Record<number, Product>
```

Artinya `product.id` menjadi key.

Contoh:

```ts
updatedProducts = {
  1: {
    id: 1,
    title: "iPhone Pro Max",
    price: 1299,
  },

  2: {
    id: 2,
    title: "MacBook Air",
    price: 1399,
  },
};
```

Jika product ID `1` diedit lagi:

```ts
const nextUpdatedProducts = {
  ...updatedProducts,
  [product.id]: product,
};
```

Maka key `1` lama ditimpa oleh versi terbaru.

Tidak ada history edit di persistence.

---

## Aturan CRUD Berdasarkan Source Product

Product dibedakan secara konseptual menjadi:

```txt
API Product
Local Product
```

### API Product

Berasal dari DummyJSON.

```txt
Edit
-> updatedProducts[id]

Delete
-> deletedProductIds
```

### Local Product

Berasal dari `createdProducts`.

```txt
Edit
-> update item di createdProducts

Delete
-> remove item dari createdProducts
```

Dengan aturan ini, tidak terjadi duplikasi persistence.

---

## Hydration

Saat aplikasi start:

```txt
App Start
   |
   v
Persist Middleware / Storage Layer membaca localStorage
   |
   v
Hydrate local changes ke Zustand
   |
   v
Fetch API Products
   |
   v
mergeProducts()
   |
   v
Visible Products
```

Hydration memastikan local changes tersedia kembali sebelum atau saat data API digabung.

---

## Zustand Persist Middleware

Direkomendasikan menggunakan:

```txt
zustand/middleware -> persist
```

Persist hanya subset state:

```ts
partialize: (state) => ({
  createdProducts: state.createdProducts,
  updatedProducts: state.updatedProducts,
  deletedProductIds: state.deletedProductIds,
})
```

Keuntungan:

- tidak perlu memanggil `JSON.stringify()` dan `JSON.parse()` di setiap action
- persistence tetap terpusat
- state temporary tidak ikut tersimpan
- sesuai dengan kebutuhan technical test

Jika memilih abstraction manual, gunakan `src/lib/storage.ts`.

Jangan menggunakan dua mekanisme persistence sekaligus tanpa alasan.

---

## Storage Layer

Jika tidak memakai Zustand persist middleware, gunakan helper:

```txt
src/lib/storage.ts
```

Contoh fungsi:

```ts
loadCreatedProducts()
saveCreatedProducts()

loadUpdatedProducts()
saveUpdatedProducts()

loadDeletedProductIds()
saveDeletedProductIds()
```

Tujuan:

- localStorage logic tidak tersebar
- mudah diganti jika persistence berubah
- store tetap lebih mudah dibaca

---

## Visible Products sebagai Derived Data

`visibleProducts` tidak disimpan ke localStorage.

Ia dihitung dari:

```txt
API Products
+
Created Products
+
Updated Products
-
Deleted IDs
```

Contoh:

```ts
const visibleProducts = mergeProducts(
  products,
  createdProducts,
  updatedProducts,
  deletedProductIds,
);
```

Prinsip:

```txt
Jika data bisa dihitung ulang dari source state,
jangan membuat persistence kedua untuk data tersebut.
```

Ini menghindari state ganda yang mudah tidak sinkron.

---

## Persistence Lifecycle

```txt
Create / Edit / Delete
        |
        v
Update Zustand Local Changes
        |
        v
Persist ke localStorage
        |
        v
UI Re-render
```

Saat refresh/browser dibuka kembali:

```txt
localStorage
     |
     v
Hydrate Zustand
     |
     v
Fetch DummyJSON
     |
     v
Merge
     |
     v
UI
```
# Search Filter Sort dan Pagination

Search, filter, sort, dan pagination diperlakukan sebagai satu query state.

Tujuan utamanya:

```txt
UI Query State
     |
     v
Product Store
     |
     v
Product Service
     |
     v
DummyJSON
```

Component tidak menyusun URL API sendiri.

---

## Search

Search menggunakan dua state berbeda.

### Local Input State

```txt
searchInput
```

Disimpan dekat `ProductToolbar` atau `ProductsPage`.

Nilai ini langsung mengikuti keyboard agar input terasa responsif.

### Store Query State

```txt
search
```

Disimpan di Zustand dan baru diperbarui setelah debounce.

Direkomendasikan:

```txt
400 ms
```

Flow:

```txt
User mengetik
   |
   v
setSearchInput()
   |
   v
useDebounce(400ms)
   |
   v
setSearch()
   |
   v
setPage(1)
   |
   v
fetchProducts()
   |
   v
GET /products/search?q={search}&limit={limit}&skip=0
```

Tidak perlu:

```txt
Enter
Search Button
request setiap karakter
```

Search utama tidak menggunakan client-side `.filter()` terhadap 10 product pada page aktif karena data tersebut tidak mewakili seluruh dataset.

---

## Filter Category

State:

```txt
category
```

Default:

```txt
all
```

Saat category berubah:

```txt
setCategory(category)
setPage(1)
fetchProducts()
```

Service menggunakan endpoint category:

```txt
GET /products/category/{category}?limit={limit}&skip={skip}
```

Category list diambil satu kali dari:

```txt
GET /products/categories
```

---

## Sort

State:

```ts
type ProductSortField =
  | "title"
  | "price"
  | "rating"
  | "stock";

type SortOrder =
  | "asc"
  | "desc";
```

Saat sort berubah:

```txt
setSort()
setPage(1)
fetchProducts()
```

Untuk list products, DummyJSON mendukung query:

```txt
sortBy
order
```

Contoh:

```txt
GET /products?limit=10&skip=0&sortBy=price&order=asc
```

Local created/updated data tetap diterapkan setelah response API diterima agar perubahan client tetap menjadi source of truth untuk item yang dimodifikasi.

---

## Pagination

State utama:

```txt
page
limit
total
```

Derived:

```txt
skip = (page - 1) * limit
totalPages = Math.ceil(total / limit)
```

Default:

```txt
page = 1
limit = 10
```

Pagination selalu menggunakan pola `limit + skip`.

Normal:

```txt
page 1 -> GET /products?limit=10&skip=0
page 2 -> GET /products?limit=10&skip=10
```

Search:

```txt
search = "phone"

page 1
-> GET /products/search?q=phone&limit=10&skip=0

page 2
-> GET /products/search?q=phone&limit=10&skip=10
```

Dengan demikian Search dan Pagination bekerja bersama.

---

## Query Synchronization

Aturan wajib:

```txt
search berubah    -> page = 1
category berubah  -> page = 1
sort berubah      -> page = 1
limit berubah     -> page = 1

page berubah
-> search/category/sort tetap dipertahankan
```

Flow page change:

```txt
User click page 2
       |
       v
setPage(2)
       |
       v
skip = 10
       |
       v
fetchProducts()
       |
       v
request memakai query aktif yang sama
```

---

## Request Strategy

Product store menentukan query aktif, sedangkan service menentukan endpoint.

Konsep:

```txt
Tidak ada search/category
-> getProducts()

Search aktif
-> searchProducts()

Category aktif
-> getProductsByCategory()
```

Parameter pagination tetap diteruskan:

```ts
type ProductQuery = {
  limit: number;
  skip: number;
  sortBy: ProductSortField;
  sortOrder: SortOrder;
};
```

Untuk search:

```ts
type ProductSearchQuery = ProductQuery & {
  search: string;
};
```

Product component tidak perlu mengetahui detail URL.

---

## Loading pada Query

Setiap request list:

```txt
isLoading = true
```

Setelah berhasil:

```txt
products = mergedResult
total = response.total
isLoading = false
```

Jika gagal:

```txt
error = normalizedError
isLoading = false
```

Request lama sebaiknya tidak menimpa hasil query terbaru jika user mengetik atau mengganti filter dengan cepat. Implementasi sederhana dapat menggunakan `AbortController` pada service/store jika diperlukan.

---

## Infinite Scroll

Tidak digunakan.

Requirement meminta pagination dengan `limit` dan `skip`.

Jadi pola final:

```txt
Previous | 1 | 2 | 3 | Next
```

bukan:

```txt
scroll bawah -> load data berikutnya
```

# Routing

Routing tidak wajib kompleks.

Karena aplikasi hanya memiliki satu domain utama, pilihan paling sederhana:

```txt
/
```

atau:

```txt
/products
```

Detail, create, edit, dan delete ditampilkan melalui:

```txt
Modal / Dialog
```

React Router DOM hanya perlu digunakan jika memang ingin route eksplisit atau halaman 404.

Tidak perlu membuat routing kompleks.

---

# UI Composition

Struktur halaman utama:

```txt
Topbar

ProductsPage
├── PageHeader
├── ProductToolbar
│   ├── SearchInput
│   ├── Category Select
│   ├── Sort Select
│   └── Add Product Button
│
├── ProductTable                 # desktop / tablet
├── ProductCardList              # mobile
│
└── Pagination
```

Overlay:

```txt
Product Detail Modal
Product Create/Edit Modal
Delete Confirm Dialog
```

---

# Reusable UI

Primitive yang benar-benar dibutuhkan:

```txt
Button
Input
Select
FormField
SearchInput
Badge
Table
Pagination
Modal
ConfirmDialog
Skeleton
EmptyState
```

Tidak perlu membuat component library terlalu besar.

Pindahkan component ke global `components/ui` hanya jika memang reusable.

---

# Styling

Gunakan Tailwind CSS.

Tidak ada light/dark mode.

Design direction:

- background abu sangat muda
- surface putih
- text gelap
- satu primary color
- border tipis
- radius sedang
- shadow ringan
- spacing konsisten

---

## Color Token

Cukup gunakan:

```txt
background
surface
text
muted
border
primary
success
warning
danger
```

Contoh:

```css
:root {
  --background: #f7f8fc;
  --surface: #ffffff;
  --text: #18254b;
  --muted: #7d89a8;
  --border: #e5e9f2;
  --primary: #1f6fe5;
  --success: #16a34a;
  --warning: #d98b00;
  --danger: #dc3f62;
}
```

Tidak perlu:

```txt
ThemeProvider
ThemeSwitcher
dark palette
system theme detection
```

---

# Responsive Layout

## Desktop

```txt
Topbar

Page Title                  Add Product

Search | Category | Sort

Product Table

Pagination
```

## Mobile

```txt
Topbar

Page Title

Add Product

Search

Category

Sort

Product Card List

Pagination
```

Tidak perlu sidebar karena aplikasi hanya memiliki satu halaman utama.

---

# Aturan Dependency

Dependency direction:

```txt
app
 ↓
features/products
 ↓
components/ui

features/products
 ↓
product.service

features/products
 ↓
storage

features/products
 ↓
utils
```

Aturan:

- `components/ui` tidak mengimpor feature.
- Product page tidak mengimpor mock data.
- Product component tidak memanggil fetch langsung.
- Service tidak mengakses React state.
- Storage helper tidak mengetahui UI.
- Utility hanya berisi fungsi murni.
- Satu module tidak boleh memiliki terlalu banyak tanggung jawab.

---

# Standar Penulisan Kode

## Penamaan

| Elemen | Aturan | Contoh |
|---|---|---|
| File/folder | `kebab-case` | `product-detail.tsx` |
| Component | `PascalCase` | `ProductDetail` |
| Function | `camelCase` | `mergeProducts` |
| Hook | awalan `use` | `useDebounce` |
| Type | `PascalCase` | `Product` |
| Boolean | `is`, `has`, `can` | `isLoading` |
| Handler | awalan `handle` | `handleDelete` |
| Callback prop | awalan `on` | `onSuccess` |

---

# TypeScript

- Gunakan `strict`.
- Hindari `any`.
- Hindari `@ts-ignore`.
- Gunakan type untuk API response.
- Gunakan type terpisah untuk product.
- Tangani optional field seperti `brand` dengan aman.
- Hindari non-null assertion jika tidak diperlukan.
- Utility dan service public memiliki return type yang jelas.

---

# React

- Page tetap tipis.
- Jangan menaruh seluruh logic di satu component.
- Jangan fetch langsung dari table atau form component.
- Jangan simpan derived data menggunakan `useEffect` jika bisa dihitung langsung.
- Modal open/close tetap local state.
- Gunakan stable `product.id` sebagai key.
- Loading, error, dan empty state harus eksplisit.
- Form create dan edit menggunakan component yang sama.

---

# Product State Utility

Logic merge sebaiknya dipisahkan:

```txt
features/products/utils/product-state.ts
```

Contoh fungsi:

```ts
mergeProducts()
applyLocalUpdates()
removeDeletedProducts()
sortProducts()
```

Fungsi tersebut sebaiknya pure function agar mudah diuji.

---

# Formatting

Gunakan helper:

```txt
src/utils/format-number.ts
```

Contoh:

```ts
formatPrice()
formatRating()
```

Untuk price gunakan locale:

```txt
en-US
```

Contoh tampilan:

```txt
$29.99
```

Jangan format angka langsung berulang di component.

---

# Aksesibilitas dan UX

Minimum:

- input memiliki label
- search memiliki accessible label
- button action memiliki teks jelas
- icon-only button memiliki `aria-label`
- delete memakai confirmation
- disabled state saat submit
- loading state terlihat
- image memiliki `alt`
- image gagal memakai fallback
- modal dapat ditutup
- focus state terlihat
- product table digunakan pada desktop/tablet
- product card list digunakan pada mobile
- error menjelaskan masalah secara jelas

---

# Quality Gate

Sebelum dianggap selesai:

```bash
npm run lint
npm run typecheck
npm run build
```

Pastikan:

```txt
tidak ada TypeScript error
tidak ada lint error
tidak ada console debug
tidak ada import tidak terpakai
tidak ada broken image
tidak ada route rusak
```

Uji flow:

```txt
initial fetch
loading
error
retry
empty search

pagination
search
category filter
sort

view detail

create
edit
delete

refresh browser

created product tetap ada
updated product tetap berubah
deleted product tetap hilang

desktop
mobile
```

---

# Checklist Review Arsitektur

Sebelum menambah kode baru:

- Apakah ini memang bagian requirement?
- Apakah component baru benar-benar diperlukan?
- Apakah state harus berada di Zustand?
- Apakah state cukup local?
- Apakah request seharusnya berada di service?
- Apakah persistence hanya menyimpan created/updated/deleted?
- Apakah `visibleProducts` tetap derived dan tidak dipersist?
- Apakah edit API product hanya menyimpan versi terbaru per ID?
- Apakah edit/delete local product langsung mengubah `createdProducts`?
- Apakah localStorage logic sudah melalui persist middleware atau storage helper?
- Apakah search/filter/sort/page tetap sinkron?
- Apakah loading/error/empty sudah ditangani?
- Apakah mobile masih usable?
- Apakah solusi bisa dibuat lebih sederhana?

---

# Hal yang Sengaja Tidak Digunakan

Arsitektur ini sengaja tidak memakai:

```txt
Login
Authentication
Protected Route
Role
Permission
RBAC

Backend custom
Database custom
Swagger
JWT

Dark mode
Theme switcher
Theme provider

Redux
React Query
Micro frontend
Feature flag
Storybook
Chart library
Animation library
Internationalization
Generated API client
```

Library baru hanya ditambahkan jika ada kebutuhan nyata.

---

# Ringkasan Akhir

Arsitektur utama:

```txt
DummyJSON API
+
Product Feature
+
Product Service
+
Zustand
+
localStorage
+
Reusable UI
```

Struktur utama:

```txt
app
components
features/products
hooks
lib
styles
utils
```

Fokus utama:

```txt
data fetching
search
filter
sort
pagination
detail
client CRUD
persistence
responsive UI
loading
error
empty state
```

Tujuan arsitektur ini adalah membuat **Product Catalog Admin yang rapi, sederhana, mudah dikembangkan, dan tidak over-engineered**.
