import React, { useState } from 'react';
import '../styles/HelpButton.css';

const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="help-btn-fixed"
        onClick={() => setOpen(true)}
        onMouseEnter={e => e.currentTarget.classList.add('hovered')}
        onMouseLeave={e => e.currentTarget.classList.remove('hovered')}
      >
        ?
        <span className="help-tooltip">Nasıl Çalışır?</span>
      </button>
      {open && (
        <div className="help-modal-overlay" onClick={() => setOpen(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <h2>6toLearn Platformu Nedir?</h2>
            <p>
              6toLearn, İngilizce kelime öğrenimini oyunlaştıran, yapay zeka destekli ve kişiselleştirilmiş bir eğitim platformudur. Kendi kelimelerinizi ekleyebilir, quiz ve wordle gibi oyunlarla tekrar yapabilir, başarılarınızı analiz edebilir ve AI ile hikaye oluşturabilirsiniz. Tüm ilerlemeniz güvenli bir şekilde saklanır ve gelişiminiz görsel olarak sunulur.
            </p>
            <ul>
              <li><b>Kelimelerim:</b> Kendi kelime listenizi oluşturun ve takip edin.</li>
              <li><b>Quiz:</b> Öğrendiğiniz kelimeleri test edin. Quizde, 1 gün sonra, 1 hafta sonra, 1 ay sonra, 3 ay sonra, 6 ay sonra ve 1 yıl sonra bilinen kelimeler tekrar sorulur (aralıklı tekrar sistemi).</li>
              <li><b>Wordle:</b> 6 kez doğru bildiğiniz kelimelerle eğlenceli oyun oynayın.</li>
              <li><b>AI Learning:</b> Seçtiğiniz kelimelerle yapay zekadan hikaye ve görsel oluşturun.</li>
              <li><b>Analiz:</b> Başarı oranlarınızı ve gelişiminizi grafiklerle izleyin.</li>
            </ul>
            <button className="help-modal-close" onClick={() => setOpen(false)}>Kapat</button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton; 