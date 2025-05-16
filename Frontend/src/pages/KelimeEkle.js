import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/KelimeEkle.css";
import MenuButton from '../components/MenuButton';

const backendUrl = "http://localhost:8080";

export default function KelimeEkle() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [engWordName, setEngWordName] = useState("");
  const [turWordName, setTurWordName] = useState("");
  const [wordSample, setWordSample] = useState("");
  const [picture, setPicture] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Sadece İngilizce harf ve boşluk kabul eden fonksiyon
  const onlyEnglishLetters = value => value.replace(/[^a-zA-Z\s]/g, "");
  // Türkçe ve İngilizce harf ile boşluk kabul eden fonksiyon
  const onlyTurkishAndEnglishLetters = value => value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s]/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    const basicAuth = "Basic " + btoa(auth.username + ":" + auth.password);
    try {
      const res = await fetch(`${backendUrl}/api/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth
        },
        body: JSON.stringify({
          engWordName,
          turWordName,
          wordSample,
          picture,
          topic: topic ? { name: topic } : null
        })
      });
      if (res.ok) {
        setSuccess("Kelime başarıyla eklendi!");
        setEngWordName("");
        setTurWordName("");
        setWordSample("");
        setPicture("");
        setTopic("");
      } else {
        const errorText = await res.text();
        setError("Kelime eklenemedi: " + errorText);
      }
    } catch (err) {
      setError("Bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kelimeekle-container">
      <MenuButton />
      <div className="kelimeekle-card">
        <h2>Kelime Ekle</h2>
        <form onSubmit={handleSubmit}>
          <label>İngilizce Kelime</label>
          <input type="text" value={engWordName} onChange={e => setEngWordName(onlyEnglishLetters(e.target.value))} required />
          <label>Türkçe Karşılığı</label>
          <input type="text" value={turWordName} onChange={e => setTurWordName(onlyTurkishAndEnglishLetters(e.target.value))} required />
          <label>Örnek Cümle</label>
          <input type="text" value={wordSample} onChange={e => setWordSample(onlyEnglishLetters(e.target.value))} />
          <label>Resim (URL)</label>
          <input type="text" value={picture} onChange={e => setPicture(e.target.value)} />
          <label>Konu</label>
          <input type="text" value={topic} onChange={e => setTopic(onlyEnglishLetters(e.target.value))} placeholder="Konu (isteğe bağlı)" />
          <button type="submit" disabled={loading}>{loading ? "Ekleniyor..." : "Ekle"}</button>
        </form>
        {success && <div className="kelimeekle-success">{success}</div>}
        {error && <div className="kelimeekle-error">{error}</div>}
      </div>
    </div>
  );
} 