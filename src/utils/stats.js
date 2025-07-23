// İstatistik verilerini localStorage'dan yükle
export function loadStats() {
  const stats = JSON.parse(localStorage.getItem("dailyWordsStats") || "{}");
  return {
    totalWordsLearned: stats.totalWordsLearned || 0,
    consecutiveDays: stats.consecutiveDays || 0,
    lastStudyDate: stats.lastStudyDate || null,
    totalTestsTaken: stats.totalTestsTaken || 0,
    totalCorrectAnswers: stats.totalCorrectAnswers || 0,
    favoriteWordsCount: stats.favoriteWordsCount || 0,
    studyHistory: stats.studyHistory || []
  };
}

// İstatistikleri kaydet
export function saveStats(stats) {
  localStorage.setItem("dailyWordsStats", JSON.stringify(stats));
}

// Günlük çalışma kaydı
export function recordDailyStudy() {
  const stats = loadStats();
  const today = new Date().toISOString().slice(0, 10);
  
  // Bugün daha önce çalışılmış mı kontrol et
  const todayStudied = stats.studyHistory.includes(today);
  if (!todayStudied) {
    stats.studyHistory.push(today);
    stats.totalWordsLearned += 5; // Günlük 5 kelime
    
    // Ardışık günleri hesapla
    const sortedDates = stats.studyHistory.sort();
    let consecutive = 1;
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffTime = currentDate - prevDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        consecutive++;
      } else {
        break;
      }
    }
    stats.consecutiveDays = consecutive;
  }
  
  stats.lastStudyDate = today;
  saveStats(stats);
  return stats;
}

// Test sonucunu kaydet
export function recordTestResult(correctCount, totalQuestions) {
  const stats = loadStats();
  stats.totalTestsTaken++;
  stats.totalCorrectAnswers += correctCount;
  saveStats(stats);
}

// Favori kelime sayısını güncelle
export function updateFavoriteCount(count) {
  const stats = loadStats();
  stats.favoriteWordsCount = count;
  saveStats(stats);
}

// Başarı yüzdesini hesapla
export function calculateSuccessRate() {
  const stats = loadStats();
  if (stats.totalTestsTaken === 0) return 0;
  return Math.round((stats.totalCorrectAnswers / (stats.totalTestsTaken * 5)) * 100);
}

// Haftalık çalışma verilerini al
export function getWeeklyStats() {
  const stats = loadStats();
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weeklyDates = stats.studyHistory.filter(date => {
    const studyDate = new Date(date);
    return studyDate >= weekAgo && studyDate <= today;
  });
  
  return weeklyDates.length;
} 

// Rozetleri yükle
export function loadBadges() {
  return JSON.parse(localStorage.getItem("earnedBadges") || "[]");
}
// Rozet ekle
export function addBadge(badge) {
  const badges = loadBadges();
  if (!badges.includes(badge)) {
    badges.push(badge);
    localStorage.setItem("earnedBadges", JSON.stringify(badges));
  }
}

// 5 gün üst üste giriş rozeti
export function checkStreakBadge() {
  const stats = loadStats();
  if (stats.consecutiveDays >= 5) {
    addBadge("streak"); // 🥇 “Sürekli Öğrenen”
  }
}

// 50 favori kelime rozeti
export function checkFavoriteBadge() {
  const stats = loadStats();
  if (stats.favoriteWordsCount >= 50) {
    addBadge("librarian"); // 💾 “Kütüphaneci”
  }
} 

// 7, 14, 30 gün üst üste giriş rozetleri
export function checkAdvancedStreakBadges() {
  const stats = loadStats();
  if (stats.consecutiveDays >= 7) {
    addBadge("weekly-hero"); // 🥈 Haftalık Kahraman
  }
  if (stats.consecutiveDays >= 14) {
    addBadge("consistency-master"); // 🥉 İstikrar Ustası
  }
  if (stats.consecutiveDays >= 30) {
    addBadge("student-of-the-month"); // 🏆 Ayın Öğrencisi
  }
} 