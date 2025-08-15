import React, { useEffect, useState } from "react";
import { getDailyWords } from "./utils/getDailyWords";
import { recordTestResult } from "./utils/stats";

function shuffle(array) {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/words.json")
      .then((res) => res.json())
      .then((data) => {
        const daily = getDailyWords(data);
        
        // Yeterli kelime kontrolü
        if (daily.length < 5) {
          setError("Yeterli kelime bulunamadı. Lütfen daha sonra tekrar deneyin.");
          return;
        }
        
        // 2 çoktan seçmeli soru
        const mcQuestions = daily.slice(0, 2).map((w, index) => {
          // Diğer kelimelerin anlamlarını yanlış cevap olarak kullan
          // Aynı kelimelerin kullanılmasını önle
          const availableWrongs = data.filter(x => 
            x.word !== w.word && 
            x.meaning && 
            x.meaning.trim() !== '' &&
            !daily.some(d => d.word === x.word) // Günlük kelimelerden farklı olmalı
          );
          const wrongs = shuffle(availableWrongs).slice(0, 3).map(x => x.meaning);
          
          const options = shuffle([w.meaning, ...wrongs]);
          
          return {
            type: "mc",
            word: w.word,
            correct: w.meaning,
            options
          };
        });

        // 1 doğru-yanlış sorusu
        const tfQuestion = {
          type: "tf",
          word: daily[2]?.word,
          sentence_en: daily[2]?.sentence_en,
          sentence_tr: daily[2]?.sentence_tr,
          correct: true // Her zaman doğru
        };

        // 1 eşleştirme sorusu
        const matchQuestion = {
          type: "match",
          word: daily[3]?.word,
          meaning: daily[3]?.meaning,
          correct: daily[3]?.meaning
        };

        // 1 boşluk doldurma sorusu
        const fillQuestion = {
          type: "fill",
          word: daily[4]?.word,
          sentence_en: daily[4]?.sentence_en?.replace(new RegExp(daily[4]?.word, "i"), "_____"),
          sentence_tr: daily[4]?.sentence_tr?.replace(new RegExp(daily[4]?.word, "i"), "_____"),
          correct: daily[4]?.word
        };

        setQuestions([...mcQuestions, tfQuestion, matchQuestion, fillQuestion]);
      })
      .catch(err => {
        setError("Kelime listesi yüklenirken hata oluştu.");
        console.error(err);
      });
  }, []);

  function handleAnswer(ans) {
    setAnswers([...answers, ans]);
    // Yanlış cevaplanan kelimeyi tekrar listesine ekle
    if (questions[step]) {
      const q = questions[step];
      let isCorrect = false;
      if (q.type === "tf") {
        isCorrect = ans === "true";
      } else {
        // Büyük/küçük harf duyarlılığını kaldır
        isCorrect = ans.toLowerCase().trim() === q.correct.toLowerCase().trim();
      }
      let currentDifficultWords = JSON.parse(localStorage.getItem("difficultWords") || "[]");
      if (!isCorrect) {
        // Yanlışsa ekle (zaten yoksa)
        if (!currentDifficultWords.some(w => w.word === q.word)) {
          currentDifficultWords.push(q);
        }
      } else {
        // Doğruysa çıkar
        currentDifficultWords = currentDifficultWords.filter(w => w.word !== q.word);
      }
      localStorage.setItem("difficultWords", JSON.stringify(currentDifficultWords));
    }
    if (step === 4) {
      setShowResult(true);
      // Test sonucunu istatistiklere kaydet
      const finalAnswers = [...answers, ans];
      const correctCount = finalAnswers.filter((a, i) => {
        const q = questions[i];
        if (q.type === "tf") return a === "true";
        // Büyük/küçük harf duyarlılığını kaldır
        return a.toLowerCase().trim() === q.correct.toLowerCase().trim();
      }).length;
      recordTestResult(correctCount, 5);
      
      // Doğru cevaplanan kelimeleri öğrenilmiş olarak işaretle
      let learnedWords = [];
      try {
        learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
      } catch (e) { learnedWords = []; }
      
      finalAnswers.forEach((answer, index) => {
        const q = questions[index];
        let isCorrect = false;
        if (q.type === "tf") {
          isCorrect = answer === "true";
        } else {
          // Büyük/küçük harf duyarlılığını kaldır
          isCorrect = answer.toLowerCase().trim() === q.correct.toLowerCase().trim();
        }
        
        if (isCorrect && !learnedWords.includes(q.word)) {
          learnedWords.push(q.word);
        }
      });
      
      localStorage.setItem("learnedWords", JSON.stringify(learnedWords));
    } else {
      setStep(step + 1);
    }
  }

  if (error) {
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16, textAlign: "center" }}>
        <div style={{ color: "#dc3545", fontSize: "1.2rem", marginBottom: "16px" }}>
          ⚠️ {error}
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
          🔄 Tekrar Dene
        </button>
      </div>
    );
  }

  if (!questions.length) return <div>Yükleniyor...</div>;
  if (showResult) {
    const correctCount = answers.filter((a, i) => {
      const q = questions[i];
      if (q.type === "tf") return a === "true";
      return a === q.correct;
    }).length;
    
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
        <h2>🎯 Test Sonuçları</h2>
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center",
          marginBottom: "20px"
        }}>
          <div style={{ fontSize: "3rem", fontWeight: "bold" }}>{correctCount}/5</div>
          <div style={{ fontSize: "1.5rem" }}>Başarı: %{Math.round((correctCount / 5) * 100)}</div>
        </div>
        
        <h3>Detaylı Sonuçlar:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {questions.map((q, i) => {
            const isCorrect = q.type === "tf" ? answers[i] === "true" : answers[i].toLowerCase().trim() === q.correct.toLowerCase().trim();
            return (
              <li key={`result-${i}-${q.word}`} style={{ 
                marginBottom: 16, 
                padding: "12px", 
                border: `2px solid ${isCorrect ? "#28a745" : "#dc3545"}`,
                borderRadius: "8px",
                background: isCorrect ? "#d4edda" : "#f8d7da",
                color: "#222"
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
            background: "#007bff",
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
      <h2>🎯 Mini Test ({step + 1}/5)</h2>
      
      {q.type === "mc" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#111" }}>
            <b>{q.word}</b> kelimesinin anlamı nedir?
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {q.options.map((opt, index) => (
              <button 
                key={`mc-${step}-${index}-${opt}`}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  color: "#111"
                }}
                onMouseOver={(e) => e.target.style.borderColor = "#007bff"}
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
          <div style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#111" }}>
            <b>{q.word}</b> kelimesi bu cümlede doğru kullanılmış mı?
          </div>
          <div style={{ 
            background: "#f8f9fa", 
            padding: "16px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            fontStyle: "italic",
            color: "#111"
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
          <div style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#111" }}>
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
              marginBottom: "12px",
              color: "#111"
            }}
            autoFocus
          />
          <button 
            onClick={e => {
              const input = e.target.previousSibling;
              if (input && input.value) handleAnswer(input.value.trim());
            }}
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
            Cevapla
          </button>
        </div>
      )}

      {q.type === "fill" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#111" }}>
            Cümlede boşluğu doldur:
          </div>
          <div style={{ 
            background: "#f8f9fa", 
            padding: "16px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "#111"
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
              marginBottom: "12px",
              color: "#111"
            }}
            autoFocus
          />
          <button 
            onClick={e => {
              const input = e.target.previousSibling;
              if (input && input.value) handleAnswer(input.value.trim());
            }}
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
            Cevapla
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz; 