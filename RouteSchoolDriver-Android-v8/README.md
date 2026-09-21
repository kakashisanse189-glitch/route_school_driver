# Route School Driver v8

هذه النسخة تحتوي على:
- PWA داخل `app/src/main/assets/www/`.
- اختيار المنطقة والمدينة ثم تنزيل خريطة المدينة Offline.
- مسح QR الحافلة بعد جاهزية الخريطة.
- RSM-ROUTE-PACKAGE v2 و D1/D2/D3.
- الدخول والخروج مع عكس ترتيب المحطات.
- إعداد GitHub Actions لبناء APK تلقائياً.

## GitHub Actions

ارفع مجلد هذا المشروع إلى GitHub Repository. بعد الرفع:
1. افتح تبويب **Actions**.
2. اختر **Build Route School Driver APK**.
3. اضغط **Run workflow**.
4. بعد انتهاء البناء افتح الـ workflow ثم **Artifacts**.
5. حمّل `Route-School-Driver-v8-APK`.

الـ APK الناتج هو Debug APK موقّع بمفتاح debug الخاص ببيئة البناء، وهو مناسب للاختبار والتثبيت المباشر. قبل النشر التجاري العام يفضّل إنشاء Release APK بمفتاح توقيع خاص محفوظ في GitHub Secrets.
