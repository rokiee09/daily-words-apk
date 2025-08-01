# Keystore Oluşturma - Hızlı Yöntem

## Android Studio ile Keystore Oluşturma:

1. **Android Studio'yu açın**
2. **Build > Generate Signed Bundle / APK**
3. **Android App Bundle** seçin
4. **Create new** butonuna tıklayın
5. **Keystore bilgilerini doldurun:**
   - Key store path: `daily-words-keystore.jks`
   - Password: `dailywords123`
   - Alias: `dailywords`
   - Password: `dailywords123`
   - Validity: `25` yıl
   - Certificate bilgileri:
     - First and Last Name: `Burak Avci`
     - Organizational Unit: `Development`
     - Organization: `Daily Words`
     - City: `Istanbul`
     - State: `Istanbul`
     - Country Code: `TR`

6. **Keystore dosyasını proje klasörüne kaydedin**

## PWA Builder'da Kullanma:

1. **PWA Builder'a geri dönün**
2. **"All Settings"** linkine tıklayın
3. **Keystore bilgilerini girin:**
   - Keystore path: `daily-words-keystore.jks`
   - Keystore password: `dailywords123`
   - Key alias: `dailywords`
   - Key password: `dailywords123`

4. **"Download Package"** butonuna tıklayın

Bu sefer imzalanmış AAB dosyası indireceksiniz! 