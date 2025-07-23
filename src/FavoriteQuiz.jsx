import React, { useEffect, useState } from "react";
import { recordTestResult } from "./utils/stats";

function shuffle(array) {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

function FavoriteQuiz() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Favori kelimeleri ve tüm kelimeleri yükle
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (favorites.length < 3) {
      setLoading(false);
      return;
    }

    fetch("/words.json")
      .then((res) => res.json())
      .then((data) => {
        const favoriteWords = data.filter(w => favorites.includes(w.word));
        
        if (favoriteWords.length < 3) {
          setLoading(false);
          return;
        }

        // Favori kelimelerden rastgele 5 tane seç (veya hepsini kullan)
        const selectedFavorites = shuffle(favoriteWords).slice(0, Math.min(5, favoriteWords.length));
        
        const quizQuestions = selectedFavorites.map((w, index) => {
          // Farklı soru tipleri
          const questionTypes = ["mc", "tf", "match", "fill"];
          const type = questionTypes[index % questionTypes.length];
          
          switch (type) {
            case "mc":
              const wrongs = shuffle(data.filter(x => x.word !== w.word)).slice(0, 3).map(x => x.meaning);
              const options = shuffle([w.meaning, ...wrongs]);
              return {
                type: "mc",
                word: w.word,
                correct: w.meaning,
                options
              };
            
            case "tf":
              return {
                type: "tf",
                word: w.word,
                sentence_en: w.sentence_en,
                sentence_tr: w.sentence_tr,
                correct: true
              };
            
            case "match":
              return {
                type: "match",
                word: w.word,
                meaning: w.meaning,
                correct: w.meaning
              };
            
            case "fill":
              return {
                type: "fill",
                word: w.word,
                sentence_en: w.sentence_en?.replace(new RegExp(w.word, "i"), "_____"),
                sentence_tr: w.sentence_tr?.replace(new RegExp(w.word, "i"), "_____"),
                correct: w.word
              };
            
            default:
              return {
                type: "mc",
                word: w.word,
                correct: w.meaning,
                options: [w.meaning, "seçenek 1", "seçenek 2", "seçenek 3"]
              };
          }
        });
        
        setQuestions(quizQuestions);
        setLoading(false);
      });
  }, []);

  function handleAnswer(ans) {
    setAnswers([...answers, ans]);
    if (step === questions.length - 1) {
      setShowResult(true);
      // Test sonucunu istatistiklere kaydet
      const correctCount = [...answers, ans].filter((a, i) => {
        const q = questions[i];
        if (q.type === "tf") return a === "true";
        return a === q.correct;
      }).length;
      recordTestResult(correctCount, questions.length);
    } else {
      setStep(step + 1);
    }
  }

  if (loading) return <div>Yükleniyor...</div>;
  
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.length < 3) {
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16, textAlign: "center" }}>
        <h2>❤️ Favori Kelimeler Testi</h2>
        <div style={{
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0"
        }}>
          <p style={{ margin: 0, color: "#856404" }}>
            Test yapabilmek için en az 3 favori kelime eklemelisin.
          </p>
          <p style={{ margin: "10px 0 0 0", color: "#856404" }}>
            Şu anda {favorites.length} favori kelimen var.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  if (showResult) {
    const correctCount = answers.filter((a, i) => {
      const q = questions[i];
      if (q.type === "tf") return a === "true";
      return a === q.correct;
    }).length;
    
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
        <h2>❤️ Favori Kelimeler Testi Sonuçları</h2>
        <div style={{
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center",
          marginBottom: "20px"
        }}>
          <div style={{ fontSize: "3rem", fontWeight: "bold" }}>{correctCount}/{questions.length}</div>
          <div style={{ fontSize: "1.5rem" }}>Başarı: %{Math.round((correctCount / questions.length) * 100)}</div>
        </div>
        
        <h3>Detaylı Sonuçlar:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {questions.map((q, i) => {
            const isCorrect = q.type === "tf" ? answers[i] === "true" : answers[i] === q.correct;
            return (
              <li key={i} style={{ 
                marginBottom: 16, 
                padding: "12px", 
                border: `2px solid ${isCorrect ? "#28a745" : "#dc3545"}`,
                borderRadius: "8px",
                background: isCorrect ? "#d4edda" : "#f8d7da"
              }}>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Soru {i + 1}: {q.type === "mc" ? "Çoktan Seçmeli" : 
                                q.type === "tf" ? "Doğru/Yanlış" :
                                q.type === "match" ? "Eşleştirme" : "Boşluk Doldurma"}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  {q.type === "mc" && <span><b>{q.word}</b> kelimesinin anlamı nedir?</span>}
                  {q.type === "tf" && <span><b>{q.word}</b> kelimesi bu cümlede doğru kullanılmış mı?</span>}
                  {q.type === "match" && <span><b>{q.word}</b> kelimesinin anlamını eşleştir</span>}
                  {q.type === "fill" && <span>Cümlede boşluğu doldur: <i>{q.sentence_en}</i></span>}
                </div>
                <div style={{ color: isCorrect ? "#155724" : "#721c24" }}>
                  <strong>Senin cevabın:</strong> {answers[i]}<br />
                  <strong>Doğru cevap:</strong> {q.type === "tf" ? "Doğru" : q.correct}
                </div>
              </li>
            );
          })}
        </ul>
        <button 
          onClick={() => { setStep(0); setAnswers([]); setShowResult(false); }}
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          🔄 Tekrar Dene
        </button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
      <h2>❤️ Favori Kelimeler Testi ({step + 1}/{questions.length})</h2>
      
      {q.type === "mc" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
            <b>{q.word}</b> kelimesinin anlamı nedir?
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {q.options.map((opt) => (
              <button 
                key={opt} 
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left"
                }}
                onMouseOver={(e) => e.target.style.borderColor = "#ff6b6b"}
                onMouseOut={(e) => e.target.style.borderColor = "#ddd"}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {q.type === "tf" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
            <b>{q.word}</b> kelimesi bu cümlede doğru kullanılmış mı?
          </div>
          <div style={{ 
            background: "#f8f9fa", 
            padding: "16px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            fontStyle: "italic"
          }}>
            <i>{q.sentence_en}</i><br />
            <span style={{ color: '#888', fontSize: 14 }}>{q.sentence_tr}</span>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <button 
              onClick={() => handleAnswer("true")}
              style={{
                flex: 1,
                padding: "16px",
                fontSize: "16px",
                border: "2px solid #28a745",
                borderRadius: "8px",
                background: "white",
                color: "#28a745",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.background = "#28a745"}
              onMouseOut={(e) => e.target.style.background = "white"}
            >
              ✅ Doğru
            </button>
            <button 
              onClick={() => handleAnswer("false")}
              style={{
                flex: 1,
                padding: "16px",
                fontSize: "16px",
                border: "2px solid #dc3545",
                borderRadius: "8px",
                background: "white",
                color: "#dc3545",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.background = "#dc3545"}
              onMouseOut={(e) => e.target.style.background = "white"}
            >
              ❌ Yanlış
            </button>
          </div>
        </div>
      )}

      {q.type === "match" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
            <b>{q.word}</b> kelimesinin anlamını eşleştir
          </div>
          <input
            type="text"
            onKeyDown={e => {
              if (e.key === "Enter") handleAnswer(e.target.value.trim());
            }}
            placeholder="Anlamını yaz..."
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              marginBottom: "12px"
            }}
            autoFocus
          />
          <button 
            onClick={e => {
              const input = e.target.previousSibling;
              if (input && input.value) handleAnswer(input.value.trim());
            }}
            style={{
              background: "#ff6b6b",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Cevapla
          </button>
        </div>
      )}

      {q.type === "fill" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
            Cümlede boşluğu doldur:
          </div>
          <div style={{ 
            background: "#f8f9fa", 
            padding: "16px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            fontStyle: "italic",
            fontSize: "1.1rem"
          }}>
            <i>{q.sentence_en}</i><br />
            <span style={{ color: '#888', fontSize: 14 }}>{q.sentence_tr}</span>
          </div>
          <input
            type="text"
            onKeyDown={e => {
              if (e.key === "Enter") handleAnswer(e.target.value.trim());
            }}
            placeholder="Kelimeyi yaz..."
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              marginBottom: "12px"
            }}
            autoFocus
          />
          <button 
            onClick={e => {
              const input = e.target.previousSibling;
              if (input && input.value) handleAnswer(input.value.trim());
            }}
            style={{
              background: "#ff6b6b",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Cevapla
          </button>
        </div>
      )}
    </div>
  );
}

export default FavoriteQuiz; 