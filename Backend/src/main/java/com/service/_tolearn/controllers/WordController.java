package com.service._tolearn.controllers;

import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import com.service._tolearn.entities.Topic;
import com.service._tolearn.services.UserService;
import com.service._tolearn.services.WordService;
import com.service._tolearn.repostories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/words")
public class WordController {
    @Autowired
    private WordService wordService;
    @Autowired
    private UserService userService;
    @Autowired
    private TopicRepository topicRepository;

    // Kullanıcı kendi kelimesini ekler
    @PostMapping
    public ResponseEntity<Word> addWord(@RequestBody Word word, Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        word.setUser(user);

        // Eğer topic adı geldiyse, var mı bak yoksa oluştur
        if (word.getTopic() != null && word.getTopic().getName() != null) {
            String topicName = word.getTopic().getName();
            Topic topic = topicRepository.findByName(topicName)
                    .orElseGet(() -> {
                        Topic newTopic = new Topic();
                        newTopic.setName(topicName);
                        return topicRepository.save(newTopic);
                    });
            word.setTopic(topic);
        }

        return ResponseEntity.ok(wordService.addWord(word));
    }

    // Kullanıcı kendi kelimelerini listeler
    @GetMapping
    public ResponseEntity<List<Word>> getWordsByUser(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(wordService.getWordsByUser(user));
    }

    // Kullanıcının kelimelerini ve özelliklerini detaylı olarak listeler
    @GetMapping("/details")
    public ResponseEntity<List<Map<String, Object>>> getWordsWithDetails(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(wordService.getWordsWithDetails(user));
    }

    // Belirli bir kelimenin tüm özelliklerini getirir
    @GetMapping("/{wordId}/details")
    public ResponseEntity<Map<String, Object>> getWordDetails(@PathVariable Long wordId, Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(wordService.getWordDetails(wordId, user));
    }

    // Kullanıcının kelimelerini konularına göre gruplandırarak listeler
    @GetMapping("/grouped-by-topic")
    public ResponseEntity<Map<String, List<Word>>> getWordsGroupedByTopic(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(wordService.getWordsGroupedByTopic(user));
    }

    @GetMapping("/correct-counts")
    public ResponseEntity<List<Map<String, Object>>> getWordsWithCorrectCounts(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(wordService.getWordsWithCorrectCounts(user));
    }

    @DeleteMapping("/{wordId}")
    public ResponseEntity<?> deleteWord(@PathVariable Long wordId, Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        wordService.deleteWord(wordId, user);
        return ResponseEntity.ok().build();
    }
}
