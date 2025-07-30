import React, { useState, useEffect } from "react";
import Home from "./Home";
import Quiz from "./Quiz";
import Favorites from "./Favorites";
import Stats from "./Stats";
import FavoriteQuiz from "./FavoriteQuiz";
import Settings from "./Settings";
import { startReminderTimer } from "./utils/notifications";

function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    // Hatırlatma zamanlayıcısını başlat
    startReminderTimer();
  }, []);

  return (
    <div>
      <header style={{ 
        textAlign: "center", 
        padding: "20px 0", 
        borderBottom: "2px solid #eee",
        marginBottom: "20px"
      }}>
        <img src="/daily-words-logo.png" alt="Logo" style={{ width: 64, height: 64, borderRadius: '50%', display: 'block', margin: '0 auto 12px auto' }} />
        <h1 style={{ 
          margin: 0, 
          color: "#333",
          fontSize: "2.5rem",
          fontWeight: "bold"
        }}>
          🧠 Daily Words
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "1.1rem" }}>
          Her gün 5 yeni İngilizce kelime öğren
        </p>
      </header>
      
      <nav style={{ 
        display: "flex", 
        gap: 12, 
        justifyContent: "center", 
        margin: "20px 16px",
        flexWrap: "wrap"
      }}>
        <button 
          onClick={() => setPage("home")}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "2px solid #007bff",
            background: page === "home" ? "#007bff" : "white",
            color: page === "home" ? "white" : "#007bff",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          📚 Ana Sayfa
        </button>
        <button 
          onClick={() => setPage("quiz")}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "2px solid #28a745",
            background: page === "quiz" ? "#28a745" : "white",
            color: page === "quiz" ? "white" : "#28a745",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          🎯 Mini Test
        </button>
        <button 
          onClick={() => setPage("favoriteQuiz")}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "2px solid #ff6b6b",
            background: page === "favoriteQuiz" ? "#ff6b6b" : "white",
            color: page === "favoriteQuiz" ? "white" : "#ff6b6b",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          ❤️ Favori Test
        </button>
        <button 
          onClick={() => setPage("favorites")}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "2px solid #dc3545",
            background: page === "favorites" ? "#dc3545" : "white",
            color: page === "favorites" ? "white" : "#dc3545",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          ❤️ Favorilerim
        </button>
        <button 
          onClick={() => setPage("stats")}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "2px solid #6f42c1",
            background: page === "stats" ? "#6f42c1" : "white",
            color: page === "stats" ? "white" : "#6f42c1",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          📊 İstatistikler
        </button>
        <button 
          onClick={() => setPage("settings")}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "2px solid #6c757d",
            background: page === "settings" ? "#6c757d" : "white",
            color: page === "settings" ? "white" : "#6c757d",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          ⚙️ Ayarlar
        </button>
      </nav>
      
      {page === "home" && <Home />}
      {page === "quiz" && <Quiz />}
      {page === "favoriteQuiz" && <FavoriteQuiz />}
      {page === "favorites" && <Favorites />}
      {page === "stats" && <Stats />}
      {page === "settings" && <Settings />}
    </div>
  );
}

export default App;
