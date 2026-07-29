# Product Catalog Admin

Frontend technical test untuk mengelola katalog produk dengan **Vite + React + TypeScript + Zustand**. Data awal diambil dari **DummyJSON Products API**, lalu aksi create, edit, dan delete disimulasikan di sisi client dan dipersist ke `localStorage`.

## Pilihan Assessment

Project ini memilih opsi:

```txt
Product Catalog Admin
```

Alasan pemilihan:

- scope CRUD frontend lebih jelas untuk technical test
- cocok untuk menunjukkan state management dengan Zustand
- cocok untuk menunjukkan search, filter, sort, pagination, dan persistence local
- lebih relevan untuk UI admin sederhana dibanding recipe browsing biasa

## Tech Stack

- Vite
- React
- TypeScript
- Zustand
- Tailwind CSS v4
- React Hook Form
- Zod
- React Icons
- DummyJSON Products API

## Install Dependency

Project ini menggunakan `npm` dan sudah menyediakan `package-lock.json`.

```bash
npm install
```

## Menjalankan Project

Mode development:

```bash
npm run dev
```

Quality check yang tersedia:

```bash
npm run lint
npm run build
```

## Fitur yang Sudah Dibuat

- fetch product list dari DummyJSON
- fetch categories dari DummyJSON
- responsive product list
- `ProductTable` untuk desktop dan tablet
- `ProductCardList` untuk mobile
- debounced search tanpa tombol Enter
- category filter
- sorting
- pagination berbasis `limit + skip`
- product detail modal
- create product di sisi client
- edit product di sisi client
- delete product dengan confirmation dialog
- local persistence untuk create, update, dan delete lewat Zustand `persist`
- validasi form dengan `react-hook-form` + `zod`
- image fallback melalui `ProductImage`
- feedback action success dan error melalui `Alert`
- disabled/loading state untuk submit form dan delete action

## Struktur Folder Singkat

```txt
src/
├── app/                       # Entry App dan router placeholder
├── components/
│   ├── layout/                # Layout global seperti Topbar
│   └── ui/                    # Primitive UI reusable
├── features/
│   └── products/              # Domain utama aplikasi
│       ├── components/        # UI khusus feature products
│       ├── pages/             # ProductsPage
│       ├── schemas/           # Schema validasi form
│       ├── services/          # Request ke DummyJSON
│       ├── store/             # Zustand store
│       ├── types/             # Type product dan query
│       └── utils/             # Merge API + local changes
├── hooks/                     # Hook seperti useDebounce
├── lib/                       # Tempat abstraction utilitas umum
├── styles/                    # Global styles dan theme tokens
└── utils/                     # Helper global seperti format angka
```

Ringkasnya:

- `components/ui` menyimpan primitive reusable
- `features/products` menjadi pusat logic domain
- `services` menangani API
- `store` menangani state utama aplikasi
- `utils` menyimpan helper murni agar logic tidak tersebar ke component

## Pendekatan Zustand Store

Pendekatan state management yang dipakai:

- `useProductStore` menjadi source of truth utama untuk state product
- store menyimpan query state: `page`, `limit`, `search`, `category`, `sortBy`, dan `sortOrder`
- store juga menyimpan state runtime seperti `products`, `categories`, `selectedProduct`, `isLoading`, dan `error`
- store menyediakan action seperti `fetchProducts`, `fetchCategories`, `createProduct`, `updateProduct`, dan `deleteProduct`
- persistence memakai `zustand/middleware/persist`
- yang dipersist hanya:

```txt
createdProducts
updatedProducts
deletedProductIds
```

- daftar product yang tampil adalah hasil merge antara data API dan local changes
- logic merge dipisahkan ke `src/features/products/utils/product-state.ts`
- component page dan component feature tidak memanggil `fetch()` secara langsung

Dengan pendekatan ini:

- API tetap menjadi baseline data
- perubahan local tetap bertahan setelah refresh
- business logic tidak tersebar ke banyak component

## Asumsi dan Tradeoff Teknis

- Project memilih **Product** dan bukan **Recipe** karena lebih cocok untuk menunjukkan flow admin CRUD.
- CRUD tidak dikirim ke backend sungguhan. Create, edit, dan delete hanya berlaku di client melalui Zustand + `localStorage`, sesuai requirement technical test.
- Search dan category tidak digabung dalam satu request aktif. Saat search dipakai, category di-reset ke `all` karena endpoint DummyJSON untuk search dan category tidak dirancang sebagai kombinasi query yang sama.
- Routing sengaja dibuat minimal. `src/app/router.tsx` masih disiapkan sebagai placeholder, tetapi flow aktif saat ini cukup memakai satu halaman utama.
- Persistence dipusatkan langsung di Zustand `persist`. `src/lib/storage.ts` dibiarkan sebagai opsi abstraction manual bila nanti diperlukan, tetapi tidak dipakai agar solusi tetap sederhana.
- Tidak semua primitive yang sudah dibuat langsung dipakai di flow aktif. Misalnya `Topbar`, `IconButton`, dan `Badge` sudah tersedia, tetapi penggunaan aktif diprioritaskan ke kebutuhan inti technical test terlebih dahulu.
- Fokus utama project adalah correctness, keterbacaan code, dan konsistensi state, bukan menambah fitur di luar scope seperti auth, backend custom, dark mode, atau dashboard kompleks.
