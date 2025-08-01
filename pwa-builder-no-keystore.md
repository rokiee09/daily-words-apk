# PWA Builder'da Keystore Olmadan AAB Oluşturma

## Adım 1: PWA Builder'a Gidin
- https://www.pwabuilder.com/validate?url=https://daily-words-apk-git-main-burakavcis-projects.vercel.app

## Adım 2: Build My PWA
- **"Build My PWA"** butonuna tıklayın
- **"Android"** seçin
- **"App Bundle (AAB)"** formatını seçin

## Adım 3: Android Package Options
- **Package ID:** `com.dailywords.app`
- **App name:** `Daily Words`
- **Short name:** `DailyWords`
- **Include source code:** İşaretlemeyin
- **Keystore bilgilerini boş bırakın** (imzalanmamış olsun)

## Adım 4: Download Package
- **"Download Package"** butonuna tıklayın
- İmzalanmamış AAB dosyası indirecek

## Adım 5: Google Play Console'da Test
- **Internal testing** track'ine yükleyin
- **Test kullanıcıları** ekleyin
- **Test edin**

Bu yöntemle imzalanmamış AAB'yi test edebiliriz! 