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

    // Kullanıcının konu bazlı başarı analizini döner
    public Map<String, Double> getTopicSuccessReport(User user) {
        List<QuizHistory> histories = quizHistoryRepository.findByUser(user);
        Map<String, List<QuizHistory>> topicHistories = new HashMap<>();
        
        // Önce konulara göre quiz geçmişlerini grupla
        for (QuizHistory h : histories) {
            Word word = h.getWord();
            if (word.getTopic() == null) continue;
            String topicName = word.getTopic().getName();
            topicHistories.computeIfAbsent(topicName, k -> new ArrayList<>()).add(h);
        }
        
        Map<String, Double> result = new HashMap<>();
        for (var entry : topicHistories.entrySet()) {
            String topicName = entry.getKey();
            List<QuizHistory> topicHistory = entry.getValue();
            
            // Her kelime için maksimum 6 doğru bilme var
            int totalPossibleCorrect = topicHistory.size() * 6;
            int totalActualCorrect = 0;
            
            for (QuizHistory h : topicHistory) {
                totalActualCorrect += h.getCorrectCount();
            }
            
            // Başarı oranını hesapla (0-100 arası)
            double successRate = totalPossibleCorrect > 0 
                ? (totalActualCorrect * 100.0 / totalPossibleCorrect) 
                : 0.0;
            
            result.put(topicName, successRate);
        }
        
        return result;
    } 
} 