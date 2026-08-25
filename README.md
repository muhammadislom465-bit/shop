# Uzum Market — Fullstack E-Commerce Platformasi

Uzum Market uslubidagi zamonaviy, tezkor va to'liq xavfsiz elektron tijorat veb-sayti.

## 🌟 Asosiy Imkoniyatlar

1. **Uzum Market Uslubidagi Dizayn**:
   - Binafsha (`#7000FF`) brend ranglari va zamonaviy UI/UX.
   - Bosh sahifada interaktiv reklama bannerlari karuseli.
   - Kategoriyalar va tezkor qidiruv tizimi.
   - Oylik muddatli to'lov (nasiya `0-0-12`) hisob-kitob ko'rsatkichi (`... so'm/oy`).
   - Chegirmalar, reyting va sharhlar soni.
   - Tezkor savatga qo'shish va sevimlilar (Wishlist) ro'yxatiga saqlash.

2. **Xavfsizlik va Autentifikatsiya**:
   - Backend Python **FastAPI**, **SQLAlchemy (SQLite)** va **Pydantic v2**.
   - Parollarni **Bcrypt** bilan xeshlash.
   - **JWT (JSON Web Token)** orqali xavfsiz sessiya va ro'yxatdan o'tish.
   - `.env` konfiguratsiya fayli.

3. **Super Admin Tizimi va Admin Paneli**:
   - **Login**: `admin123`
   - **Parol**: `admin1234567890`
   - Super admin tizimga kirganida yuqoridagi menyuda **"Admin Paneli"** ochiladi.
   - **Statistika Dashboard**: Jami tushum, buyurtmalar soni, tovarlar va foydalanuvchilar soni.
   - **Mahsulotlarni Boshqarish (CRUD)**: Yangi tovar qo'shish, narx, chegirma, oylik to'lov, rasm va sonini tahrirlash/o'chirish.
   - **Yangiliklar va Amallar Boshqaruvi**: Yangilik qo'shish, tahrirlash, o'chirish.
   - **⚡ Tayyor Shablonlar (Action Templates)**: 1-klikda tayyor shablonlardan foydalanib yangi aksiyalar, chegirmalar va yangiliklarni e'lon qilish imkoniyati.
   - **Buyurtmalar Nazorati**: Tushgan buyurtmalar holatini real vaqtda o'zgartirish (*Kutilmoqda*, *Yetkazilmoqda*, *Yetkazildi*, *Bekor qilindi*).

---

## 🛠 Ishga tushirish bo'yicha ko'rsatma

### 1. Backendni ishga tushirish (FastAPI)
```bash
cd backend
python run.py
```
*API Hujjatlari (Swagger UI)*: `http://127.0.0.1:8000/docs`

### 2. Frontendni ishga tushirish (React Vite)
```bash
cd frontend
npm run dev
```
*Sayt manzili*: `http://localhost:3000` yoki `http://localhost:5173`

---

## 🔑 Standart Kirish Ma'lumotlari

| Rol | Foydalanuvchi nomi (Username) | Parol |
|---|---|---|
| **Super Admin** | `admin123` | `admin1234567890` |
| **Oddiy Foydalanuvchi** | Yangi ro'yxatdan o'tish mumkin | Ixtiyoriy parol (kamida 6 ta belgi) |
