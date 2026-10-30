# مشروع "مدير حساباتي" (Account Manager Pro)

تطبيق Android محلي وشامل لإدارة حسابات Google المتعددة بأمان عالي وتشفير كامل للبيانات باستخدام React Native و Expo و SQLite و TypeScript.

## 🚀 كيفية تشغيل المشروع محلياً

1. **تثبيت الاعتماديات:**
   ```bash
   npm install
   ```

2. **تشغيل تطبيق Expo:**
   ```bash
   npx expo start
   ```

3. **التشغيل على محاكي Android أو جهاز محمول:**
   - قم بمسح رمز QR عبر تطبيق **Expo Go**.

---

## 🔐 إعداد Google Cloud OAuth 2.0
لاستخدام المصادقة الحقيقية:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/).
2. أنشئ مشروعاً جديداً وقم بتفعيل **Google People API**.
3. قم بإنشاء **OAuth 2.0 Client ID** من نوع Android وتحديد اسم الحزمة (Package Name) ورمز الـ SHA-1 الخاص بجهازك.
4. أضف `client_id` داخل ملف شاشة إضافة الحسابات.

---

## 📦 بناء ملف الـ APK
لبناء ملف APK قابل للتثبيت المباشر على أجهزة أندرويد:

```bash
npx eas build -p android --profile preview
```
