package com.service._tolearn.services;

import com.service._tolearn.entities.QuizHistory;
import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import com.service._tolearn.repostories.QuizHistoryRepository;
import com.service._tolearn.repostories.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WordService {
    private static final Logger logger = LoggerFactory.getLogger(WordService.class);
    
    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private QuizHistoryRepository quizHistoryRepository;

    public Word addWord(Word word) {
        return wordRepository.save(word);
    }

    public List<Word> getWordsByUser(User user) {
        return wordRepository.findByUser(user);
    }

    public List<Map<String, Object>> getWordsWithDetails(User user) {
        List<Word> words = wordRepository.findByUser(user);
        return words.stream().map(word -> {
            Map<String, Object> details = new HashMap<>();
            details.put("id", word.getId());
            details.put("engWordName", word.getEngWordName());
            details.put("turWordName", word.getTurWordName());
            details.put("picture", word.getPicture());
            details.put("wordSample", word.getWordSample());
            details.put("createdAt", word.getCreatedAt());
            details.put("topic", word.getTopic() != null ? word.getTopic().getName() : null);
            return details;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getWordDetails(Long wordId, User user) {
        Optional<Word> wordOptional = wordRepository.findById(wordId);
        if (wordOptional.isPresent()) {
            Word word = wordOptional.get();
            if (!word.getUser().getUserID().equals(user.getUserID())) {
                throw new RuntimeException("Bu kelime size ait değil");
            }
            Map<String, Object> details = new HashMap<>();
            details.put("id", word.getId());
            details.put("engWordName", word.getEngWordName());
            details.put("turWordName", word.getTurWordName());
            details.put("picture", word.getPicture());
            details.put("wordSample", word.getWordSample());
            details.put("createdAt", word.getCreatedAt());
            details.put("topic", word.getTopic() != null ? word.getTopic().getName() : null);
            return details;
        }
        throw new RuntimeException("Kelime bulunamadı");
    }

    public Map<String, List<Word>> getWordsGroupedByTopic(User user) {
        List<Word> words = wordRepository.findByUser(user);
        return words.stream()
                .collect(Collectors.groupingBy(
                        word -> word.getTopic() != null ? word.getTopic().getName() : "Konusuz",
                        Collectors.toList()
                ));
    }

    public List<Map<String, Object>> getWordsWithCorrectCounts(User user) {
        logger.info("Getting words with correct counts for user: {}", user.getUsername());
        List<Word> words = wordRepository.findByUser(user);
        logger.info("Found {} words for user", words.size());
        
        List<QuizHistory> histories = quizHistoryRepository.findByUser(user);
        logger.info("Found {} quiz histories for user", histories.size());
        
        Map<Long, QuizHistory> historyMap = histories.stream()
                .collect(Collectors.toMap(h -> h.getWord().getId(), h -> h));
        
        return words.stream().map(word -> {
            Map<String, Object> details = new HashMap<>();
            details.put("id", word.getId());
            details.put("engWordName", word.getEngWordName());
            details.put("turWordName", word.getTurWordName());
            
            QuizHistory history = historyMap.get(word.getId());
            int correctCount = history != null ? history.getCorrectCount() : 0;
            logger.info("Word: {} (ID: {}), Correct count: {}", 
                word.getEngWordName(), 
                word.getId(), 
                correctCount);
            
            details.put("correctCount", correctCount);
            return details;
        }).collect(Collectors.toList());
    }

    public void deleteWord(Long wordId, User user) {
        Optional<Word> wordOptional = wordRepository.findById(wordId);
        if (wordOptional.isPresent()) {
            Word word = wordOptional.get();
            if (!word.getUser().getUserID().equals(user.getUserID())) {
                throw new RuntimeException("Bu kelime size ait değil");
            }
            
            // Önce kelimeye ait quiz geçmişi kayıtlarını sil
            List<QuizHistory> quizHistories = quizHistoryRepository.findByWord(word);
            quizHistoryRepository.deleteAll(quizHistories);
            
            // Sonra kelimeyi sil
            wordRepository.delete(word);
        } else {
            throw new RuntimeException("Kelime bulunamadı");
        }
    }
}
