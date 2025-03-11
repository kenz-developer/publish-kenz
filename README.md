# 🚀 Github Tools

![Preview](https://pomf2.lain.la/f/ayaazhh8.jpg)
![Preview](https://raw.githubusercontent.com/yoshxyz/cdni/main/images/1741679343071-photo_6231095079834076127_w.jpg)

Yo, bro! Ini dia **Github Tools Yosh**, project kece buat nge-upload sesuatu ke GitHub pake **JS**. Dibikin pake **React + Vite**, terus ada **TailwindCSS** biar tampilannya makin cakep. 🔥

---

## 🛠️ Setup Gampil

1. **Clone repo dulu, coy!**
   ```sh
   git clone https://github.com/YoshCasaster/Github-Tools
   ```

2. **Masuk ke folder project**
   ```sh
   cd Github-uploader-yosh
   ```

3. **Install semua dependency**
   ```sh
   npm install
   ```

4. **Gaskeun jalankan projectnya!**
   ```sh
   npm run dev
   ```

---

## 🔥 Fitur Yang Ada
✅ Upload ke GitHub pake API Octokit  
✅ UI keren pake TailwindCSS  
✅ Fast & Furious berkat Vite  
✅ Dukung TypeScript buat yang mau coding lebih mantap  

---

---

## ⚙️ Konfigurasi

Edit file `GithubPageBuilder.tsx` dan `ImageHosting.tsx`ubah bagian berikut:

```tsx
const octokit = new Octokit({
  auth: 'Ganti Token Github Lu'
});

const USERNAME = 'Username Github Lu';
```
```tsx
const octokit = new Octokit({
  auth: 'Token Github Lu'
});

const OWNER = 'Username Github Lu';
const REPO = 'Nama Repo Lu';
```

Pastikan sudah mengganti dengan **token GitHub** dan **username GitHub** agar aplikasi bisa berjalan dengan baik!

---

## 🚀 Build & Deploy

Kalau mau build buat production:
```sh
npm run build
```
Kalau mau preview hasil build:
```sh
npm run preview
```
Mau deploy? Gampang! Bisa pake **Vercel**, **Netlify**, atau **GitHub Pages**.

---

## 🌐 Test Demo Website
Cek langsung hasilnya di sini: [Test Demo](https://gitpublis.netlify.app/)

---

## 📢 Kontribusi
Mau ikut nambahin fitur? Langsung aja **fork & pull request**, bro!

1. Fork repo ini
2. Bikin branch baru buat perubahan lu
3. Commit perubahan dengan pesan jelas
4. Push ke repo fork lu
5. Buka pull request di repo ini

---

## 🎉 Credits
Dibikin dengan ❤️ sama **YoshCasaster**. Follow GitHub gua buat project kece lainnya! 😉

