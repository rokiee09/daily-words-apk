# Hızlı Keystore Oluşturma Rehberi

## Android Studio'da Keystore Oluşturma (5 dakika):

### Adım 1: Android Studio'yu Açın
- Android Studio'yu açın
- Herhangi bir proje açın (yeni proje oluşturabilirsiniz)

### Adım 2: Build Menüsüne Gidin
- **Build** menüsüne tıklayın
- **Generate Signed Bundle / APK** seçin

### Adım 3: Android App Bundle Seçin
- **Android App Bundle** seçin
- **Next** butonuna tıklayın

### Adım 4: Keystore Oluşturun
- **Create new** butonuna tıklayın
- **Key store path:** `C:\Users\burak\Desktop\daily-words\daily-words-keystore.jks`
- **Password:** `dailywords123`
- **Confirm:** `dailywords123`
- **Alias:** `dailywords`
- **Password:** `dailywords123`
- **Confirm:** `dailywords123`
- **Validity:** `25`
- **Certificate bilgileri:**
  - **First and Last Name:** `Burak Avci`
  - **Organizational Unit:** `Development`
  - **Organization:** `Daily Words`
  - **City:** `Istanbul`
  - **State:** `Istanbul`
  - **Country Code:** `TR`
- **OK** butonuna tıklayın

### Adım 5: Keystore Dosyasını Kontrol Edin
- `C:\Users\burak\Desktop\daily-words\daily-words-keystore.jks` dosyası oluştu mu?
- Dosya boyutu yaklaşık 2-3 KB olmalı

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