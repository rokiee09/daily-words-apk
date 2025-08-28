import React, { useEffect, useState } from "react";
import { 
  loadStats, 
  calculateSuccessRate, 
  getWeeklyStats, 
  loadBadges 
} from "./utils/stats";

// Test sonuçlarını gösteren component
function TestResultsList() {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem("testResults") || "[]");
    setTestResults(results.slice(-10).reverse()); // Son 10 test sonucu
  }, []);

  if (testResults.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        Henüz test sonucu yok. Mini test yaparak başlayın!
      </div>
    );
  }

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {testResults.map((result, index) => {
        const date = new Date(result.date);
        const percentage = Math.round((result.score / result.total) * 100);
        const isPassed = result.score >= 4;
        
        return (
          <div 
            key={index}
            style={{
              background: isPassed ? "#d4edda" : "#f8d7da",
              border: `1px solid ${isPassed ? "#c3e6cb" : "#f5c6cb"}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {date.toLocaleDateString('tr-TR')} - {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                {result.testType === "daily" ? "Günlük Test" : "Favori Test"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: isPassed ? "#155724" : "#721c24" }}>
                {result.score}/{result.total} ({percentage}%)
              </div>
              <div style={{ fontSize: "12px", color: isPassed ? "#155724" : "#721c24" }}>
                {isPassed ? "✅ Başarılı" : "❌ Başarısız"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const currentStats = loadStats();
    setStats(currentStats);
  }, []);

  if (!stats) return <div>Yükleniyor...</div>;

  const successRate = calculateSuccessRate();
  
  const weeklyStudyDays = getWeeklyStats();
  const badges = loadBadges();

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>📊 İstatistiklerim</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px",
        marginBottom: "2rem"
      }}>
        {/* Toplam Öğrenilen Kelime */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>📚 Toplam Kelime</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.totalWordsLearned}</div>
          <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Öğrenilen kelime sayısı</p>
        </div>

        {/* Ardışık Günler */}
        <div style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>🔥 Ardışık Günler</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.consecutiveDays}</div>
          <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Üst üste çalışılan gün</p>
        </div>

        {/* Test Başarı Oranı */}
        <div style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>🎯 Başarı Oranı</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>%{successRate}</div>
          <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Mini test başarısı</p>
        </div>

        {/* Toplam Test */}
        <div style={{
          background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>📝 Toplam Test</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.totalTestsTaken}</div>
          <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Çözülen test sayısı</p>
        </div>

        {/* Favori Kelimeler */}
        <div style={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          color: "#333",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>❤️ Favori Kelimeler</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.favoriteWordsCount}</div>
          <p style={{ margin: "8px 0 0 0", opacity: 0.7 }}>Favoriye eklenen kelime</p>
        </div>

        {/* Haftalık Çalışma */}
        <div style={{
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          color: "#333",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>📅 Haftalık Çalışma</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{weeklyStudyDays}</div>
          <p style={{ margin: "8px 0 0 0", opacity: 0.7 }}>Bu hafta çalışılan gün</p>
        </div>
      </div>

      {/* Test Sonuçları Detayı */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📊 Test Sonuçları</h2>
        <TestResultsList />
      </div>

      {/* Rozetler */}
      <div style={{
        background: "#fffbe6",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "2rem",
        border: "1px solid #ffe58f",
        color: "#333"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🏅 Rozetlerim</h3>
        {badges.length === 0 ? (
          <p>Henüz rozet kazanmadın.</p>
        ) : (
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {badges.includes("streak") && (
              <div style={{ fontSize: 32 }} title="5 gün arka arkaya giriş yaptın! 🥇 Sürekli Öğrenen">🥇<br/><span style={{ fontSize: 14 }}>Sürekli Öğrenen</span></div>
            )}
            {badges.includes("librarian") && (
              <div style={{ fontSize: 32 }} title="50 kelimeyi favoriye ekledin! 💾 Kütüphaneci">💾<br/><span style={{ fontSize: 14 }}>Kütüphaneci</span></div>
            )}
            {badges.includes("weekly-hero") && (
              <div style={{ fontSize: 32 }} title="7 gün üst üste giriş yaptın! 🥈 Haftalık Kahraman">🥈<br/><span style={{ fontSize: 14 }}>Haftalık Kahraman</span></div>
            )}
            {badges.includes("consistency-master") && (
              <div style={{ fontSize: 32 }} title="14 gün üst üste giriş yaptın! 🥉 İstikrar Ustası">🥉<br/><span style={{ fontSize: 14 }}>İstikrar Ustası</span></div>
            )}
            {badges.includes("student-of-the-month") && (
              <div style={{ fontSize: 32 }} title="30 gün üst üste giriş yaptın! 🏆 Ayın Öğrencisi">🏆<br/><span style={{ fontSize: 14 }}>Ayın Öğrencisi</span></div>
            )}
          </div>
        )}
      </div>

      {/* Rozet kutlaması animasyonu (örnek) */}
      {badges.includes("weekly-hero") && (
        <div style={{ margin: '24px 0', padding: 16, background: '#e6fffb', borderRadius: 12, fontSize: 20, color: '#08979c', animation: 'pop 0.7s' }}>
          🎉 Tebrikler! 7 gün üst üste giriş yaptın ve <b>Haftalık Kahraman</b> rozetini kazandın!
        </div>
      )}
      {badges.includes("consistency-master") && (
        <div style={{ margin: '24px 0', padding: 16, background: '#fffbe6', borderRadius: 12, fontSize: 20, color: '#d48806', animation: 'pop 0.7s' }}>
          🎉 Harika! 14 gün üst üste giriş yaptın ve <b>İstikrar Ustası</b> rozetini kazandın!
        </div>
      )}
      {badges.includes("student-of-the-month") && (
        <div style={{ margin: '24px 0', padding: 16, background: '#f6ffed', borderRadius: 12, fontSize: 20, color: '#389e0d', animation: 'pop 0.7s' }}>
          🏆 Muhteşem! 30 gün üst üste giriş yaptın ve <b>Ayın Öğrencisi</b> rozetini kazandın!
        </div>
      )}

      {/* Son Çalışma Tarihi */}
      {stats.lastStudyDate && (
        <div style={{
          background: "#f8f9fa",
          padding: "16px",
          borderRadius: "8px",
          textAlign: "center",
          marginTop: "20px"
        }}>
          <p style={{ margin: 0, color: "#666" }}>
            <strong>Son çalışma:</strong> {new Date(stats.lastStudyDate).toLocaleDateString('tr-TR')}
          </p>
        </div>
      )}

      {/* Motivasyon Mesajı */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        marginTop: "20px"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>💪 Motivasyon</h3>
        {stats.consecutiveDays >= 7 ? (
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            Harika! {stats.consecutiveDays} gündür düzenli çalışıyorsun. Bu tempoyu koru!
          </p>
        ) : stats.consecutiveDays >= 3 ? (
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            Güzel gidiyorsun! {stats.consecutiveDays} gündür çalışıyorsun. 7 güne ulaşmaya çalış!
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            Her gün 5 kelime öğrenmeye devam et! Düzenli çalışma başarının anahtarı.
          </p>
        )}
      </div>
    </div>
  );
}

export default Stats; 