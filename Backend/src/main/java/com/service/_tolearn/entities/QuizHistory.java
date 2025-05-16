package com.service._tolearn.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "quiz_history")
@Getter
@Setter
public class QuizHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Word word;

    private int correctCount;
    private LocalDate lastCorrectDate;

    public void setUser(User user) { this.user = user; }
    public User getUser() { return user; }
    public void setWord(Word word) { this.word = word; }
    public Word getWord() { return word; }
    public void setCorrectCount(int correctCount) { this.correctCount = correctCount; }
    public int getCorrectCount() { return correctCount; }
    public void setLastCorrectDate(LocalDate lastCorrectDate) { this.lastCorrectDate = lastCorrectDate; }
    public LocalDate getLastCorrectDate() { return lastCorrectDate; }
    public void setId(Long id) { this.id = id; }
    public Long getId() { return id; }
}
