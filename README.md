# KulkasAI

**KulkasAI** adalah aplikasi web interaktif yang membantu anak kos mengolah bahan makanan sisa di kulkas menjadi hidangan lezat dan praktis. Cukup unggah foto bahan makanan yang kamu punya, dan AI akan menganalisis serta meracik rekomendasi resep secara instan!

---

## Fitur Utama

- **Analisis Foto Bahan Makanan:** Deteksi bahan otomatis menggunakan visi komputer dari Google Gemini AI (`gemini-3.6-flash`).
- **Rekomendasi Resep Spesial Anak Kos:** Resep disesuaikan dengan peralatan masak sederhana (panci, wajan, atau *rice cooker*).
- **Checklist Langkah Memasak:** Fitur interaktif untuk menandai langkah-langkah memasak yang sudah diselesaikan.
- **Manajemen Resep Favorit:** Simpan resep favoritmu langsung di browser (*localStorage*) tanpa perlu repot buat akun.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Model:** [Google Gemini API](https://ai.google.dev/) (`gemini-3.6-flash`)
- **Deployment:** [Vercel](https://vercel.com/)

## Requirements

- Node.js (versi 18 atau lebih baru)
- NPM / Yarn / PNPM
- Google Gemini API Key

## Cara Menjalankan Proyek di Lokal

1. Clone Repo
```bash
git clone [https://github.com/horengoding/KulkasAI.git](https://github.com/horengoding/KulkasAI.git)
```
2. Masuk ke folder project
```bash
cd Kulkas.ai
```
3. Install dependensi
```bash
npm install
```
4. Konfigurasi Environment Variable
```bash
GEMINI_API_KEY=api_key_gemini_kamu
```
5. Jalankan local server
```bash
npm run dev
```

Buka browser dan akses http://localhost:3000.
