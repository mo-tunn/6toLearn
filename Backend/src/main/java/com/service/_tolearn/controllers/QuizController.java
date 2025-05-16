package com.service._tolearn.controllers;

import com.service._tolearn.entities.QuizHistory;
import com.service._tolearn.entities.User;
import com.service._tolearn.entities.Word;
import com.service._tolearn.services.QuizService;
import com.service._tolearn.services.UserService;
import com.service._tolearn.services.QuizHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;
    @Autowired
    private UserService userService;
    @Autowired
    private QuizHistoryService quizHistoryService;

    // Word için DTO
    public static class WordDTO {
        private Long id;
        private String engWordName;
        private String turWordName;
        private String picture;
        private String wordSample;
        private String topicName;
        // getter/setter
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEngWordName() { return engWordName; }
        public void setEngWordName(String engWordName) { this.engWordName = engWordName; }
        public String getTurWordName() { return turWordName; }
        public void setTurWordName(String turWordName) { this.turWordName = turWordName; }
        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }
        public String getWordSample() { return wordSample; }
        public void setWordSample(String wordSample) { this.wordSample = wordSample; }
        public String getTopicName() { return topicName; }
        public void setTopicName(String topicName) { this.topicName = topicName; }
    }

    // Quiz başlat: Kullanıcıya sorulacak kelimeleri getir
    @GetMapping("/start")
    public ResponseEntity<List<WordDTO>> startQuiz(@RequestParam(defaultValue = "10") int count, Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        List<Word> quizWords = quizService.getQuizWords(user, count);
        List<WordDTO> dtos = quizWords.stream().map(word -> {
            WordDTO dto = new WordDTO();
            dto.setId(word.getId());
            dto.setEngWordName(word.getEngWordName());
            dto.setTurWordName(word.getTurWordName());
            dto.setPicture(word.getPicture());
            dto.setWordSample(word.getWordSample());
            dto.setTopicName(word.getTopic() != null ? word.getTopic().getName() : null);
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Quiz sonucu gönder: Hangi kelimeye doğru/yanlış cevap verildi
    @PostMapping("/answer")
    public ResponseEntity<Void> answerQuiz(@RequestBody Map<String, Object> payload, Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        Long wordId = Long.valueOf(payload.get("wordId").toString());
        boolean correct = Boolean.parseBoolean(payload.get("correct").toString());
        Word word = new Word(); word.setId(wordId); // Sadece id ile referans
        quizService.updateQuizResult(user, word, correct);
        return ResponseEntity.ok().build();
    }

    // Kullanıcının konu bazlı başarı analiz raporu
    @GetMapping("/topic-report")
    public ResponseEntity<Map<String, Double>> getTopicReport(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        Map<String, Double> report = quizService.getTopicSuccessReport(user);
        return ResponseEntity.ok(report);
    }

    // Kullanıcının konu bazlı başarı analiz raporunu PDF olarak döndür
    @GetMapping("/topic-report/pdf")
    public ResponseEntity<byte[]> getTopicReportPdf(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username);
        Map<String, Double> report = quizService.getTopicSuccessReport(user);
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            PDPageContentStream content = new PDPageContentStream(doc, page);
            content.setFont(PDType1Font.HELVETICA_BOLD, 18);
            content.beginText();
            content.newLineAtOffset(50, 770);
            content.showText("Konu Bazlı Başarı Raporu");
            content.endText();
            content.setFont(PDType1Font.HELVETICA, 12);
            int y = 740;
            for (Map.Entry<String, Double> entry : report.entrySet()) {
                content.beginText();
                content.newLineAtOffset(50, y);
                content.showText(entry.getKey() + ": %" + String.format("%.2f", entry.getValue()));
                content.endText();
                y -= 20;
            }
            content.close();
            byte[] pdfBytes;
            try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
                doc.save(baos);
                pdfBytes = baos.toByteArray();
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "konu-analiz-raporu.pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/histories")
    public ResponseEntity<List<QuizHistory>> getAllQuizHistories() {
        return ResponseEntity.ok(quizHistoryService.getAllQuizHistories());
    }
}
