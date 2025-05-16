package com.service._tolearn.services;

import com.service._tolearn.entities.QuizHistory;
import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import com.service._tolearn.repostories.QuizHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class QuizHistoryService {
    private static final Logger logger = LoggerFactory.getLogger(QuizHistoryService.class);
    
    @Autowired
    private QuizHistoryRepository quizHistoryRepository;

    public Optional<QuizHistory> getByUserAndWord(User user, Word word) {
        return quizHistoryRepository.findByUserAndWord(user, word);
    }

    public List<QuizHistory> getByUser(User user) {
        return quizHistoryRepository.findByUser(user);
    }

    public QuizHistory save(QuizHistory quizHistory) {
        return quizHistoryRepository.save(quizHistory);
    }

    public List<QuizHistory> getAllQuizHistories() {
        List<QuizHistory> histories = quizHistoryRepository.findAll();
        logger.info("Found {} quiz histories", histories.size());
        for (QuizHistory history : histories) {
            logger.info("QuizHistory - User: {}, Word: {}, CorrectCount: {}", 
                history.getUser().getUsername(), 
                history.getWord().getEngWordName(), 
                history.getCorrectCount());
        }
        return histories;
    }
}
