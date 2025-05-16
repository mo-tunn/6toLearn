import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/KelimelerimVeAnaliz.css';
import MenuButton from '../components/MenuButton';

const KelimelerimVeAnaliz = () => {
  const navigate = useNavigate();
  const { auth, getAuthHeader } = useAuth();
  const [words, setWords] = useState([]);
  const [groupedWords, setGroupedWords] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [correctCounts, setCorrectCounts] = useState({});
  const [topicSuccessRates, setTopicSuccessRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateTopicSuccessRates = (words, correctCounts) => {
    // Konulara göre kelimeleri grupla
    const topicWords = {};
    words.forEach(word => {
      const topic = word.topic || 'Konusuz';
      if (!topicWords[topic]) {
        topicWords[topic] = [];
      }
      topicWords[topic].push(word);
    });

    // Her konu için başarı oranını hesapla
    const rates = Object.entries(topicWords).map(([topic, topicWords]) => {
      const totalPossibleCorrect = topicWords.length * 6; // Her kelime için maksimum 6 doğru
      const totalActualCorrect = topicWords.reduce((sum, word) => {
        return sum + (correctCounts[word.id] || 0);
      }, 0);

      const successRate = totalPossibleCorrect > 0 
        ? (totalActualCorrect * 100 / totalPossibleCorrect) 
        : 0;

      return {
        topic,
        successRate: Number(successRate.toFixed(2))
      };
    });

    return rates;
  };

  useEffect(() => {
    if (!auth?.username || !auth?.password) {
      navigate('/login');
      return;
    }
    fetchWords();
    fetchGroupedWords();
    fetchCorrectCounts();
  }, [auth, navigate]);

  // Kelimeler ve doğru sayıları değiştiğinde başarı oranlarını hesapla
  useEffect(() => {
    if (words.length > 0 && Object.keys(correctCounts).length > 0) {
      const rates = calculateTopicSuccessRates(words, correctCounts);
      setTopicSuccessRates(rates);
    }
  }, [words, correctCounts]);

  const fetchWords = async () => {
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/words/details', {
        headers: {
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Kelimeler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setWords(data);
    } catch (err) {
      console.error('Error fetching words:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupedWords = async () => {
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/words/grouped-by-topic', {
        headers: {
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Gruplandırılmış kelimeler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setGroupedWords(data);
    } catch (err) {
      console.error('Error fetching grouped words:', err);
      setError(err.message);
    }
  };

  const fetchCorrectCounts = async () => {
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:8080/api/words/correct-counts', {
        headers: {
          'Authorization': authHeader
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Doğru sayıları yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      // Convert array to map for easier access
      const countsMap = data.reduce((acc, item) => {
        acc[item.id] = item.correctCount;
        return acc;
      }, {});
      setCorrectCounts(countsMap);
    } catch (err) {
      console.error('Error fetching correct counts:', err);
      setError(err.message);
    }
  };

  const fetchWordDetails = async (wordId) => {
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/words/${wordId}/details`, {
        headers: {
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Kelime detayları yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setSelectedWord(data);
    } catch (err) {
      console.error('Error fetching word details:', err);
      setError(err.message);
    }
  };

  const deleteWord = async (wordId, event) => {
    event.stopPropagation(); // Kelime kartına tıklama olayını engelle
    if (!window.confirm('Bu kelimeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/words/${wordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Kelime silinirken bir hata oluştu');
      }

      // Kelime listesini güncelle
      fetchWords();
      fetchGroupedWords();
      fetchCorrectCounts();
    } catch (err) {
      console.error('Error deleting word:', err);
      setError(err.message);
    }
  };

  const handleViewReport = () => {
    navigate('/konu-analiz-raporu');
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="kelimelerim-container">
      <div className="page-header">
        <MenuButton />
      </div>

      <div className="content-wrapper">
        <h1 className="page-title">Kelimelerim</h1>
        
        {/* Topic Success Rates Chart */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>Konu Bazlı Başarı Oranları</h2>
            <button className="pdf-button" onClick={handleViewReport}>
              <i className="fas fa-file-pdf"></i>
              Raporu Görüntüle
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={topicSuccessRates}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis label={{ value: 'Başarı Oranı (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Başarı Oranı']} />
                <Bar dataKey="successRate" fill="#6366f1" name="Başarı Oranı" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="words-grid">
          {Object.entries(groupedWords).map(([topic, words]) => (
            <div key={topic} className="topic-section">
              <h2>{topic || 'Konusuz'}</h2>
              <div className="words-list">
                {words.map(word => (
                  <div 
                    key={word.id} 
                    className="word-card"
                    onClick={() => fetchWordDetails(word.id)}
                  >
                    <div className="word-card-header">
                      <h3>{word.engWordName}</h3>
                      <button 
                        className="delete-button"
                        onClick={(e) => deleteWord(word.id, e)}
                        title="Kelimeyi Sil"
                      >
                        X
                      </button>
                    </div>
                    <p>{word.turWordName}</p>
                    <p><strong>Doğru Sayısı:</strong> {correctCounts[word.id] ?? 0}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedWord && (
        <div className="word-details-modal">
          <div className="modal-content">
            <h2>{selectedWord.engWordName}</h2>
            <p><strong>Türkçe:</strong> {selectedWord.turWordName}</p>
            {selectedWord.picture && (
              <img src={selectedWord.picture} alt={selectedWord.engWordName} className="word-image" />
            )}
            <p><strong>Örnek Cümle:</strong> {selectedWord.wordSample}</p>
            <p><strong>Oluşturulma Tarihi:</strong> {new Date(selectedWord.createdAt).toLocaleDateString()}</p>
            <p><strong>Konu:</strong> {selectedWord.topic || 'Konusuz'}</p>
            <p><strong>Doğru Sayısı:</strong> {correctCounts[selectedWord.id] ?? 0}</p>
            <button onClick={() => setSelectedWord(null)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelimelerimVeAnaliz; 