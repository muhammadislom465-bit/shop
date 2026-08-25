import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.db.session import engine, Base, SessionLocal
from app.models.models import User, Category, Product, News, ActionTemplate
from app.core.security import get_password_hash
from app.core.config import settings

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin User
        admin_user = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
        if not admin_user:
            admin_user = User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            print(f"Created default admin user: {settings.ADMIN_USERNAME}")
        else:
            admin_user.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
            admin_user.is_admin = True
            db.add(admin_user)

        # 2. Categories
        categories_data = [
            {"name": "Elektronika va Gadjetlar", "slug": "elektronika", "icon": "Smartphone", "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"},
            {"name": "Maishiy texnika", "slug": "maishiy-texnika", "icon": "Tv", "image_url": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80"},
            {"name": "Kiyim va Poyabzallar", "slug": "kiyimlar", "icon": "Shirt", "image_url": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"},
            {"name": "Go'zallik va Parvarish", "slug": "gozallik", "icon": "Sparkles", "image_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
            {"name": "Uy-ro'zg'or buyumlari", "slug": "uy-rozgor", "icon": "Home", "image_url": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80"},
            {"name": "Avtotovarlar", "slug": "avtotovarlar", "icon": "Car", "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80"},
            {"name": "Sport va Dam olish", "slug": "sport", "icon": "Dumbbell", "image_url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80"}
        ]

        cat_map = {}
        for cat in categories_data:
            existing = db.query(Category).filter(Category.slug == cat["slug"]).first()
            if not existing:
                category_obj = Category(**cat)
                db.add(category_obj)
                db.flush()
                cat_map[cat["slug"]] = category_obj.id
            else:
                cat_map[cat["slug"]] = existing.id

        # 3. Products
        if db.query(Product).count() == 0:
            products_data = [
                {
                    "title": "Smartfon Apple iPhone 15 Pro Max 256GB Natural Titanium",
                    "description": "Eng so'nggi flagman smartfon. A17 Pro protsessori, 48MP kamera, titanium korpus va Type-C ulanishi. 1 yil rasmiy kafolat.",
                    "category_id": cat_map.get("elektronika", 1),
                    "price": 16500000.0,
                    "discount_price": 14999000.0,
                    "installment_price": 1390000.0,
                    "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 348,
                    "stock": 35,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Noutbuk Apple MacBook Air 13 M2 8/256GB Space Gray",
                    "description": "Yupqa va kuchli noutbuk. M2 chipi 18 soatgacha batareya quvvati, Retina displey va jim ishlaydigan sovutish tizimi.",
                    "category_id": cat_map.get("elektronika", 1),
                    "price": 13200000.0,
                    "discount_price": 11890000.0,
                    "installment_price": 1120000.0,
                    "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 182,
                    "stock": 20,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Simsiz quloqchinlar Apple AirPods Pro 2 (USB-C)",
                    "description": "Faol shovqinni bekor qilish (ANC), shaffoflik rejimi, Spatial Audio va qulay quloq yostiqchalari.",
                    "category_id": cat_map.get("elektronika", 1),
                    "price": 3100000.0,
                    "discount_price": 2750000.0,
                    "installment_price": 260000.0,
                    "image_url": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 520,
                    "stock": 75,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Aqlli soat Smart Watch Series 9 45mm Midnight",
                    "description": "Yurak urishi datchigi, qon kislorodini o'lchash, EKG, fitness treker va Always-on Retina ekran.",
                    "category_id": cat_map.get("elektronika", 1),
                    "price": 5400000.0,
                    "discount_price": 4690000.0,
                    "installment_price": 440000.0,
                    "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700&q=80",
                    "rating": 4.7,
                    "reviews_count": 94,
                    "stock": 40,
                    "is_popular": False,
                    "is_featured": True
                },
                {
                    "title": "Televizor Samsung 55 Crystal UHD 4K Smart TV",
                    "description": "55 dyuymli 4K UHD ekran, HDR10+, Tizen OS, YouTube, Netflix va barcha ilovalar qo'llab-quvvatlanadi.",
                    "category_id": cat_map.get("maishiy-texnika", 2),
                    "price": 6800000.0,
                    "discount_price": 5990000.0,
                    "installment_price": 560000.0,
                    "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 215,
                    "stock": 18,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Robot-changyutgich Xiaomi Robot Vacuum S10 Plus",
                    "description": "Lazer navigatsiya (LDS), 4000Pa kuchli tortish kuchi, namlab tozalash (mop) funksiyasi va smartfon orqali boshqaruv.",
                    "category_id": cat_map.get("maishiy-texnika", 2),
                    "price": 3800000.0,
                    "discount_price": 3190000.0,
                    "installment_price": 298000.0,
                    "image_url": "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 140,
                    "stock": 30,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Erkaklar uchun klassik krossovka Nike Air Force 1 '07",
                    "description": "Asl charm material, qulay taglik va yillar davomida mashhur bo'lgan afsonaviy oq dizayn.",
                    "category_id": cat_map.get("kiyimlar", 3),
                    "price": 1450000.0,
                    "discount_price": 1150000.0,
                    "installment_price": 110000.0,
                    "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 420,
                    "stock": 60,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Uniseks Hoodie Oversize paxta qora rang",
                    "description": "100% tabiiy paxta, issiq va qulay, zamonaviy erkin bichim. Barcha fasllar uchun mos.",
                    "category_id": cat_map.get("kiyimlar", 3),
                    "price": 350000.0,
                    "discount_price": 229000.0,
                    "installment_price": 25000.0,
                    "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&q=80",
                    "rating": 4.6,
                    "reviews_count": 89,
                    "stock": 100,
                    "is_popular": False,
                    "is_featured": False
                },
                {
                    "title": "Dyson Airwrap Multi-styler soch turmaklash to'plami",
                    "description": "Coanda effekti orqali ortiqcha issiqliksiz mukammal soch jingalaklash va quritish.",
                    "category_id": cat_map.get("gozallik", 4),
                    "price": 6900000.0,
                    "discount_price": 6199000.0,
                    "installment_price": 580000.0,
                    "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80",
                    "rating": 5.0,
                    "reviews_count": 160,
                    "stock": 15,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Kofe mashinasi DeLonghi Magnifica S Avtomat",
                    "description": "Yangi qovurilgan donalardan espresso va kapuchino tayyorlash, 15 bar bosim va oson yuviladigan blok.",
                    "category_id": cat_map.get("uy-rozgor", 5),
                    "price": 5200000.0,
                    "discount_price": 4500000.0,
                    "installment_price": 420000.0,
                    "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 78,
                    "stock": 22,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Videoregistrator 70mai Dash Cam Omni 360",
                    "description": "360 daraja aylanuvchi kamera, sun'iy intellekt harakat datchigi, tungi sifatli tasvir va ovozli boshqaruv.",
                    "category_id": cat_map.get("avtotovarlar", 6),
                    "price": 1850000.0,
                    "discount_price": 1490000.0,
                    "installment_price": 140000.0,
                    "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700&q=80",
                    "rating": 4.7,
                    "reviews_count": 55,
                    "stock": 45,
                    "is_popular": False,
                    "is_featured": False
                }
            ]

            for p in products_data:
                prod = Product(**p)
                db.add(prod)
            print("Seeded sample products successfully.")

        # 4. Action Templates (Tayyor shablonlar)
        if db.query(ActionTemplate).count() == 0:
            templates_data = [
                {
                    "title": "Katta Hafta Chegirmalari - 50% gacha!",
                    "category_type": "haftalik",
                    "default_tag": "Aksiya",
                    "badge_color": "purple",
                    "description": "Barcha toifadagi tovarlar uchun haftalik super chegirma aksiyasi e'lon qilish.",
                    "default_content": "Ushbu haftada Uzum Marketda 50% gacha bo'lgan misli ko'rilmagan chegirmalar boshlandi! Smartfonlar, maishiy texnika va kiyim-kechaklarni eng qulay narxlarda xarid qiling. Aksiya faqat 7 kun davom etadi. Shoshiling, mahsulotlar soni cheklangan!",
                    "image_url": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
                },
                {
                    "title": "Elektronika Festivali: Nasiya 0-0-12",
                    "category_type": "elektronika",
                    "default_tag": "Nasiya 0%",
                    "badge_color": "blue",
                    "description": "Gadjetlar va smartfonlarni boshlang'ich to'lovsiz va 0% ustamasiz 12 oyga bo'lib to'lash shabloni.",
                    "default_content": "Orzungizdagi texnikani bugun oling, to'lovini 12 oy davomida teng qismlarda ustamasiz amalga oshiring! Apple, Samsung, Xiaomi flagmanlari kutmoqda.",
                    "image_url": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
                },
                {
                    "title": "Yangi To'plam: Bahor-Yoz 2026",
                    "category_type": "mavsumiy",
                    "default_tag": "Yangi",
                    "badge_color": "green",
                    "description": "Mavsumiy kiyim va oyoq kiyimlar to'plami taqdimoti uchun tayyor shablon.",
                    "default_content": "Yangi mavsum - yangi uslub! Eng so'nggi trenddagi brend kiyimlari, poyabzallar va aksessuarlar endi do'konimizda. Yangi kolleksiya bilan tanishing.",
                    "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                },
                {
                    "title": "1 Kunda Bepul Yetkazib Berish E'loni",
                    "category_type": "muhim",
                    "default_tag": "Muhim",
                    "badge_color": "amber",
                    "description": "Yetkazib berish xizmati va yangi tarqatish punktlari haqida e'lon.",
                    "default_content": "Endi barcha buyurtmalar butun mamlakat bo'ylab 24 soat ichida tarqatish punktlariga yoki to'g'ridan-to'g'ri eshikkacha bepul yetkazib beriladi! Qulay xarid zavqini tuying.",
                    "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                }
            ]

            for tmpl in templates_data:
                obj = ActionTemplate(**tmpl)
                db.add(obj)
            print("Seeded Action Templates successfully.")

        # 5. Initial News
        if db.query(News).count() == 0:
            initial_news = [
                {
                    "title": "Uzum Marketda Katta Mavsumiy Chegirmalar Boshlandi!",
                    "summary": "Barcha mashhur tovarlarga 60% gacha chegirma va 1 kunda bepul yetkazib berish.",
                    "content": "Hurmatli xaridorlar! Bizning onlayn savdo maydonchamizda katta bahorgi chegirmalar haftaligi boshlandi. Barcha smartfonlar, maishiy buyumlar va kiyimlar eng yaxshi narxlarda taklif etilmoqda. Buyurtmangizni ertagayoq qabul qilib oling!",
                    "image_url": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
                    "tag": "Aksiya",
                    "badge_color": "purple",
                    "is_published": True,
                    "views_count": 1250
                },
                {
                    "title": "Smartfonlar uchun 0-0-12 Muddatli To'lov Aksiya Amali",
                    "summary": "Boshlang'ich to'lovsiz, ortiqcha foizlarsiz 12 oylik muddatli to'lov.",
                    "content": "Endi barcha Apple va Samsung smartfonlarini hech qanday ortiqcha to'lovsiz, rasmiy 12 oylik to'lov rejasi bilan xarid qilishingiz mumkin. Karta orqali 2 daqiqada rasmiylashtiring.",
                    "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
                    "tag": "Nasiya 0%",
                    "badge_color": "blue",
                    "is_published": True,
                    "views_count": 870
                }
            ]
            for n in initial_news:
                news_obj = News(**n)
                db.add(news_obj)
            print("Seeded initial news successfully.")

        # 6. Additional Products
        if db.query(Product).count() <= 11:
            additional_products = [
                {
                    "title": "Yoga mat Professional 183x61cm NBR 10mm qalinlikda",
                    "description": "Yuqori sifatli NBR materialdan tayyorlangan, sirpanishga qarshi sirti bor. Yoga, pilates va umumiy mashqlar uchun ideal. Sumka bilan birga.",
                    "category_id": cat_map.get("sport", 7),
                    "price": 289000.0,
                    "discount_price": 199000.0,
                    "installment_price": 20000.0,
                    "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=700&q=80",
                    "rating": 4.7,
                    "reviews_count": 234,
                    "stock": 80,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Gantel to'plami 2x10kg professional vinildan qoplangan",
                    "description": "Uy mashqlari uchun mukammal gantel juftligi. Vinil qoplamasi qo'ldan sirpanishni oldini oladi. Sifatli po'latdan yasalgan.",
                    "category_id": cat_map.get("sport", 7),
                    "price": 580000.0,
                    "discount_price": 449000.0,
                    "installment_price": 42000.0,
                    "image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 156,
                    "stock": 45,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Futbol to'pi Adidas Al Rihla FIFA Quality Pro 5-razmer",
                    "description": "FIFA Quality Pro sertifikatiga ega professional futbol to'pi. Yuqori sifatli PU charm, mukammal vazn balansiga ega.",
                    "category_id": cat_map.get("sport", 7),
                    "price": 450000.0,
                    "discount_price": 379000.0,
                    "installment_price": 36000.0,
                    "image_url": "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 312,
                    "stock": 55,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Avtomobil uchun universal o'rindiq qoplami to'plami (4 dona)",
                    "description": "Premium sifatli sun'iy charm, barcha avtomobillarga mos universal o'lcham, oson o'rnatiladi. 4 ta oldingi va orqa o'rindiq qoplami.",
                    "category_id": cat_map.get("avtotovarlar", 6),
                    "price": 890000.0,
                    "discount_price": 690000.0,
                    "installment_price": 65000.0,
                    "image_url": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=700&q=80",
                    "rating": 4.6,
                    "reviews_count": 89,
                    "stock": 30,
                    "is_popular": False,
                    "is_featured": True
                },
                {
                    "title": "Portativ avtomobil kompressori 12V 150PSI raqamli displey",
                    "description": "Raqamli manometrli avtomatik kompressor. G'ildirak bosimini tezda to'ldiradi. LED chiroqli, powerbank funksiyali.",
                    "category_id": cat_map.get("avtotovarlar", 6),
                    "price": 420000.0,
                    "discount_price": 339000.0,
                    "installment_price": 32000.0,
                    "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=700&q=80",
                    "rating": 4.5,
                    "reviews_count": 67,
                    "stock": 40,
                    "is_popular": False,
                    "is_featured": False
                },
                {
                    "title": "Oshxona kombayn Bosch MultiTalent 8 MC812M865 1250W",
                    "description": "50 dan ortiq funksiya: maydalash, aralashtirish, qirqish, xamir qorish. 3.9L idish, 1250W quvvat, tezkor va sershovqin emas.",
                    "category_id": cat_map.get("uy-rozgor", 5),
                    "price": 3200000.0,
                    "discount_price": 2690000.0,
                    "installment_price": 252000.0,
                    "image_url": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 143,
                    "stock": 25,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Robot-tozalagich iRobot Roomba j7+ avtomat tozalash stansiyasi bilan",
                    "description": "AI to'siqlarni aniqlash, avtomat axlat bo'shatish stansiyasi, 120 daqiqalik batareya, smart xarita tuzish.",
                    "category_id": cat_map.get("uy-rozgor", 5),
                    "price": 7500000.0,
                    "discount_price": 6490000.0,
                    "installment_price": 607000.0,
                    "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 98,
                    "stock": 12,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Parfyum to'plami erkaklar uchun (Dior Sauvage + Bleu de Chanel)",
                    "description": "Ikki dona mashhur erkaklar parfyumi sovg'a to'plami. Dior Sauvage EDT 100ml + Bleu de Chanel EDP 100ml. Original.",
                    "category_id": cat_map.get("gozallik", 4),
                    "price": 4200000.0,
                    "discount_price": 3590000.0,
                    "installment_price": 336000.0,
                    "image_url": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=700&q=80",
                    "rating": 5.0,
                    "reviews_count": 276,
                    "stock": 18,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Terini parvarish qilish to'plami (Korean 10-Step Skincare)",
                    "description": "10 bosqichli koreyscha terini parvarish tizimi: tozalash, toner, serum, krem, niqob va boshqalar. Barcha teri turlari uchun.",
                    "category_id": cat_map.get("gozallik", 4),
                    "price": 1200000.0,
                    "discount_price": 890000.0,
                    "installment_price": 84000.0,
                    "image_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 189,
                    "stock": 50,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Smartfon Samsung Galaxy S24 Ultra 12/256GB Titanium Gray",
                    "description": "Snapdragon 8 Gen 3 protsessori, 200MP kamera, Galaxy AI sun'iy intellekti, S Pen qalam, titanium korpus. 1 yil kafolat.",
                    "category_id": cat_map.get("elektronika", 1),
                    "price": 15800000.0,
                    "discount_price": 13990000.0,
                    "installment_price": 1308000.0,
                    "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 425,
                    "stock": 28,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Planshet Apple iPad Air M2 11 128GB Wi-Fi Space Gray",
                    "description": "M2 chip, Liquid Retina displey, Touch ID, USB-C, 10 soatlik batareya. O'qish, chizish va ishlab chiqish uchun ideal.",
                    "category_id": cat_map.get("elektronika", 1),
                    "price": 8900000.0,
                    "discount_price": 7990000.0,
                    "installment_price": 748000.0,
                    "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 167,
                    "stock": 22,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Krossovka New Balance 574 Classic erkaklar uchun",
                    "description": "Klassik dizayn, ENCAP taglik texnologiyasi, tabiiy zamsh va mesh materiallar. Kundalik hayot uchun mukammal.",
                    "category_id": cat_map.get("kiyimlar", 3),
                    "price": 1250000.0,
                    "discount_price": 990000.0,
                    "installment_price": 93000.0,
                    "image_url": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&q=80",
                    "rating": 4.7,
                    "reviews_count": 198,
                    "stock": 65,
                    "is_popular": True,
                    "is_featured": False
                },
                {
                    "title": "Qishki kurtka erkaklar uchun The North Face Nuptse 700 Down",
                    "description": "700 fill power g'oz patli premium kurtka. -25°C gacha isitadi. Suv o'tkazmaydigan tashqi qatlam. Engil va ixcham.",
                    "category_id": cat_map.get("kiyimlar", 3),
                    "price": 3900000.0,
                    "discount_price": 3290000.0,
                    "installment_price": 308000.0,
                    "image_url": "https://images.unsplash.com/photo-1544923246-77307dd270b5?w=700&q=80",
                    "rating": 4.9,
                    "reviews_count": 134,
                    "stock": 15,
                    "is_popular": False,
                    "is_featured": True
                },
                {
                    "title": "Konditsioner Midea 12000 BTU Inverter Wi-Fi boshqaruvli",
                    "description": "Inverter texnologiyasi 60% energiya tejaydi. Wi-Fi orqali smartfondan masofadan boshqarish. R32 ekologik freon.",
                    "category_id": cat_map.get("maishiy-texnika", 2),
                    "price": 5400000.0,
                    "discount_price": 4590000.0,
                    "installment_price": 430000.0,
                    "image_url": "https://images.unsplash.com/photo-1631567091085-1a450ca0a923?w=700&q=80",
                    "rating": 4.6,
                    "reviews_count": 203,
                    "stock": 14,
                    "is_popular": True,
                    "is_featured": True
                },
                {
                    "title": "Kir yuvish mashinasi LG F4V5RYP2T 10.5kg AI DD Inverter",
                    "description": "AI DD texnologiyasi matoni aniqlaydi. 10.5 kg yuk sig'imi, Steam funksiyasi, 14 dastur, A+++ energiya sinfi.",
                    "category_id": cat_map.get("maishiy-texnika", 2),
                    "price": 7200000.0,
                    "discount_price": 6290000.0,
                    "installment_price": 589000.0,
                    "image_url": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&q=80",
                    "rating": 4.8,
                    "reviews_count": 176,
                    "stock": 10,
                    "is_popular": True,
                    "is_featured": False
                }
            ]
            for p in additional_products:
                prod = Product(**p)
                db.add(prod)
            print("Seeded additional products successfully.")

        # 7. FAQ Items
        from app.models.models import FAQ, Banner, Coupon
        if db.query(FAQ).count() == 0:
            faq_data = [
                {"question": "Uzum Marketdan qanday buyurtma beraman?", "answer": "Saytda mahsulotni tanlab, savatga qo'shing. Keyin savatga o'ting, yetkazib berish manzilini va to'lov usulini tanlang. Buyurtmani tasdiqlang — hammasi shu!", "category": "Umumiy", "sort_order": 1},
                {"question": "Ro'yxatdan o'tish shart bormi?", "answer": "Buyurtma berish uchun ro'yxatdan o'tish tavsiya etiladi. Shunda buyurtmalaringizni kuzatish, sevimlilar ro'yxatini saqlash va promo kodlardan foydalanish imkoniyati bo'ladi.", "category": "Umumiy", "sort_order": 2},
                {"question": "Mahsulot narxlariga QQS (soliq) kiritilganmi?", "answer": "Ha, saytda ko'rsatilgan barcha narxlar QQSni o'z ichiga olgan yakuniy narxlardir.", "category": "Umumiy", "sort_order": 3},
                {"question": "Yetkazib berish qancha vaqt oladi?", "answer": "Toshkent shahri bo'ylab 1-2 ish kuni ichida yetkazamiz. Viloyatlarga 2-5 ish kuni ichida pochta orqali jo'natamiz.", "category": "Yetkazib berish", "sort_order": 1},
                {"question": "Yetkazib berish bepulmi?", "answer": "100,000 so'mdan yuqori buyurtmalar uchun Toshkent bo'ylab yetkazib berish bepul. Viloyatlarga yetkazish narxi manzilga qarab 15,000-35,000 so'm.", "category": "Yetkazib berish", "sort_order": 2},
                {"question": "Buyurtmani kuzatish mumkinmi?", "answer": "Ha! Buyurtmangiz holati shaxsiy kabinetingizda real vaqtda yangilanib turadi. Holat o'zgarganda SMS xabar ham yuboriladi.", "category": "Yetkazib berish", "sort_order": 3},
                {"question": "Qanday to'lov usullari mavjud?", "answer": "Naqd pul (yetkazib berishda), plastik karta (Humo, UzCard, Visa, MasterCard), va muddatli to'lov (nasiya) usullari mavjud.", "category": "To'lov", "sort_order": 1},
                {"question": "Nasiya (muddatli to'lov) qanday ishlaydi?", "answer": "Tanlangan mahsulotlar uchun 3, 6 yoki 12 oylik muddatli to'lov mavjud. Boshlang'ich to'lov 0%, ustama foiz 0%. Plastik karta orqali rasmiylashtiriladi.", "category": "To'lov", "sort_order": 2},
                {"question": "Promo kod qanday ishlatiladi?", "answer": "Xarid qilish jarayonida savatda 'Promo kod' maydoniga kodni kiriting va 'Qo'llash' tugmasini bosing. Chegirma avtomatik hisoblanadi.", "category": "To'lov", "sort_order": 3},
                {"question": "Mahsulotni qaytarish mumkinmi?", "answer": "Ha! Mahsulotni qabul qilganingizdan keyin 14 kun ichida sababini ko'rsatmasdan qaytarishingiz mumkin. Mahsulot ishlatilmagan va original qadoqda bo'lishi kerak.", "category": "Qaytarish", "sort_order": 1},
                {"question": "Qaytarish uchun pul qachon qaytariladi?", "answer": "Mahsulot qaytarilgandan so'ng 3-5 ish kuni ichida to'lov kartangizga yoki naqd pul shaklida qaytariladi.", "category": "Qaytarish", "sort_order": 2},
                {"question": "Nuqsonli mahsulot olsam nima qilaman?", "answer": "Nuqsonli mahsulot olingan taqdirda darhol qo'llab-quvvatlash xizmatiga murojaat qiling. Biz mahsulotni bepul almashtiramiz yoki pulni to'liq qaytaramiz.", "category": "Qaytarish", "sort_order": 3}
            ]
            for f in faq_data:
                db.add(FAQ(**f))
            print("Seeded FAQ items successfully.")

        # 8. Banners
        if db.query(Banner).count() == 0:
            banners_data = [
                {"title": "Katta Chegirmalar Haftaligi", "subtitle": "Barcha toifada 70% gacha chegirma. Faqat shu hafta!", "image_url": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80", "badge_text": "-70%", "bg_color": "#7000ff", "sort_order": 1},
                {"title": "Yangi iPhone 15 Pro Max", "subtitle": "Nasiya 0-0-12 rejasi bilan hoziroq xarid qiling", "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=80", "badge_text": "Yangi", "bg_color": "#1a1a2e", "sort_order": 2},
                {"title": "Sport Mollari Festivali", "subtitle": "Sog'lom turmush tarzi uchun barcha kerakli jihozlar", "image_url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80", "badge_text": "Sport", "bg_color": "#16a34a", "sort_order": 3},
                {"title": "Bepul Yetkazib Berish", "subtitle": "100,000 so'mdan yuqori buyurtmalarga bepul yetkazish", "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80", "badge_text": "Bepul", "bg_color": "#ea580c", "sort_order": 4}
            ]
            for b in banners_data:
                db.add(Banner(**b))
            print("Seeded banners successfully.")

        # 9. Coupons
        if db.query(Coupon).count() == 0:
            import datetime as dt
            coupons_data = [
                {"code": "UZUM10", "description": "10% chegirma barcha buyurtmalarga", "discount_type": "percentage", "discount_value": 10.0, "min_order_amount": 200000, "max_discount_amount": 500000, "usage_limit": 1000, "is_active": True, "expires_at": dt.datetime(2027, 12, 31)},
                {"code": "YANGI2026", "description": "Yangi foydalanuvchilar uchun 50,000 so'm chegirma", "discount_type": "fixed", "discount_value": 50000.0, "min_order_amount": 300000, "usage_limit": 500, "is_active": True, "expires_at": dt.datetime(2027, 6, 30)},
                {"code": "MEGA50", "description": "Mega chegirma 50% (max 1,000,000 so'm)", "discount_type": "percentage", "discount_value": 50.0, "min_order_amount": 1000000, "max_discount_amount": 1000000, "usage_limit": 100, "is_active": True, "expires_at": dt.datetime(2026, 12, 31)}
            ]
            for c in coupons_data:
                db.add(Coupon(**c))
            print("Seeded coupons successfully.")

        from app.models.models import PickupPoint, Brand, FlashSale
        import datetime as dt

        # 10. PVZs
        if db.query(PickupPoint).count() == 0:
            pvz_data = [
                {"city": "Tashkent", "district": "Chilonzor", "name": "Chilonzor-9", "address": "Chilonzor 9-daha, 12-uy", "landmark": "Rayhon milliy taomlari yonida", "working_hours": "09:00 - 20:00", "lat": 41.2825, "lng": 69.2133},
                {"city": "Tashkent", "district": "Yunusobod", "name": "Yunusobod-19", "address": "Yunusobod 19-daha, 44-uy", "landmark": "Universam bozori ro'parasida", "working_hours": "09:00 - 20:00", "lat": 41.3644, "lng": 69.2886},
                {"city": "Tashkent", "district": "Mirzo Ulugbek", "name": "Buyuk Ipak Yo'li", "address": "Mirzo Ulugbek shoh ko'chasi, 55-uy", "landmark": "Makro supermarketi ichida", "working_hours": "09:00 - 20:00", "lat": 41.3265, "lng": 69.3323},
                {"city": "Samarkand", "district": "Samarkand", "name": "Gagarin", "address": "Gagarin ko'chasi, 72-uy", "landmark": "Family Park savdo markazi", "working_hours": "09:00 - 19:00", "lat": 39.6644, "lng": 66.9388},
                {"city": "Samarkand", "district": "Samarkand", "name": "Buyuk Ipak Yuli", "address": "Buyuk Ipak Yuli ko'chasi, 15-uy", "landmark": "Siyob bozori orqa tomoni", "working_hours": "09:00 - 19:00", "lat": 39.6582, "lng": 66.9682},
                {"city": "Bukhara", "district": "Bukhara", "name": "Buxoro Markaz", "address": "I.Karimov ko'chasi, 10-uy", "landmark": "Buxoro univermagi yoni", "working_hours": "09:00 - 19:00", "lat": 39.7747, "lng": 64.4286},
                {"city": "Fergana", "district": "Fergana", "name": "Farg'ona Markaz", "address": "Al-Farg'oniy ko'chasi, 25-uy", "landmark": "Markaziy bog' ro'parasida", "working_hours": "09:00 - 19:00", "lat": 40.3833, "lng": 71.7833},
                {"city": "Fergana", "district": "Margilan", "name": "Marg'ilon", "address": "B.Marg'iloniy ko'chasi, 110-uy", "landmark": "Ipak bozori", "working_hours": "09:00 - 18:00", "lat": 40.4770, "lng": 71.7147},
                {"city": "Andijan", "district": "Andijan", "name": "Andijon Markaz", "address": "Navoiy shoh ko'chasi, 45-uy", "landmark": "O'zbegim savdo markazi", "working_hours": "09:00 - 19:00", "lat": 40.7821, "lng": 72.3442},
                {"city": "Namangan", "district": "Namangan", "name": "Namangan Markaz", "address": "Navoiy ko'chasi, 60-uy", "landmark": "Chorsu bozori yonida", "working_hours": "09:00 - 19:00", "lat": 41.0000, "lng": 71.6667}
            ]
            for p in pvz_data:
                db.add(PickupPoint(**p))
            print("Seeded PVZs successfully.")

        # 11. Brands
        if db.query(Brand).count() == 0:
            brands_data = [
                {"name": "Apple", "slug": "apple", "is_official": True},
                {"name": "Samsung", "slug": "samsung", "is_official": True},
                {"name": "Xiaomi", "slug": "xiaomi", "is_official": True},
                {"name": "Artel", "slug": "artel", "is_official": True},
                {"name": "Nike", "slug": "nike", "is_official": False},
                {"name": "Adidas", "slug": "adidas", "is_official": False},
                {"name": "Dyson", "slug": "dyson", "is_official": True},
                {"name": "DeLonghi", "slug": "delonghi", "is_official": True}
            ]
            for b in brands_data:
                db.add(Brand(**b))
            print("Seeded Brands successfully.")

        # 12. Flash Sales
        if db.query(FlashSale).count() == 0:
            now = dt.datetime.utcnow()
            flash_sales_data = [
                {"product_id": 1, "discount_percentage": 15, "end_time": now + dt.timedelta(days=1), "total_quantity": 20, "sold_quantity": 5},
                {"product_id": 2, "discount_percentage": 20, "end_time": now + dt.timedelta(hours=12), "total_quantity": 10, "sold_quantity": 8},
                {"product_id": 3, "discount_percentage": 30, "end_time": now + dt.timedelta(days=2), "total_quantity": 50, "sold_quantity": 20},
                {"product_id": 4, "discount_percentage": 25, "end_time": now + dt.timedelta(hours=5), "total_quantity": 15, "sold_quantity": 14}
            ]
            for fs in flash_sales_data:
                db.add(FlashSale(**fs))
            print("Seeded Flash Sales successfully.")

        db.commit()
        print("Database seed completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
