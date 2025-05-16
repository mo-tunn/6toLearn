import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateStoryAndImage } from '../services/openaiService';
import { useAuth } from '../components/AuthContext';
import '../styles/AILearningPage.css';
import MenuButton from '../components/MenuButton';

const backendUrl = "http://localhost:8080";

const AILearningPage = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [userWords, setUserWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [englishStory, setEnglishStory] = useState('');
    const [turkishStory, setTurkishStory] = useState('');
    const [explanations, setExplanations] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previousStories, setPreviousStories] = useState([]);
    const [showPreviousStories, setShowPreviousStories] = useState(false);

    useEffect(() => {
        fetchUserWords();
        fetchPreviousStories();
    }, []);

    const fetchUserWords = async () => {
        try {
            const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
            const response = await fetch(`${backendUrl}/api/words`, {
                headers: {
                    'Authorization': basicAuth
                }
            });
            if (response.ok) {
                const words = await response.json();
                setUserWords(words);
            } else {
                setError('Kelimeler yüklenirken bir hata oluştu.');
            }
        } catch (err) {
            setError('Kelimeler yüklenirken bir hata oluştu: ' + err.message);
        }
    };

    const fetchPreviousStories = async () => {
        try {
            const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
            const response = await fetch(`${backendUrl}/api/ai-stories`, {
                headers: {
                    'Authorization': basicAuth
                }
            });
            if (response.ok) {
                const stories = await response.json();
                setPreviousStories(stories);
            } else {
                setError('Eski hikayeler yüklenirken bir hata oluştu.');
            }
        } catch (err) {
            setError('Eski hikayeler yüklenirken bir hata oluştu: ' + err.message);
        }
    };

    const handleWordSelect = (word) => {
        if (selectedWords.find(w => w.id === word.id)) {
            setSelectedWords(selectedWords.filter(w => w.id !== word.id));
        } else {
            setSelectedWords([...selectedWords, word]);
        }
    };

    const saveStoryToBackend = async (storyData) => {
        try {
            const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
            const response = await fetch(`${backendUrl}/api/ai-stories`, {
                method: 'POST',
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyData)
            });
            
            if (!response.ok) {
                throw new Error('Hikaye kaydedilirken bir hata oluştu');
            }
        } catch (err) {
            console.error('Hikaye kaydedilirken hata:', err);
            setError('Hikaye kaydedilirken bir hata oluştu: ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedWords.length === 0) {
            setError('Lütfen en az bir kelime seçin.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const wordPairs = selectedWords.map(word => ({
                english: word.engWordName,
                turkish: word.turWordName
            }));

            const result = await generateStoryAndImage(wordPairs);
            setEnglishStory(result.englishStory);
            setTurkishStory(result.turkishStory);
            setExplanations(result.explanations);
            setImageUrl(result.imageUrl);

            // Save the story to backend
            const storyData = {
                englishStory: result.englishStory,
                turkishStory: result.turkishStory,
                imageUrl: result.imageUrl,
                wordExplanations: result.explanations
            };
            await saveStoryToBackend(storyData);

        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const highlightSelectedWords = (text, selectedWords) => {
        if (!text || !selectedWords || selectedWords.length === 0) return text;
        
        let highlightedText = text;
        selectedWords.forEach(word => {
            const regex = new RegExp(`\\b${word.engWordName}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, match => 
                `<span class="highlighted-word">${match}</span>`
            );
        });
        return highlightedText;
    };

    return (
        <div className="ai-learning-container">
            <MenuButton />
            <h1>Yapay Zekayla Öğren!</h1>

            <div className="story-controls">
                <button 
                    className="previous-stories-button"
                    onClick={() => setShowPreviousStories(!showPreviousStories)}
                >
                    {showPreviousStories ? 'Yeni Hikaye Oluştur' : 'Eski Hikayelerim'}
                </button>
            </div>

            {showPreviousStories ? (
                <div className="previous-stories-container">
                    <h2>Eski Hikayelerim</h2>
                    {previousStories.length === 0 ? (
                        <p>Henüz hiç hikaye oluşturmadınız.</p>
                    ) : (
                        <div className="stories-grid">
                            {previousStories.map((story) => (
                                <div key={story.id} className="story-card">
                                    <div className="story-content">
                                        <h3>İngilizce Hikaye</h3>
                                        <p dangerouslySetInnerHTML={{ 
                                            __html: highlightSelectedWords(story.englishStory, selectedWords) 
                                        }} />
                                        
                                        <h3>Türkçe Çeviri</h3>
                                        <p>{story.turkishStory}</p>
                                        
                                        <h3>Kelime Açıklamaları</h3>
                                        <p>{story.wordExplanations}</p>
                                        
                                        {story.imageUrl && (
                                            <div className="story-image">
                                                <img src={story.imageUrl} alt="Story illustration" />
                                            </div>
                                        )}
                                        
                                        <div className="story-date">
                                            Oluşturulma Tarihi: {new Date(story.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="word-selection-container">
                        <h2>Kelimeleriniz</h2>
                        <p>Hikayede kullanmak istediğiniz kelimeleri seçin:</p>
                        <div className="word-grid">
                            {userWords.map(word => (
                                <div
                                    key={word.id}
                                    className={`word-item ${selectedWords.find(w => w.id === word.id) ? 'selected' : ''}`}
                                    onClick={() => handleWordSelect(word)}
                                >
                                    <span className="english">{word.engWordName}</span>
                                    <span className="turkish">{word.turWordName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="selected-words-container">
                        <h3>Seçilen Kelimeler:</h3>
                        <div className="selected-words-list">
                            {selectedWords.map(word => (
                                <span key={word.id} className="selected-word-tag">
                                    {word.engWordName} ({word.turWordName})
                                    <button onClick={() => handleWordSelect(word)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="generate-button" 
                        onClick={handleSubmit} 
                        disabled={loading || selectedWords.length === 0}
                    >
                        {loading ? 'Hikaye Oluşturuluyor...' : 'Hikaye Oluştur'}
                    </button>

                    {error && <div className="error-message">{error}</div>}

                    {loading && <div className="loading">Hikaye ve görsel oluşturuluyor...</div>}

                    {(englishStory || turkishStory || imageUrl) && (
                        <div className="result-container">
                            <div className="story-section">
                                <h2>İngilizce Hikaye</h2>
                                <p dangerouslySetInnerHTML={{ 
                                    __html: highlightSelectedWords(englishStory, selectedWords) 
                                }} />
                            </div>
                            
                            <div className="story-section">
                                <h2>Türkçe Çeviri</h2>
                                <p>{turkishStory}</p>
                            </div>

                            <div className="story-section">
                                <h2>Kelime Açıklamaları</h2>
                                <p>{explanations}</p>
                            </div>

                            {imageUrl && (
                                <div className="image-section">
                                    <h2>Hikayenin Görseli</h2>
                                    <img src={imageUrl} alt="Generated story illustration" />
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AILearningPage; 