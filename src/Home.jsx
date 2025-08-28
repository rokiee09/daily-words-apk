import React, { useEffect, useState } from "react";
import { getDailyWords } from "./utils/getDailyWords";
import { recordDailyStudy, updateFavoriteCount, checkStreakBadge, checkFavoriteBadge, checkAdvancedStreakBadges } from "./utils/stats";
import { speakWord, speakSentence, isSpeechSupported } from "./utils/speech";

function Home({ onDailyWordsChange }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [speechSupported] = useState(isSpeechSupported());
  const [today, setToday] = useState(() => new Date());
  const [showRepeat, setShowRepeat] = useState(false);
  const [repeatWords, setRepeatWords] = useState([]);

  // Tarih değişimini dinle (her dakika kontrol)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      const currentString = current.toISOString().slice(0, 10);
      const todayString = today.toISOString().slice(0, 10);
      if (currentString !== todayString) {
        setToday(current);
      }
    }, 60 * 1000); // her dakika kontrol et
    return () => clearInterval(interval);
  }, [today]);

  useEffect(() => {
    // Favorileri yükle ve temizle
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    console.log("🔍 Home.jsx - Mevcut favoriler:", savedFavorites);
    
    // Duplicate'ları temizle
    const uniqueFavorites = savedFavorites.filter((item, index, self) => 
      index === self.findIndex(f => f.word === item.word)
    );
    
    if (uniqueFavorites.length !== savedFavorites.length) {
      console.log("🧹 Home.jsx - Duplicate favoriler temizlendi:", savedFavorites.length, "→", uniqueFavorites.length);
      localStorage.setItem("favorites", JSON.stringify(uniqueFavorites));
      setFavorites(uniqueFavorites);
      updateFavoriteCount(uniqueFavorites.length);
    } else {
      setFavorites(uniqueFavorites);
      updateFavoriteCount(uniqueFavorites.length);
    }

    // Günlük kelimeleri yükle
    fetch("/words.json")
      .then((res) => res.json())
      .then((data) => {
        const dailyWords = getDailyWords(data, today);
        setWords(dailyWords);
        onDailyWordsChange(dailyWords);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Veri yükleme hatası:", err);
        setError("Kelimeler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.");
        setLoading(false);
      });
  }, [today, onDailyWordsChange]);

  // Bu kısım kaldırıldı - artık kelimeler sadece testte doğru cevaplanınca öğrenilmiş sayılacak

  useEffect(() => {
    if (showRepeat) {
      let difficultWords = [];
      try {
        difficultWords = JSON.parse(localStorage.getItem("difficultWords") || "[]");
      } catch (e) { difficultWords = []; }
      // Difficult words artık tam obje olarak saklanıyor
      const difficultWordObjects = difficultWords.filter(w => typeof w === 'object' && w.word);
      setRepeatWords(difficultWordObjects);
    }
  }, [showRepeat, words]);

  function toggleFavorite(word) {
    console.log("=== FAVORİ İŞLEMİ BAŞLADI ===");
    console.log("Eklenmek istenen kelime:", word);
    console.log("Mevcut favoriler:", favorites);
    
    // Eğer kelime zaten favorilerde varsa çıkar, yoksa ekle
    const isAlreadyFavorite = favorites.some(f => f.word === word.word);
    console.log("Zaten favori mi:", isAlreadyFavorite);
    console.log("Kontrol edilen kelime:", word.word);
    console.log("Mevcut favori kelimeler:", favorites.map(f => f.word));
    
    if (isAlreadyFavorite) {
      // Favorilerden çıkar
      const newFavorites = favorites.filter(f => f.word !== word.word);
      console.log("✅ Favorilerden çıkarıldı, yeni liste:", newFavorites);
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      updateFavoriteCount(newFavorites.length);
    } else {
      // Favorilere ekle (sadece bir kez)
      // Güçlü duplicate kontrolü
      if (favorites.some(f => f.word === word.word)) {
        console.log("❌ HATA: Kelime zaten favorilerde var ama kontrol edilemedi!");
        return; // Çık
      }
      
      // Ek güvenlik: localStorage'dan tekrar oku ve kontrol et
      const currentFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (currentFavorites.some(f => f.word === word.word)) {
        console.log("❌ HATA: localStorage'da zaten var!");
        // localStorage'ı temizle ve state'i güncelle
        const cleanFavorites = currentFavorites.filter(f => f.word !== word.word);
        localStorage.setItem("favorites", JSON.stringify(cleanFavorites));
        setFavorites(cleanFavorites);
        updateFavoriteCount(cleanFavorites.length);
        return;
      }
      
      const newFavorites = [...favorites, word];
      console.log("✅ Favorilere eklendi, yeni liste:", newFavorites);
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      updateFavoriteCount(newFavorites.length);
    }
    
    console.log("=== FAVORİ İŞLEMİ BİTTİ ===");
  }

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (words.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16, textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#28a745" }}>
          🎉 Tebrikler! Tüm kelimeleri öğrendin!
        </div>
        <div style={{ marginBottom: "20px", color: "#666" }}>
          Öğrenilen kelimeleri sıfırlamak istersen aşağıdaki butona tıkla.
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem("learnedWords");
            window.location.reload();
          }}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          🔄 Öğrenilen Kelimeleri Sıfırla
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setShowRepeat(false)} style={{ background: !showRepeat ? '#007bff' : '#f9f9f9', color: !showRepeat ? 'white' : '#007bff', border: '2px solid #007bff', borderRadius: 8, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Bugünün Kelimeleri</button>
        <button onClick={() => setShowRepeat(true)} style={{ background: showRepeat ? '#28a745' : '#f9f9f9', color: showRepeat ? 'white' : '#28a745', border: '2px solid #28a745', borderRadius: 8, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Tekrar Et</button>
      </div>
      {!showRepeat ? (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {words.map((w) => (
          <li
            key={w.word}
            style={{ marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div
                style={{ flex: 1, cursor: "pointer" }}
                onClick={() => setSelectedWord(w)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <b style={{ fontSize: 20 }}>{w.word}</b>
                    {w.type && <span style={{ color: '#aaa', fontSize: 16 }}>({w.type})</span>}
                  {speechSupported && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await speakWord(w.word);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        color: "#007bff",
                        padding: "4px"
                      }}
                      aria-label="Kelimeyi sesli oku"
                    >
                      🔊
                    </button>
                  )}
                </div>
                <span style={{ color: '#888' }}>– {w.meaning}</span>
                  <div style={{ display: "flex", flexDirection: 'column', alignItems: "flex-start", gap: "4px", marginTop: "4px" }}>
                    <i style={{ color: '#555' }}>{w.sentence_en}</i>
                    {w.sentence_tr && <span style={{ color: '#888', fontSize: 14 }}>{w.sentence_tr}</span>}
                    {speechSupported && w.sentence_en && (
                      <button
                                              onClick={async (e) => {
                        e.stopPropagation();
                        await speakSentence(w.sentence_en);
                      }}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "16px",
                          cursor: "pointer",
                          color: "#28a745",
                          padding: "4px"
                        }}
                        aria-label="Cümleyi sesli oku"
                      >
                        🎵
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(w)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 24,
                    cursor: "pointer",
                    color: favorites.some(f => f.word === w.word) ? "red" : "gray",
                    marginLeft: 8
                  }}
                  aria-label={favorites.some(f => f.word === w.word) ? "Favorilerden çıkar" : "Favorilere ekle"}
                >
                  {favorites.some(f => f.word === w.word) ? "❤️" : "🤍"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2>Tekrar Et (Zorlandığın Kelimeler)</h2>
          {repeatWords.length === 0 ? <p>Tekrar etmen gereken kelime yok!</p> : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {repeatWords.map((w) => (
                <li
                  key={w.word}
                  style={{ marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 12 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div
                      style={{ flex: 1, cursor: "pointer" }}
                      onClick={() => setSelectedWord(w)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <b style={{ fontSize: 20 }}>{w.word}</b>
                        {w.type && <span style={{ color: '#aaa', fontSize: 16 }}>({w.type})</span>}
                  {speechSupported && (
                    <button
                                                  onClick={async (e) => {
                              e.stopPropagation();
                              await speakWord(w.word);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: "18px",
                              cursor: "pointer",
                              color: "#007bff",
                              padding: "4px"
                            }}
                            aria-label="Kelimeyi sesli oku"
                          >
                            🔊
                          </button>
                        )}
                      </div>
                      <span style={{ color: '#888' }}>– {w.meaning}</span>
                      <div style={{ display: "flex", flexDirection: 'column', alignItems: "flex-start", gap: "4px", marginTop: "4px" }}>
                        <i style={{ color: '#555' }}>{w.sentence_en}</i>
                        {w.sentence_tr && <span style={{ color: '#888', fontSize: 14 }}>{w.sentence_tr}</span>}
                        {speechSupported && w.sentence_en && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakSentence(w.sentence_en);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#28a745",
                        padding: "4px"
                      }}
                      aria-label="Cümleyi sesli oku"
                    >
                      🎵
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(w)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: favorites.some(f => f.word === w.word) ? "red" : "gray",
                  marginLeft: 8
                }}
                aria-label={favorites.some(f => f.word === w.word) ? "Favorilerden çıkar" : "Favorilere ekle"}
              >
                {favorites.some(f => f.word === w.word) ? "❤️" : "🤍"}
              </button>
            </div>
          </li>
        ))}
      </ul>
          )}
        </div>
      )}
      {selectedWord && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
        onClick={() => setSelectedWord(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 12,
              minWidth: 300,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              position: "relative",
              color: "#222"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedWord(null)}
              style={{ position: "absolute", top: 8, right: 12, background: "none", border: "none", fontSize: 22, cursor: "pointer" }}
              aria-label="Kapat"
            >
              ×
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>{selectedWord.word}</h2>
              {selectedWord.type && <span style={{ color: '#aaa', fontSize: 18 }}>({selectedWord.type})</span>}
              {speechSupported && (
                <button
                                          onClick={async () => await speakWord(selectedWord.word)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#007bff",
                    padding: "8px"
                  }}
                  aria-label="Kelimeyi sesli oku"
                >
                  🔊
                </button>
              )}
            </div>
            <p><b>Anlamı:</b> {selectedWord.meaning}</p>
            <div style={{ display: "flex", flexDirection: 'column', gap: '4px' }}>
              <p style={{ margin: 0 }}><b>İngilizce cümle:</b> <i>{selectedWord.sentence_en}</i></p>
              {selectedWord.sentence_tr && <span style={{ color: '#888', fontSize: 15 }}><b>Türkçesi:</b> {selectedWord.sentence_tr}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 