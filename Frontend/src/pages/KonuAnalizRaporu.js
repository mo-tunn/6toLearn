import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/KonuAnalizRaporu.css';

const KonuAnalizRaporu = () => {
  const navigate = useNavigate();
  const { auth, getAuthHeader } = useAuth();
  const [words, setWords] = useState([]);
  const [correctCounts, setCorrectCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.username || !auth?.password) {
      navigate('/login');
      return;
    }
    fetchWords();
    fetchCorrectCounts();
  }, [auth, navigate]);

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
      const countsMap = data.reduce((acc, item) => {
        acc[item.id] = item.correctCount;
        return acc;
      }, {});
      setCorrectCounts(countsMap);
    } catch (err) {
      console.error('Error fetching correct counts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTopicSuccessRates = (words, correctCounts) => {
    const topicWords = {};
    words.forEach(word => {
      const topic = word.topic || 'Konusuz';
      if (!topicWords[topic]) {
        topicWords[topic] = [];
      }
      topicWords[topic].push(word);
    });

    const rates = Object.entries(topicWords).map(([topic, topicWords]) => {
      const totalPossibleCorrect = topicWords.length * 6;
      const totalActualCorrect = topicWords.reduce((sum, word) => {
        return sum + (correctCounts[word.id] || 0);
      }, 0);

      const successRate = totalPossibleCorrect > 0 
        ? (totalActualCorrect * 100 / totalPossibleCorrect) 
        : 0;

      return {
        topic,
        successRate: Number(successRate.toFixed(2)),
        wordCount: topicWords.length,
        totalCorrect: totalActualCorrect,
        totalPossible: totalPossibleCorrect
      };
    });

    return rates;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  const successRates = calculateTopicSuccessRates(words, correctCounts);

  return (
    <div className="konu-analiz-container">
      <div className="report-header">
        <h1>Konu Bazlı Başarı Raporu</h1>
        <p>Oluşturulma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
      </div>

      <div className="report-content">
        {successRates.map(({ topic, successRate, wordCount, totalCorrect, totalPossible }) => (
          <div key={topic} className="topic-report">
            <h2>{topic}</h2>
            <div className="report-details">
              <div className="detail-item">
                <span className="label">Kelime Sayısı:</span>
                <span className="value">{wordCount}</span>
              </div>
              <div className="detail-item">
                <span className="label">Toplam Doğru:</span>
                <span className="value">{totalCorrect} / {totalPossible}</span>
              </div>
              <div className="detail-item">
                <span className="label">Başarı Oranı:</span>
                <span className="value">{successRate}%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="report-footer">
        <p>6toLearn - Kelime Öğrenme Sistemi</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/kelimelerim-ve-analiz')} className="back-button">
          Geri Dön
        </button>
        <button onClick={handlePrint} className="print-button">
          Yazdır
        </button>
      </div>
    </div>
  );
};

export default KonuAnalizRaporu; 