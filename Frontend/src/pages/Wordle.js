import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/Wordle.css';
import MenuButton from '../components/MenuButton';

const backendUrl = "http://localhost:8080";

export default function Wordle() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [words, setWords] = useState([]);
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [wordLength, setWordLength] = useState(0);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
        const response = await fetch(`${backendUrl}/api/words/correct-counts`, {
          headers: { Authorization: basicAuth }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter words with 6 correct answers
          const perfectWords = data.filter(word => word.correctCount === 6);
          setWords(perfectWords);
          
          if (perfectWords.length > 0) {
            // Select a random word
            const randomIndex = Math.floor(Math.random() * perfectWords.length);
            const selectedWord = perfectWords[randomIndex].engWordName.toLowerCase();
            setTargetWord(selectedWord);
            setWordLength(selectedWord.length);
          } else {
            setMessage("Wordle oynamak için en az bir kelimenin 6 kez doğru bilinmiş olması gerekiyor!");
          }
        }
      } catch (error) {
        setMessage("Kelimeler yüklenirken bir hata oluştu!");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [auth]);

  const handleKeyPress = (e) => {
    if (gameOver) return;

    if (e.key === 'Enter') {
      if (currentGuess.length === wordLength) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === targetWord) {
          setGameOver(true);
          setMessage('Tebrikler! Kelimeyi buldunuz!');
        } else if (newGuesses.length === 6) {
          setGameOver(true);
          setMessage(`Oyun bitti! Doğru kelime: ${targetWord}`);
        }
      }
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + e.key.toLowerCase());
    }
  };

  const getLetterStatus = (letter, index) => {
    if (letter === targetWord[index]) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  };

  if (loading) {
    return <div className="wordle-container">Yükleniyor...</div>;
  }

  if (message && !targetWord) {
    return (
      <div className="wordle-container">
        <MenuButton />
        <div className="wordle-message">{message}</div>
      </div>
    );
  }

  return (
    <div className="wordle-container" onKeyDown={handleKeyPress} tabIndex="0">
      <MenuButton />
      
      <h1>Wordle</h1>
      
      {message && <div className="wordle-message">{message}</div>}
      
      <div className="wordle-board">
        {Array(6).fill(0).map((_, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {Array(wordLength).fill(0).map((_, colIndex) => {
              const guess = guesses[rowIndex];
              const letter = guess ? guess[colIndex] : 
                (rowIndex === guesses.length ? (currentGuess[colIndex] || '') : '');
              const status = guess ? getLetterStatus(letter, colIndex) : '';
              
              return (
                <div 
                  key={colIndex} 
                  className={`wordle-cell ${status} ${rowIndex === guesses.length && colIndex === currentGuess.length ? 'current' : ''}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="wordle-keyboard">
        {Array(26).fill(0).map((_, i) => {
          const letter = String.fromCharCode(97 + i);
          return (
            <button 
              key={letter}
              className="keyboard-key"
              onClick={() => {
                if (gameOver) return;
                if (currentGuess.length < wordLength) {
                  setCurrentGuess(prev => prev + letter);
                }
              }}
            >
              {letter}
            </button>
          );
        })}
        <button 
          className="keyboard-key enter"
          onClick={() => {
            if (gameOver) return;
            if (currentGuess.length === wordLength) {
              const newGuesses = [...guesses, currentGuess];
              setGuesses(newGuesses);
              setCurrentGuess('');

              if (currentGuess === targetWord) {
                setGameOver(true);
                setMessage('Tebrikler! Kelimeyi buldunuz!');
              } else if (newGuesses.length === 6) {
                setGameOver(true);
                setMessage(`Oyun bitti! Doğru kelime: ${targetWord}`);
              }
            }
          }}
        >
          Enter
        </button>
        <button 
          className="keyboard-key backspace"
          onClick={() => {
            if (gameOver) return;
            setCurrentGuess(prev => prev.slice(0, -1));
          }}
        >
          ⌫
        </button>
      </div>
    </div>
  );
} 