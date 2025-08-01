# Keystore Oluşturma Talimatları

## Android Studio'da Keystore Oluşturma:

1. **Android Studio'yu açın**
2. **Build > Generate Signed Bundle / APK** menüsüne gidin
3. **Android App Bundle** seçin
4. **Create new** butonuna tıklayın
5. **Keystore bilgilerini doldurun:**
   - Key store path: `daily-words-keystore.jks`
   - Password: `dailywords123` (veya güvenli bir şifre)
   - Alias: `dailywords`
   - Password: `dailywords123` (veya güvenli bir şifre)
   - Validity: `25` yıl
   - Certificate bilgileri:
     - First and Last Name: `Burak Avci`
     - Organizational Unit: `Development`
     - Organization: `Daily Words`
     - City: `Istanbul`
     - State: `Istanbul`
     - Country Code: `TR`

6. **Keystore dosyasını proje klasörüne kaydedin**

## GitHub Secrets Ayarlama:

1. **GitHub repository'nize gidin**
2. **Settings > Secrets and variables > Actions**
3. **New repository secret** butonuna tıklayın
4. **Aşağıdaki secrets'ları ekleyin:**

```
BUBBLEWRAP_KEYSTORE_PATH: daily-words-keystore.jks
BUBBLEWRAP_KEYSTORE_PASSWORD: dailywords123
BUBBLEWRAP_KEY_ALIAS: dailywords
BUBBLEWRAP_KEY_PASSWORD: dailywords123
```

## Keystore Dosyasını Base64'e Çevirme:

Keystore dosyasını GitHub'a yüklemek için base64'e çevirmeniz gerekiyor:

```bash
# Windows PowerShell'de:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("daily-words-keystore.jks"))
```

Bu komutu çalıştırıp çıkan base64 string'i `BUBBLEWRAP_KEYSTORE_PATH` secret'ına kaydedin. 