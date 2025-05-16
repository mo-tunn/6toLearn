package com.service._tolearn.services;

import com.service._tolearn.entities.AIStory;
import com.service._tolearn.entities.User;
import com.service._tolearn.repostories.AIStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AIStoryService {
    
    @Autowired
    private AIStoryRepository aiStoryRepository;

    public AIStory saveStory(AIStory story) {
        return aiStoryRepository.save(story);
    }

    public List<AIStory> getStoriesByUser(User user) {
        return aiStoryRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public AIStory getStoryById(Long id) {
        return aiStoryRepository.findById(id).orElse(null);
    }
} 