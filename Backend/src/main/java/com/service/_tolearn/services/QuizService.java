package com.service._tolearn.services;

import com.service._tolearn.entities.QuizHistory;
import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import com.service._tolearn.repostories.QuizHistoryRepository;
import com.service._tolearn.repostories.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {
    @Autowired
    private QuizHistoryRepository quizHistoryRepository;
    @Autowired
    private WordRepository wordRepository;

    // Quiz için uygun kelimeleri getir (algoritmanın temelini kur)
    public List<Word> getQuizWords(User user, int count) {
        java.time.LocalDateTime todayStart = java.time.LocalDate.now().atStartOfDay();
        List<Word> todaysWords = wordRepository.findByUserAndCreatedAtAfter(user, todayStart);
        List<QuizHistory> histories = quizHistoryRepository.findByUser(user);
        Map<Long, QuizHistory> historyMap = histories.stream()
                .collect(Collectors.toMap(h -> h.getWord().getId(), h -> h));

        List<Word> eligible = new ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        for (Word word : todaysWords) {
            QuizHistory h = historyMap.get(word.getId());
            // Eğer kelime hiç sorulmamışsa veya yanlış bilindiyse gün içinde tekrar tekrar sor
            if (h == null || h.getCorrectCount() == 0) {
                eligible.add(word);
                continue;
            }
            // Eğer kelime doğru bilindiyse ve aralığı geldiyse sor
            if (shouldAskAgain(h, today)) {
                eligible.add(word);
            }
        }
        // Ayrıca, gün içinde eklenmemiş ama aralığı gelen kelimeleri de ekle
        List<Word> allWords = wordRepository.findByUser(user);
        for (Word word : allWords) {
            if (todaysWords.contains(word)) continue; // Zaten eklendi
            QuizHistory h = historyMap.get(word.getId());
            if (h == null || h.getCorrectCount() == 0) {
                eligible.add(word);
                continue;
            }
            if (shouldAskAgain(h, today)) {
                eligible.add(word);
            }
        }
        Collections.shuffle(eligible);
        return eligible.stream().limit(count).collect(Collectors.toList());
    }

    // 6 sefer doğru bilme algoritması için tekrar sorulup sorulmayacağını belirle
    private boolean shouldAskAgain(QuizHistory h, LocalDate today) {
        if (h.getCorrectCount() >= 6) {
            return false; // 6 kez doğru bilindiyse asla sorulmasın
        }
        if (h.getCorrectCount() == 0 || h.getLastCorrectDate() == null) {
            return true; // Hiç doğru bilinmediyse veya hiç sorulmadıysa sorulsun
        }
        int[] days = {1, 7, 30, 90, 180, 365};
        int idx = Math.max(0, h.getCorrectCount() - 1);
        LocalDate nextDate = h.getLastCorrectDate().plusDays(days[idx]);
        return today.isAfter(nextDate); // today > nextDate ise sorulsun (eşit değil)
    }

    // Quiz sonucu güncelle
    public void updateQuizResult(User user, Word word, boolean correct) {
        Optional<QuizHistory> opt = quizHistoryRepository.findByUserAndWord(user, word);
        QuizHistory h = opt.orElseGet(() -> {
            QuizHistory nh = new QuizHistory();
            nh.setUser(user);
            nh.setWord(word);
            nh.setCorrectCount(0);
            nh.setLastCorrectDate(null);
            return nh;
        });
        java.time.LocalDate today = java.time.LocalDate.now();
        if (correct) {
            // Eğer bugün ilk kez doğru biliniyorsa, doğru sayısını artır ve bugünü kaydet
            if (h.getLastCorrectDate() == null || !h.getLastCorrectDate().isEqual(today)) {
                h.setCorrectCount(h.getCorrectCount() + 1);
                h.setLastCorrectDate(today);
            }
            // Aynı gün içinde tekrar doğru bilinirse, tekrar artırma
        } else {
            // Yanlış bilinirse, doğru sayısını sıfırla ve tekrar tekrar sorulmasını sağla
            h.setCorrectCount(0);
            h.setLastCorrectDate(null);
        }
        quizHistoryRepository.save(h);
    }

    // Kullanıcının konu bazlı başarı analizini döner
    public Map<String, Double> getTopicSuccessReport(User user) {
        List<QuizHistory> histories = quizHistoryRepository.findByUser(user);
        Map<String, int[]> topicStats = new HashMap<>(); // topicName -> [dogru, toplam]
        for (QuizHistory h : histories) {
            Word word = h.getWord();
            if (word.getTopic() == null) continue;
            String topicName = word.getTopic().getName();
            int[] stats = topicStats.getOrDefault(topicName, new int[2]);
            stats[1] += h.getCorrectCount() + (h.getCorrectCount() == 0 ? 1 : 0); // toplam deneme
            if (h.getCorrectCount() > 0) stats[0] += h.getCorrectCount(); // doğru sayısı
            topicStats.put(topicName, stats);
        }
        Map<String, Double> result = new HashMap<>();
        for (var entry : topicStats.entrySet()) {
            int dogru = entry.getValue()[0];
            int toplam = entry.getValue()[1];
            result.put(entry.getKey(), toplam > 0 ? (dogru * 100.0 / toplam) : 0.0);
        }
        return result;
    }
}
