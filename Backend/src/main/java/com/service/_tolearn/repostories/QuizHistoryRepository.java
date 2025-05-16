package com.service._tolearn.repostories;

import com.service._tolearn.entities.QuizHistory;
import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizHistoryRepository extends JpaRepository<QuizHistory, Long> {
    Optional<QuizHistory> findByUserAndWord(User user, Word word);
    List<QuizHistory> findByUser(User user);
    List<QuizHistory> findByWord(Word word);
}
