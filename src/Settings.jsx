import React, { useState, useEffect } from "react";
import { 
  requestNotificationPermission, 
  saveReminderSettings, 
  loadReminderSettings,
  sendDailyReminder,
  isNotificationSupported 
} from "./utils/notifications";

function Settings() {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [notificationSupported] = useState(isNotificationSupported());
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Ayarları yükle
    const settings = loadReminderSettings();
    setReminderEnabled(settings.enabled);
    setReminderTime(settings.time);
    
    // Bildirim izni durumunu kontrol et
    if (notificationSupported) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, [notificationSupported]);

  const handleReminderToggle = async () => {
    if (!notificationSupported) {
      alert('Bu tarayıcı bildirimleri desteklemiyor.');
      return;
    }

    if (!permissionGranted) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('Bildirim izni verilmedi. Hatırlatmalar çalışmayacak.');
        return;
      }
      setPermissionGranted(true);
    }

    const newEnabled = !reminderEnabled;
    setReminderEnabled(newEnabled);
    saveReminderSettings(newEnabled, reminderTime);
  };

  const handleTimeChange = (newTime) => {
    setReminderTime(newTime);
    saveReminderSettings(reminderEnabled, newTime);
  };

  const testNotification = () => {
    if (!permissionGranted) {
      alert('Önce bildirim izni vermelisin.');
      return;
    }
    sendDailyReminder();
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>⚙️ Ayarlar</h1>
      
      {/* Hatırlatma Ayarları */}
      <div style={{
        background: "#f8f9fa",
        padding: "24px",
        borderRadius: "12px",
        marginBottom: "24px"
      }}>
        <h2 style={{ margin: "0 0 16px 0", color: "#333" }}>🔔 Günlük Hatırlatma</h2>
        
        {!notificationSupported ? (
          <div style={{
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "16px",
            color: "#856404"
          }}>
            <p style={{ margin: 0 }}>
              Bu tarayıcı bildirimleri desteklemiyor. Hatırlatma özelliği kullanılamaz.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <input
                type="checkbox"
                id="reminder-toggle"
                checked={reminderEnabled}
                onChange={handleReminderToggle}
                style={{ transform: "scale(1.2)" }}
              />
              <label htmlFor="reminder-toggle" style={{ fontSize: "16px", cursor: "pointer" }}>
                Günlük hatırlatma bildirimleri
              </label>
            </div>
            
            {reminderEnabled && (
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="reminder-time" style={{ display: "block", marginBottom: "8px" }}>
                  Hatırlatma saati:
                </label>
                <input
                  type="time"
                  id="reminder-time"
                  value={reminderTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "16px",
                    border: "2px solid #ddd",
                    borderRadius: "6px"
                  }}
                />
              </div>
            )}
            
            {!permissionGranted && (
              <div style={{
                background: "#d1ecf1",
                border: "1px solid #bee5eb",
                borderRadius: "8px",
                padding: "12px",
                color: "#0c5460",
                marginBottom: "16px"
              }}>
                <p style={{ margin: 0 }}>
                  Bildirim izni verilmedi. Hatırlatmalar için izin vermen gerekiyor.
                </p>
              </div>
            )}
            
            <button
              onClick={testNotification}
              disabled={!permissionGranted}
              style={{
                background: permissionGranted ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: permissionGranted ? "pointer" : "not-allowed"
              }}
            >
              Test Bildirimi Gönder
            </button>
          </>
        )}
      </div>

      {/* Uygulama Bilgileri */}
      <div style={{
        background: "#e9ecef",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px"
      }}>
        <h3 style={{ margin: "0 0 12px 0", color: "#495057" }}>📱 Uygulama Bilgileri</h3>
        <div style={{ fontSize: "14px", color: "#6c757d" }}>
          <p style={{ margin: "4px 0" }}><strong>Versiyon:</strong> 1.0.0</p>
          <p style={{ margin: "4px 0" }}><strong>Geliştirici:</strong> Daily Words Team</p>
          <p style={{ margin: "4px 0" }}><strong>Desteklenen Özellikler:</strong></p>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>Günlük 5 kelime öğrenme</li>
            <li>Mini test sistemi</li>
            <li>Favori kelimeler</li>
            <li>İstatistik takibi</li>
            <li>Sesli telaffuz</li>
            <li>Günlük hatırlatmalar</li>
          </ul>
        </div>
      </div>

      {/* Veri Yönetimi */}
      <div style={{
        background: "#fff3cd",
        border: "1px solid #ffeaa7",
        borderRadius: "12px",
        padding: "20px"
      }}>
        <h3 style={{ margin: "0 0 12px 0", color: "#856404" }}>🗄️ Veri Yönetimi</h3>
        <p style={{ margin: "0 0 16px 0", color: "#856404", fontSize: "14px" }}>
          Tüm verilerin tarayıcının yerel depolama alanında saklanır. 
          Tarayıcı verilerini temizlersen tüm ilerlemen kaybolur.
        </p>
        <button
          onClick={() => {
            if (confirm('Tüm verilerini silmek istediğinden emin misin? Bu işlem geri alınamaz.')) {
              localStorage.clear();
              alert('Tüm veriler silindi. Sayfa yenilenecek.');
              window.location.reload();
            }
          }}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Tüm Verileri Sil
        </button>
      </div>
    </div>
  );
}

export default Settings; 