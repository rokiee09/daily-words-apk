import React, { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Favorileri ve tüm kelimeleri yükle
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);

    fetch("/words.json")
      .then((res) => res.json())
      .then((data) => {
        setAllWords(data);
        setLoading(false);
      });
  }, []);

  function removeFavorite(word) {
    const newFavorites = favorites.filter(f => f !== word);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  }

  if (loading) return <div>Yükleniyor...</div>;

  const favoriteWords = allWords.filter(w => favorites.includes(w.word));

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