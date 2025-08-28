import React, { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Favorileri ve tüm kelimeleri yükle
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    console.log("🔍 Favorites.jsx - localStorage'dan okunan favoriler:", savedFavorites);
    console.log("🔍 Favorites.jsx - Favori sayısı:", savedFavorites.length);
    
    // Tekrarlanan favorileri temizle (kelime adına göre)
    const uniqueFavorites = savedFavorites.filter((item, index, self) => 
      index === self.findIndex(f => f.word === item.word)
    );
    
    if (uniqueFavorites.length !== savedFavorites.length) {
      console.log("🧹 Duplicate favoriler temizlendi:", savedFavorites.length, "→", uniqueFavorites.length);
      localStorage.setItem("favorites", JSON.stringify(uniqueFavorites));
      setFavorites(uniqueFavorites);
    } else {
      setFavorites(uniqueFavorites);
    }

    // Eğer hala çok fazla favori varsa, localStorage'ı temizle
    if (uniqueFavorites.length > 10) {
      console.log("🚨 Çok fazla favori var, localStorage temizleniyor!");
      localStorage.removeItem("favorites");
      setFavorites([]);
    }

    // Eğer 100'den fazla favori varsa, localStorage'ı tamamen temizle
    if (uniqueFavorites.length > 100) {
      console.log("🚨🚨 100'den fazla favori var, localStorage tamamen temizleniyor!");
      localStorage.removeItem("favorites");
      setFavorites([]);
      return; // Çık
    }

    fetch("/words.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Favorites.jsx - Tüm kelimeler yüklendi:", data.length);
        setAllWords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading words:", error);
        setLoading(false);
      });
  }, []);

  function removeFavorite(word) {
    // Kelimeyi favorilerden çıkar (kelime adına göre)
    const newFavorites = favorites.filter(f => f.word !== word);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    
    // Stats'ı güncelle
    const { updateFavoriteCount } = require('./utils/stats');
    updateFavoriteCount(newFavorites.length);
  }

  if (loading) return <div>Yükleniyor...</div>;

  // Debug: Filtre öncesi durumu göster
  console.log("🔍 Favorites.jsx - Filtre öncesi:");
  console.log("  - favorites array:", favorites);
  console.log("  - allWords array length:", allWords.length);
  console.log("  - İlk 5 allWords:", allWords.slice(0, 5));

  const favoriteWords = allWords.filter(w => {
    const isFavorite = favorites.some(f => f.word === w.word);
    if (isFavorite) {
      console.log("✅ Kelime favori:", w.word);
    }
    return isFavorite;
  });
  
  console.log("🔍 Favorites.jsx - Filtre sonrası:");
  console.log("  - Filtrelenmiş favori kelimeler:", favoriteWords);
  console.log("  - Favori sayısı:", favoriteWords.length);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
      <h1>Favorilerim ({favoriteWords.length})</h1>
      {favoriteWords.length === 0 ? (
        <p>Henüz favori kelime eklemediniz.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favoriteWords.map((w) => (
            <li
              key={w.word}
              style={{ marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 12 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 20 }}>{w.word}</b> <span style={{ color: '#888' }}>– {w.meaning}</span>
                  <br />
                  <i style={{ color: '#555' }}>{w.sentence_en}</i>
                  {w.sentence_tr && (
                    <>
                      <br />
                      <span style={{ color: '#888', fontSize: 14 }}>{w.sentence_tr}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => removeFavorite(w.word)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    color: "red",
                    marginLeft: 8
                  }}
                  aria-label="Favorilerden çıkar"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites; 