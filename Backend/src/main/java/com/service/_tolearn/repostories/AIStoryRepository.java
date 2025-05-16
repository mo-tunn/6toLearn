package com.service._tolearn.repostories;

import com.service._tolearn.entities.AIStory;
import com.service._tolearn.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AIStoryRepository extends JpaRepository<AIStory, Long> {
    List<AIStory> findByUser(User user);
    List<AIStory> findByUserOrderByCreatedAtDesc(User user);
} 