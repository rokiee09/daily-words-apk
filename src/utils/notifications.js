// Bildirim desteğini kontrol et
export function isNotificationSupported() {
  return 'Notification' in window;
}

// Bildirim izni iste
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Günlük hatırlatma bildirimi gönder
export function sendDailyReminder() {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification('🧠 Daily Words', {
    body: 'Bugünün 5 kelimesi seni bekliyor! Hemen öğrenmeye başla!',
    icon: '/favicon.ico', // Varsayılan icon
    badge: '/favicon.ico',
    tag: 'daily-reminder',
    requireInteraction: false,
    silent: false
  });

  // Bildirime tıklandığında uygulamayı aç
  notification.onclick = function() {
    window.focus();
    notification.close();
  };

  // 5 saniye sonra otomatik kapat
  setTimeout(() => {
    notification.close();
  }, 5000);
}

// Hatırlatma ayarlarını kaydet
export function saveReminderSettings(enabled, time) {
  localStorage.setItem('dailyWordsReminder', JSON.stringify({
    enabled,
    time
  }));
}

// Hatırlatma ayarlarını yükle
export function loadReminderSettings() {
  const settings = JSON.parse(localStorage.getItem('dailyWordsReminder') || '{}');
  return {
    enabled: settings.enabled || false,
    time: settings.time || '09:00'
  };
}

// Hatırlatma zamanını kontrol et ve bildirim gönder
export function checkAndSendReminder() {
  const settings = loadReminderSettings();
  
  if (!settings.enabled) {
    return;
  }

  const now = new Date();
  const reminderTime = new Date();
  const [hours, minutes] = settings.time.split(':');
  reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Bugün bu saatte bildirim gönderilmiş mi kontrol et
  const lastReminder = localStorage.getItem('lastReminderDate');
  const today = now.toDateString();
  
  if (lastReminder === today) {
    return; // Bugün zaten bildirim gönderilmiş
  }

  // Şu an hatırlatma zamanı mı?
  const timeDiff = Math.abs(now - reminderTime);
  const fiveMinutes = 5 * 60 * 1000; // 5 dakika tolerans

  if (timeDiff <= fiveMinutes) {
    sendDailyReminder();
    localStorage.setItem('lastReminderDate', today);
  }
}

// Hatırlatma zamanlayıcısını başlat
export function startReminderTimer() {
  // Her dakika kontrol et
  setInterval(checkAndSendReminder, 60 * 1000);
  
  // İlk kontrol
  checkAndSendReminder();
} 