# Dokumentasi Frontend Product Catalog Admin

Dokumen ini menjadi referensi utama pengerjaan **Frontend Developer Technical Test - Product Catalog Admin**.

Aplikasi menggunakan **Vite + React + TypeScript + Zustand**. Data awal diambil dari **DummyJSON Products API**, sedangkan fitur create, update, dan delete dilakukan di sisi client menggunakan Zustand dan dipersist ke `localStorage`.

Tidak ada backend atau database custom yang perlu dibuat.

## Daftar Isi

- [Ringkasan Sistem](#ringkasan-sistem)
- [Pilihan Assessment](#pilihan-assessment)
- [Scope Frontend](#scope-frontend)
- [Tech Stack](#tech-stack)
- [Sumber Data](#sumber-data)
- [Data Model Product](#data-model-product)
- [Daftar Halaman](#daftar-halaman)
- [Alur Data](#alur-data)
- [Product List](#product-list)
- [Product Detail](#product-detail)
- [CRUD Product](#crud-product)
- [Search Filter Sort dan Pagination](#search-filter-sort-dan-pagination)
- [Zustand State Management](#zustand-state-management)
- [LocalStorage Persistence](#localstorage-persistence)
- [Loading Error dan Empty State](#loading-error-dan-empty-state)
- [Responsive Design](#responsive-design)
- [Validasi dan Feedback](#validasi-dan-feedback)
- [Struktur Folder](#struktur-folder)
- [Prioritas Pengerjaan](#prioritas-pengerjaan)
- [Checklist Penyelesaian](#checklist-penyelesaian)
- [Out of Scope](#out-of-scope)

## Ringkasan Sistem

Product Catalog Admin adalah aplikasi frontend sederhana untuk melihat dan mengelola katalog produk.

Fitur utama:

- melihat daftar produk
- mencari produk
- filter berdasarkan category
- sorting
- pagination
- melihat detail produk
- membuat produk baru
- mengubah produk
- menghapus produk
- menyimpan perubahan local setelah browser refresh

Data awal berasal dari DummyJSON API.

Perubahan yang dibuat user disimpan melalui:

```txt
Zustand
+
localStorage
```

## Pilihan Assessment

Dokumentasi ini untuk aplikasi:

```txt
Product Catalog Admin
```

Alasan:

- cocok untuk menunjukkan CRUD frontend
- cocok untuk menunjukkan state management
- mudah menunjukkan search, filter, sort, dan pagination
- cocok dengan UI admin yang sederhana
- scope lebih mudah dikontrol untuk technical test

## Scope Frontend

Fitur yang dikerjakan:

1. Product list
2. Product detail
3. Search
4. Filter category
5. Sort
6. Pagination
7. Create product
8. Edit product
9. Delete product
10. localStorage persistence
11. Loading state
12. Error state
13. Empty state
14. Form validation
15. Delete confirmation
16. Success/error feedback
17. Image fallback
18. Responsive desktop dan mobile
19. Zustand state management

Tidak perlu menambahkan fitur tambahan jika fitur utama belum solid.

## Tech Stack

### Wajib

- Vite
- React
- TypeScript
- Zustand
- DummyJSON API

### Pendukung yang Direkomendasikan

- React Router DOM
- Tailwind CSS
- React Icons
- React Hook Form
- Zod

Dependency tambahan hanya digunakan jika benar-benar membantu.

## Sumber Data

### Product List

```txt
GET https://dummyjson.com/products?limit=10&skip=0
```

Digunakan untuk list produk dan pagination awal.

### Search

```txt
GET https://dummyjson.com/products/search?q=phone&limit=10&skip=0
```

Search menggunakan request `GET` ke DummyJSON, bukan hanya melakukan `.filter()` terhadap 10 product yang sedang tampil.

Input search **tidak memerlukan tombol Search atau Enter**. Nilai input berubah langsung saat user mengetik, tetapi request API baru dijalankan setelah debounce sekitar `400 ms`.

Contoh:

```txt
User mengetik "iphone"
        |
        v
SearchInput langsung berubah
        |
        v
Tunggu 400 ms setelah ketikan terakhir
        |
        v
Set query search
        |
        v
Reset page = 1
        |
        v
GET /products/search?q=iphone&limit=10&skip=0
```

Dengan pendekatan ini UI tetap terasa realtime tanpa mengirim request pada setiap karakter.

### Categories

```txt
GET https://dummyjson.com/products/categories
```

### Product by Category

```txt
GET https://dummyjson.com/products/category/smartphones
```

### Product Detail

```txt
GET https://dummyjson.com/products/:id
```

### CRUD

Create, update, dan delete tidak bergantung pada persistence DummyJSON.

```txt
User Action
   |
   v
Zustand Store
   |
   v
localStorage
```

DummyJSON tetap menjadi sumber data awal.

## Data Model Product

Type minimal:

```ts
type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images?: string[];
};
```

Custom product menggunakan struktur yang sama.

ID custom product dapat dibuat di sisi client menggunakan helper stabil, misalnya `Date.now()`.

## Daftar Halaman

### 1. Product Catalog

Route utama:

```txt
/products
```

atau cukup:

```txt
/
```

Fitur:

- product list responsive
  - desktop/tablet menggunakan `ProductTable`
  - mobile menggunakan `ProductCardList`
  - setiap item pada `ProductCardList` menggunakan `ProductCard`
- search
- category filter
- sort
- pagination
- add product
- product detail
- edit product
- delete product
- loading
- error
- empty state

Untuk technical test ini direkomendasikan menggunakan **`ProductTable` pada desktop/tablet** karena cocok dengan konteks admin catalog, sedangkan pada mobile menggunakan **`ProductCardList`** agar informasi produk lebih nyaman dibaca pada layar kecil.

### 2. Product Detail

Gunakan:

```txt
Modal
atau
Drawer
```

Rekomendasi:

```txt
Detail modal / drawer sederhana
```

Detail minimal:

- image
- title
- brand
- category
- price
- discount
- stock
- rating
- description

Tidak perlu gallery atau carousel kompleks.

### 3. Not Found

Jika menggunakan routing:

```txt
*
```

Tampilkan halaman 404 sederhana.

## Alur Data

### Initial Load

```txt
Open App
   |
   v
Hydrate local changes
   |
   v
Fetch DummyJSON products
   |
   v
Merge API + local changes
   |
   v
Render product list
```

### Query State

```txt
Search
+
Category
+
Sort
+
Pagination
   |
   v
Product Result
```

### CRUD

```txt
Create / Edit / Delete
        |
        v
Update Zustand
        |
        v
Persist localStorage
        |
        v
Update UI
```

## Product List

Rekomendasi kolom:

| Product | Category | Price | Rating | Stock | Actions |
|---|---|---:|---:|---:|---|

Kolom Product dapat berisi:

```txt
thumbnail
title
brand
```

Actions:

```txt
View
Edit
Delete
```

Presentation product list:

```txt
Product List
│
├── Desktop / Tablet
│   └── ProductTable
│
└── Mobile
    └── ProductCardList
        └── ProductCard × banyak
```

Penjelasan:

- `ProductTable` menerima daftar product dan menampilkannya dalam bentuk table pada desktop/tablet.
- `ProductCardList` menerima daftar product dan menjadi pengganti `ProductTable` pada mobile.
- `ProductCard` hanya bertanggung jawab menampilkan **satu product** di dalam `ProductCardList`.
- `ProductCard` bukan pengganti modal detail.
- Action `View` pada `ProductTable` maupun `ProductCard` tetap membuka `ProductDetail` melalui modal/drawer yang sama.

Semua presentation tersebut menggunakan source data, search, filter, sort, pagination, dan CRUD state yang sama.

## Product Detail

Detail menampilkan:

```txt
Image
Title
Brand
Category
Price
Discount
Rating
Stock
Description
```

Jika image gagal dimuat, tampilkan fallback image.

## CRUD Product

### Create Product

Form minimal:

```txt
Title
Brand
Category
Price
Discount
Stock
Rating
Description
Thumbnail URL
```

Field wajib:

```txt
Title
Category
Price
Stock
Description
```

Flow:

```txt
Open Add Product
   |
   v
Fill Form
   |
   v
Validate
   |
   v
Create in Zustand
   |
   v
Persist localStorage
   |
   v
Close Modal
   |
   v
Success Feedback
```

### Edit Product

Edit menggunakan form yang sama dengan Create.

Setelah save:

```txt
Update Zustand
+
Persist localStorage
```

Perubahan harus tetap ada setelah refresh.

### Delete Product

Sebelum delete gunakan confirmation dialog.

Setelah delete:

```txt
Update Zustand
+
Persist deleted product ID
```

Product yang dihapus tidak boleh muncul kembali setelah refresh.

## Search Filter Sort dan Pagination

Search, filter, sort, dan pagination merupakan satu **query state** yang harus tetap sinkron.

Prinsip:

```txt
Search / Filter / Sort berubah
            |
            v
       Reset page = 1
            |
            v
     Hitung skip terbaru
            |
            v
     Request data terbaru
```

### Search

Search utama menggunakan DummyJSON:

```txt
GET /products/search?q={query}&limit={limit}&skip={skip}
```

Contoh:

```txt
GET https://dummyjson.com/products/search?q=phone&limit=10&skip=0
```

Search tidak membutuhkan Enter.

Gunakan dua nilai:

```txt
searchInput -> nilai yang langsung mengikuti keyboard
search      -> query yang sudah melewati debounce
```

`searchInput` cukup menjadi local state pada toolbar/page.

`search` menjadi query state di Zustand.

Flow:

```txt
User mengetik
   |
   v
setSearchInput()
   |
   v
Debounce 400 ms
   |
   v
setSearch()
   |
   v
setPage(1)
   |
   v
fetchProducts()
```

Contoh konsep:

```tsx
const [searchInput, setSearchInput] = useState("");

const debouncedSearch = useDebounce(searchInput, 400);

useEffect(() => {
  setSearch(debouncedSearch);
  setPage(1);
}, [debouncedSearch, setPage, setSearch]);
```

Tidak direkomendasikan menjadikan client-side `.filter()` terhadap product pada page aktif sebagai mekanisme search utama karena frontend hanya memegang sebagian hasil pagination.

### Filter Category

Category berasal dari:

```txt
GET /products/categories
```

Ketika category dipilih, service menggunakan resource category yang sesuai:

```txt
GET /products/category/{category}?limit={limit}&skip={skip}
```

Contoh:

```txt
GET /products/category/smartphones?limit=10&skip=0
```

Saat category berubah:

```txt
setCategory()
setPage(1)
fetchProducts()
```

Default:

```txt
category = "all"
```

### Sort

Minimal mendukung salah satu field requirement.

Direkomendasikan:

```txt
title
price
rating
stock
```

Pilihan UI:

```txt
Title A-Z
Price Low-High
Price High-Low
Rating High-Low
Stock High-Low
```

DummyJSON mendukung:

```txt
sortBy
order
```

Contoh list biasa:

```txt
GET /products?limit=10&skip=0&sortBy=price&order=asc
```

Type:

```ts
type SortOrder = "asc" | "desc";

type ProductSortField =
  | "title"
  | "price"
  | "rating"
  | "stock";
```

Saat sort berubah:

```txt
setSort()
setPage(1)
fetchProducts()
```

### Pagination

Pagination tetap digunakan. Tidak diganti dengan infinite scroll atau lazy loading.

State:

```ts
type PaginationState = {
  page: number;
  limit: number;
  skip: number;
  total: number;
  totalPages: number;
};
```

Default:

```txt
page = 1
limit = 10
```

Rumus:

```txt
skip = (page - 1) * limit
totalPages = Math.ceil(total / limit)
```

Contoh normal:

```txt
Page 1 -> /products?limit=10&skip=0
Page 2 -> /products?limit=10&skip=10
Page 3 -> /products?limit=10&skip=20
```

Contoh ketika search aktif:

```txt
Search = "phone"

Page 1
GET /products/search?q=phone&limit=10&skip=0

Page 2
GET /products/search?q=phone&limit=10&skip=10
```

Jadi Search dan Pagination **bekerja bersama**, bukan saling menggantikan.

### Aturan Sinkronisasi

```txt
Search berubah       -> page = 1
Category berubah     -> page = 1
Sort berubah         -> page = 1
Page berubah         -> query lain tetap
Limit berubah        -> page = 1
```

Saat user berpindah page, nilai `search`, `category`, dan `sort` tidak boleh hilang.

Saat request berlangsung:

```txt
isLoading = true
```

Hasil response memperbarui:

```txt
products
total
page/skip yang aktif
```

### Infinite Scroll

Tidak digunakan.

Requirement secara eksplisit meminta pagination menggunakan `limit` dan `skip`, sehingga implementasi yang dipilih tetap:

```txt
Previous | 1 | 2 | 3 | Next
```

bukan load data otomatis ketika user scroll.

## Zustand State Management

Zustand harus menjadi state utama aplikasi.

Rekomendasi:

```txt
product.store.ts
```

State minimal:

```ts
type ProductState = {
  products: Product[];
  selectedProduct: Product | null;

  page: number;
  limit: number;
  total: number;

  // Query yang sudah melewati debounce.
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
fetchProductDetail
setSelectedProduct
setSearch
setCategory
setSort
setPage
createProduct
updateProduct
deleteProduct
hydrateLocalData
clearError
```

### Source of Truth

```txt
API Products
+
Created Products
+
Updated Products
-
Deleted Products
=
Visible Products
```

Artinya:

- API menjadi baseline data.
- Product baru buatan user ditambahkan dari `createdProducts`.
- Product API yang pernah diedit menggunakan versi terbaru dari `updatedProducts`.
- Product API yang ID-nya ada di `deletedProductIds` tidak ditampilkan.
- Local changes tetap berlaku setelah refresh maupun ketika browser dibuka kembali.
- `visibleProducts` adalah hasil perhitungan, bukan data baru yang perlu dipersist.

Secara sederhana:

```txt
Ada local update untuk product ID tersebut?
        |
   +----+----+
   |         |
  Ya        Tidak
   |         |
Pakai      Pakai
Local      API
```

Contoh:

```txt
DummyJSON:
ID 1 -> iPhone, $999
ID 2 -> Laptop, $1,200
ID 3 -> Perfume, $50

Local Changes:
Updated ID 1 -> iPhone Pro, $1,099
Deleted ID 2
Created ID 1001 -> Gaming Mouse, $80

Visible Products:
ID 1    -> iPhone Pro, $1,099
ID 3    -> Perfume, $50
ID 1001 -> Gaming Mouse, $80
```

Urutan konseptual:

```txt
1. Ambil API Products
2. Sembunyikan product API yang sudah di-delete
3. Override product API yang sudah di-update
4. Tambahkan product hasil create
5. Hasilkan Visible Products
```

## LocalStorage Persistence

`localStorage persistence` digunakan agar perubahan CRUD buatan user tidak hilang setelah browser di-refresh atau ditutup lalu dibuka kembali.

Peran masing-masing:

```txt
DummyJSON
    ↓
Data awal / baseline

Zustand
    ↓
State aplikasi yang sedang berjalan

localStorage
    ↓
Menyimpan perubahan CRUD user agar tetap ada
```

### Data yang Dipersist

Hanya perubahan local:

```txt
createdProducts
updatedProducts
deletedProductIds
```

Contoh key:

```txt
product-catalog-created
product-catalog-updated
product-catalog-deleted
```

Tidak perlu menyimpan:

```txt
seluruh response API
visibleProducts
isLoading
error
selectedProduct
modal state
```

Alasannya:

- response API bisa diambil kembali dari DummyJSON
- `visibleProducts` bisa dihitung ulang dari API + local changes
- loading/error/modal bersifat temporary UI state

### Hydration

Saat aplikasi dibuka:

```txt
App Start
   |
   v
Baca localStorage
   |
   v
Hydrate created / updated / deleted ke Zustand
   |
   v
Fetch DummyJSON
   |
   v
Merge API + local changes
   |
   v
Render Visible Products
```

Proses membaca kembali localStorage dan memasukkannya ke state aplikasi disebut **hydration**.

### Behavior Create, Update, dan Delete

Ada dua jenis product:

```txt
1. API Product
   berasal dari DummyJSON

2. Local Product
   dibuat user di client
```

Aturan CRUD:

| Aksi | API Product | Local Product |
|---|---|---|
| Create | - | Tambah ke `createdProducts` |
| Edit | Simpan versi terbaru ke `updatedProducts[id]` | Update item langsung di `createdProducts` |
| Delete | Tambah ID ke `deletedProductIds` | Hapus item dari `createdProducts` |

### Create Product

Product baru buatan user masuk ke:

```ts
createdProducts: Product[];
```

Contoh:

```ts
createdProducts = [
  {
    id: 1001,
    title: "Gaming Mouse",
    price: 80,
  },
];
```

Product tersebut tetap muncul setelah refresh karena `createdProducts` dipersist.

### Update API Product

Product dari DummyJSON yang diedit disimpan berdasarkan ID:

```ts
updatedProducts: Record<number, Product>;
```

Contoh dua product berbeda:

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

Jika ID yang sama diedit berkali-kali, hanya versi terbaru yang disimpan.

Contoh:

```txt
Edit ID 1 pertama
-> iPhone Pro

Edit ID 1 kedua
-> iPhone Pro Max
```

Hasil persistence:

```ts
updatedProducts = {
  1: {
    id: 1,
    title: "iPhone Pro Max",
    price: 1299,
  },
};
```

Tidak menyimpan seluruh history edit karena requirement hanya membutuhkan kondisi product terbaru.

### Update Local Product

Jika product berasal dari `createdProducts`, edit langsung item tersebut di `createdProducts`.

Contoh:

```txt
Created:
ID 1001 -> Gaming Mouse, $80

Edit:
ID 1001 -> Gaming Mouse Pro, $100
```

Hasil:

```ts
createdProducts = [
  {
    id: 1001,
    title: "Gaming Mouse Pro",
    price: 100,
  },
];
```

Tidak perlu memasukkan ID 1001 ke `updatedProducts`.

### Delete API Product

Product dari DummyJSON tidak benar-benar dihapus dari server.

Simpan ID:

```ts
deletedProductIds = [2, 5, 8];
```

Saat API mengirim product dengan ID tersebut lagi, frontend menyembunyikannya.

### Delete Local Product

Jika product berasal dari `createdProducts`, hapus langsung dari array tersebut.

Tidak perlu menambahkan ID-nya ke `deletedProductIds` karena product tersebut memang tidak ada di DummyJSON.

### Persistence Setelah Refresh atau Browser Ditutup

```txt
Refresh browser
-> data local tetap ada

Tutup tab
-> data local tetap ada

Tutup browser lalu buka lagi
-> data local tetap ada
```

Data baru hilang jika:

- user menghapus site data/localStorage
- aplikasi memanggil `removeItem`
- aplikasi memanggil `clear`
- browser berjalan dalam kondisi storage sementara/private tertentu

### Zustand Persist Middleware

Direkomendasikan menggunakan Zustand `persist` middleware untuk menyimpan bagian state tertentu.

Yang dipersist:

```txt
createdProducts
updatedProducts
deletedProductIds
```

Contoh konsep:

```ts
partialize: (state) => ({
  createdProducts: state.createdProducts,
  updatedProducts: state.updatedProducts,
  deletedProductIds: state.deletedProductIds,
})
```

Dengan begitu, state temporary seperti `isLoading`, `error`, dan `selectedProduct` tidak ikut disimpan.

### Visible Products Tidak Dipersist

`visibleProducts` tidak disimpan ke localStorage.

Alasannya karena:

```txt
Visible Products
=
API Products
+
Local Changes
```

Artinya `visibleProducts` adalah **derived data**.

Jika bisa dihitung ulang dari source data lain, jangan membuat persistence kedua untuk data yang sama.
## Loading Error dan Empty State

### Loading

Gunakan:

```txt
Skeleton table
```

Untuk action:

```txt
Saving...
Deleting...
```

Button disabled selama proses.

### Error

Contoh:

```txt
Failed to load products.

[ Try Again ]
```

Error harus terlihat di UI.

### Empty

Tanpa data:

```txt
No products available.
```

Search/filter kosong:

```txt
No products match your current search or filter.
```

Boleh menyediakan tombol `Clear Filters`.

## Responsive Design

### Desktop

```txt
Topbar

Page Header

Search
Category Filter
Sort
Add Product

Product Table

Pagination
```

Sidebar tidak wajib karena aplikasi hanya memiliki satu domain utama.

### Mobile

Toolbar menjadi stacked:

```txt
Search
Category
Sort
Add Product
```

Product list menggunakan:

```txt
ProductCardList
```

Pagination tetap berada di bawah card list.

Modal hampir full-width dan dapat scroll jika form panjang.

## Validasi dan Feedback

### Validasi minimal

```txt
Title       required
Category    required
Price       required, >= 0
Stock       required, >= 0
Rating      0 - 5
Discount    0 - 100
Description required
```

Error ditampilkan dekat field.

### Feedback sukses

```txt
Product created successfully.
Product updated successfully.
Product deleted successfully.
```

Boleh menggunakan toast atau inline alert sederhana.

### Image Fallback

Setiap image memiliki `alt`.

Jika thumbnail gagal dimuat, tampilkan placeholder sederhana.

## Struktur Folder

```txt
src/
│
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

Aplikasi hanya mempunyai satu domain utama:

```txt
products
```

Jadi tidak perlu terlalu banyak feature folder.

## Product Service

Semua request DummyJSON ditempatkan pada:

```txt
product.service.ts
```

Fungsi utama:

```ts
getProducts()
searchProducts()
getCategories()
getProductsByCategory()
getProductById()
```

Service menerima query seperti `limit`, `skip`, `sortBy`, dan `sortOrder`.

Contoh tanggung jawab endpoint:

```txt
search kosong + category all
-> GET /products?limit&skip&sortBy&order

search aktif
-> GET /products/search?q&limit&skip

category aktif
-> GET /products/category/{category}?limit&skip
```

Component tidak menentukan URL secara langsung.

Component tidak memanggil `fetch()` secara tersebar.

Service tidak bertanggung jawab untuk membuka modal, routing, toast, atau form state.

## Prioritas Pengerjaan

```txt
1. Setup Vite + React + TypeScript
2. Setup Tailwind
3. Product type
4. Product service
5. Product Zustand store
6. Fetch product list
7. Loading / Error / Empty
8. Product table
9. Pagination
10. Search
11. Category filter
12. Sorting
13. Product detail
14. Create product
15. Edit product
16. Delete product
17. localStorage persistence
18. Form validation
19. Image fallback
20. Responsive mobile
21. Feedback action
22. README
```

## Checklist Penyelesaian

### Data Fetching

- [ ] Fetch products
- [ ] Fetch categories
- [ ] Product detail
- [ ] Loading
- [ ] Error
- [ ] Retry

### Product List

- [ ] Product table untuk desktop/tablet
- [ ] Product card list untuk mobile
- [ ] Product card untuk setiap item mobile
- [ ] ProductTable dan ProductCardList menggunakan source data yang sama
- [ ] Search menggunakan GET DummyJSON
- [ ] Debounced search tanpa Enter
- [ ] Search reset page ke 1
- [ ] Category filter
- [ ] Filter reset page ke 1
- [ ] Sort
- [ ] Sort reset page ke 1
- [ ] Pagination menggunakan limit + skip
- [ ] Search dan pagination tetap sinkron
- [ ] Empty state

### CRUD

- [ ] Create product
- [ ] Edit product
- [ ] Delete product
- [ ] Delete confirmation
- [ ] Form validation
- [ ] Success feedback
- [ ] Disabled action state

### Persistence

- [ ] Created product tetap ada setelah refresh
- [ ] Updated product tetap berubah setelah refresh
- [ ] Deleted product tetap hilang setelah refresh
- [ ] Local changes tetap ada setelah browser ditutup lalu dibuka kembali
- [ ] API product edit disimpan ke `updatedProducts[id]`
- [ ] Edit berulang pada ID yang sama hanya menyimpan versi terbaru
- [ ] Local product edit memperbarui `createdProducts`
- [ ] API product delete masuk ke `deletedProductIds`
- [ ] Local product delete menghapus item dari `createdProducts`
- [ ] `visibleProducts` tidak disimpan ke localStorage

### UX

- [ ] Desktop responsive
- [ ] Mobile responsive
- [ ] Image fallback
- [ ] Input label
- [ ] Button text jelas
- [ ] Loading skeleton
- [ ] Empty result
- [ ] Error feedback

### Code Quality

- [ ] TypeScript type jelas
- [ ] Tidak memakai `any` sembarangan
- [ ] Request API tidak tersebar
- [ ] Zustand menjadi state utama
- [ ] Component tidak terlalu besar
- [ ] localStorage logic tidak tersebar
- [ ] Struktur folder jelas
- [ ] README lengkap

## Nilai Plus yang Layak Diprioritaskan

Setelah fitur wajib selesai:

1. Debounced search
2. URL query params
3. Zustand persist middleware
4. Skeleton loading
5. Unit/component test sederhana
6. Accessibility improvement
7. Consistent spacing dan form feedback

## Out of Scope

Tidak perlu membuat:

- backend custom
- database custom
- authentication
- role / permission management
- Swagger
- JWT
- server CRUD sendiri
- dark mode
- dashboard chart kompleks
- multi-language
- micro frontend

Arsitektur utama:

```txt
DummyJSON API
+
React
+
TypeScript
+
Zustand
+
localStorage
```

## Kesimpulan

Fokus technical test:

```txt
Data Fetching
+
State Management
+
Search
+
Filter
+
Sort
+
Pagination
+
Detail
+
Client CRUD
+
Persistence
+
Responsive UI
+
Loading / Error / Empty
```

Target akhirnya adalah membuat **Product Catalog Admin yang sederhana, rapi, responsive, state-nya konsisten, dan mudah dipahami reviewer**.
