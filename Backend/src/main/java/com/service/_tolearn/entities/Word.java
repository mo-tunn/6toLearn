package com.service._tolearn.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "words")
@Getter
@Setter
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String engWordName;
    private String turWordName;
    private String picture; // Dosya yolu veya base64

    private java.time.LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Topic topic;

    private String wordSample;

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = java.time.LocalDateTime.now();
        }
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public String getEngWordName() { return engWordName; }
    public void setEngWordName(String engWordName) { this.engWordName = engWordName; }
    public String getTurWordName() { return turWordName; }
    public void setTurWordName(String turWordName) { this.turWordName = turWordName; }
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    public String getWordSample() { return wordSample; }
    public void setWordSample(String wordSample) { this.wordSample = wordSample; }
}
