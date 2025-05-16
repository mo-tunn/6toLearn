import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import MenuButton from "../components/MenuButton";
import "../styles/Quiz.css";

const backendUrl = "http://localhost:8080";

export default function Quiz() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]); // {word, correct, userAnswer}
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [quizAvailable, setQuizAvailable] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [wordCount, setWordCount] = useState(10);
  const [maxWords, setMaxWords] = useState(50);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [fetchWordsError, setFetchWordsError] = useState(null);

  // Ayarlar açıldığında kullanıcının toplam kelime sayısını çek
  useEffect(() => {
    if (showSettings) {
      const fetchWordCount = async () => {
        setWordsLoading(true);
        setFetchWordsError(null);
        const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
        try {
          const res = await fetch(`${backendUrl}/api/words`, { headers: { Authorization: basicAuth } });
          if (res.ok) {
            const data = await res.json();
            setMaxWords(data.length);
            if (data.length > 0 && wordCount > data.length) setWordCount(data.length);
          } else {
            setFetchWordsError("Kelimeler alınamadı.");
          }
        } catch (err) {
          setFetchWordsError("Kelimeler alınamadı: " + err.message);
        } finally {
          setWordsLoading(false);
        }
      };
      fetchWordCount();
    }
  }, [showSettings]);

  // Quiz başlat
  const startQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setResults([]);
    setCurrent(0);
    setAnswer("");
    const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
    try {
      const res = await fetch(`${backendUrl}/api/quiz/start?count=${wordCount}`, { headers: { Authorization: basicAuth } });
      if (res.ok) {
        const data = await res.json();
        if (!data || data.length === 0) {
          navigate("/ana-menu", { state: { info: "Quiz için yeterli kelime yok!" } });
          setQuizAvailable(false);
          setLoading(false);
          return;
        }
        setWords(data);
        setQuizAvailable(true);
      } else {
        const errorText = await res.text();
        alert("Quiz başlatılamadı! " + errorText);
      }
    } catch (err) {
      alert("Quiz başlatılırken bir hata oluştu: " + err.message);
    }
    setLoading(false);
  };

  // Cevap gönder
  const submitAnswer = async (e) => {
    e.preventDefault();
    const word = words[current];
    const correct = answer.trim().toLowerCase() === word.turWordName.trim().toLowerCase();
    const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
    await fetch(`${backendUrl}/api/quiz/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: basicAuth },
      body: JSON.stringify({
        wordId: word.id,
        correct: correct
      })
    });
    setResults(r => [...r, { word, correct, userAnswer: answer }]);
    setAnswer("");
    if (current + 1 < words.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (!quizAvailable) {
    return (
      <div className="quiz-container" style={{position: 'relative'}}>
        <MenuButton />
        <div className="quiz-card">
          <h2>Quiz Modülü</h2>
          <div style={{ color: "red" }}>Quiz için yeterli kelime yok!</div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="quiz-container" style={{position: 'relative'}}><MenuButton /><div className="quiz-card">Yükleniyor...</div></div>;

  if (finished) {
    const correctCount = results.filter(r => r.correct).length;
    return (
      <div className="quiz-container" style={{position: 'relative'}}>
        <MenuButton />
        <div className="quiz-card">
          <h2>Quiz Sonucu</h2>
          <div>Doğru sayısı: {correctCount} / {results.length}</div>
          <ul className="quiz-result-list">
            {results.map((r, i) => (
              <li key={i} className="quiz-result-item">
                {r.word.picture && (
                  <img src={r.word.picture} alt="" className="quiz-image-large" />
                )}
                <b style={{fontSize: '1.2em'}}>{r.word.engWordName}</b> - {r.word.turWordName} <br />
                <span className={r.word.wordSample ? undefined : "quiz-empty-sample"}>
                  {r.word.wordSample || <i>Örnek cümle yok</i>}
                </span><br />
                Senin cevabın: <i>{r.userAnswer}</i> {r.correct ? <span className="quiz-correct">✅</span> : <span className="quiz-wrong">❌</span>}
              </li>
            ))}
          </ul>
          <button onClick={startQuiz}>Tekrar Quiz Yap</button>
        </div>
      </div>
    );
  }

  if (!words.length) {
    return (
      <div className="quiz-container" style={{position: 'relative'}}>
        <MenuButton />
        <div className="quiz-card">
          <h2>Quiz Modülü</h2>
          <button onClick={() => setShowSettings(true)} style={{marginBottom: 16}}>Ayarlar ⚙️</button>
          {showSettings && (
            <div className="quiz-settings-modal">
              <div className="quiz-settings-content">
                <label htmlFor="wordCountInput">Quizde çıkacak kelime sayısı:</label>
                {wordsLoading ? (
                  <div>Yükleniyor...</div>
                ) : fetchWordsError ? (
                  <div style={{color: 'red'}}>{fetchWordsError}</div>
                ) : maxWords === 0 ? (
                  <div style={{color: 'red'}}>Hiç kelimeniz yok, önce kelime ekleyin!</div>
                ) : (
                  <input
                    id="wordCountInput"
                    type="number"
                    min={1}
                    max={maxWords}
                    value={wordCount}
                    onChange={e => {
                      let val = Number(e.target.value);
                      if (val > maxWords) val = maxWords;
                      if (val < 1) val = 1;
                      setWordCount(val);
                    }}
                    style={{margin: '10px 0', padding: '8px', borderRadius: 6, border: '1px solid #c7d2fe', width: 80, textAlign: 'center'}}
                  />
                )}
                <div style={{marginTop: 10}}>
                  <button
                    onClick={() => setShowSettings(false)}
                    style={{marginRight: 10}}
                    disabled={maxWords === 0}
                  >
                    Kaydet ve Kapat
                  </button>
                </div>
              </div>
            </div>
          )}
          {!showSettings && maxWords > 0 && (
            <button onClick={startQuiz}>Quiz Başlat</button>
          )}
          {!showSettings && maxWords === 0 && (
            <div style={{color: 'red', marginTop: 16}}>Quiz başlatmak için önce kelime eklemelisiniz.</div>
          )}
        </div>
      </div>
    );
  }

  const word = words[current];

  return (
    <div className="quiz-container" style={{position: 'relative'}}>
      <MenuButton />
      <div className="quiz-card quiz-card-large">
        <div className="quiz-progress">{current + 1} / {words.length}</div>
        {word.picture && (
          <img src={word.picture} alt="" className="quiz-image-large" />
        )}
        <div className="quiz-question-main">
          <div className="quiz-word-main">{word.engWordName}</div>
        </div>
        {word.wordSample && (
          <div className="quiz-sample-sentence">{word.wordSample}</div>
        )}
        <form onSubmit={submitAnswer} className="quiz-answer-form">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Türkçesini yazın..."
            autoFocus
          />
          <button type="submit">Cevabı Gönder</button>
        </form>
      </div>
    </div>
  );
} 