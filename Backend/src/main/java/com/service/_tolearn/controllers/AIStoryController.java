package com.service._tolearn.controllers;

import com.service._tolearn.entities.AIStory;
import com.service._tolearn.entities.User;
import com.service._tolearn.services.AIStoryService;
import com.service._tolearn.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ai-stories")
public class AIStoryController {

    @Autowired
    private AIStoryService aiStoryService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<AIStory> saveStory(@RequestBody AIStory story, Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        story.setUser(user);
        return ResponseEntity.ok(aiStoryService.saveStory(story));
    }

    @GetMapping
    public ResponseEntity<List<AIStory>> getUserStories(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(aiStoryService.getStoriesByUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AIStory> getStoryById(@PathVariable Long id) {
        AIStory story = aiStoryService.getStoryById(id);
        if (story != null) {
            return ResponseEntity.ok(story);
        }
        return ResponseEntity.notFound().build();
    }
} 