package com.service._tolearn.repostories;

import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import com.service._tolearn.entities.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findByUser(User user);
    List<Word> findByUserAndCreatedAtAfter(User user, java.time.LocalDateTime after);
    List<Word> findByUserAndTopic(User user, Topic topic);
}
