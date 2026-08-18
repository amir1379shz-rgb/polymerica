# راهنمای جایگزینی فایل‌ها در ریپو و بیلد با Vite

## چه چیزی تغییر کرد؟
قبلاً `polymarket-2.html` خودش React، ReactDOM، Supabase و Babel را از CDN دانلود می‌کرد و کل کد JSX را **در مرورگر کاربر** ترجمه (transpile) می‌کرد. این کار خصوصاً روی موبایل و اینترنت ضعیف کند بود و گاهی صفحه را کاملاً سفید/خالی نگه می‌داشت.

حالا با Vite، همه‌چیز از قبل (در زمان build، نه در مرورگر) کامپایل و بسته‌بندی (bundle) می‌شود. نتیجه: بارگذاری سریع‌تر، بدون وابستگی به CDNهای React/Babel، و بدون خطر صفحه‌ی سفید روی شبکه‌ی ضعیف.

## ساختار جدید فایل‌ها
```
polymerica/
├── polymarket-2.html      ← نقطه ورود Vite (قبلاً کل اپ React اینجا inline بود)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── src/
│   ├── main.jsx            ← نقطه شروع React (ErrorBoundary + mount)
│   ├── App.jsx              ← کل کامپوننت‌های اپ (از polymarket-2.html قدیمی استخراج شده)
│   └── index.css            ← Tailwind + استایل‌های سفارشی سایت
└── public/                  ← فایل‌های استاتیک که بدون تغییر کپی می‌شوند
    ├── index.html            (صفحه ریدایرکت به polymarket-2.html)
    ├── materials.html
    ├── prices.html
    ├── robots.txt
    ├── sitemap.xml
    └── og-image.png
```

## مراحل جایگزینی در ریپو
1. تمام فایل‌های فعلی ریپو (`index.html`, `materials.html`, `polymarket-2.html`, `prices.html`, `robots.txt`, `sitemap.xml`, `og-image.png`) را پاک کن.
2. تمام فایل‌های این پوشه را کپی کن داخل ریپو (همین ساختار پوشه‌ای `src/` و `public/` را حفظ کن).
3. کامیت و push کن:
   ```
   git add -A
   git commit -m "Convert to Vite build (fix mobile blank-page issue)"
   git push
   ```

## تنظیمات Vercel
Vercel به‌طور خودکار Vite را تشخیص می‌دهد. فقط مطمئن شو تنظیمات پروژه در Vercel این‌طور باشد (Settings → General):
- **Framework Preset:** Vite
- **Build Command:** `vite build` (یا خالی بگذار تا خودش پیش‌فرض بگیرد)
- **Output Directory:** `dist`
- **Install Command:** `npm install`

بعد از push، Vercel خودش دوباره دیپلوی می‌کند. چیزی دستی لازم نیست تغییر کند.

## تست محلی (اختیاری، قبل از push)
اگر روی کامپیوتر خودت Node.js نصب داری:
```
npm install
npm run dev       # پیش‌نمایش محلی
npm run build     # ساخت نسخه‌ی نهایی برای production
npm run preview   # تست نسخه‌ی بیلدشده
```

## نکته‌ی مهم
چون در این محیط (sandbox من) دسترسی به اینترنت غیرفعال است، نتونستم واقعاً `npm install` و `npm run build` را اجرا و تست کنم. کد را با دقت دستی بازبینی کردم (تعادل پرانتزها/آکولادها، importها، export) ولی توصیه می‌کنم بعد از push، لاگ بیلد Vercel رو چک کنی — اگه خطایی بود برام بفرست تا سریع رفعش کنم.
