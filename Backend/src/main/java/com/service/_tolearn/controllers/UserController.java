package com.service._tolearn.controllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service._tolearn.entities.User;
import com.service._tolearn.services.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok(Map.of("message", "Kullanıcı başarıyla kaydedildi."));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        return userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword())
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(401).body("Kullanıcı adı veya şifre hatalı!"));
    }

    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestBody Map<String, String> request, Principal principal) {
        String newEmail = request.get("email");
        if (newEmail == null || newEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-posta adresi boş olamaz"));
        }
        
        try {
            userService.updateEmail(principal.getName(), newEmail);
            return ResponseEntity.ok(Map.of("message", "E-posta başarıyla güncellendi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/send-verification-email")
    public ResponseEntity<?> sendVerificationEmail(Principal principal) {
        try {
            userService.sendVerificationEmail(principal.getName());
            return ResponseEntity.ok(Map.of("message", "Doğrulama kodu e-posta adresinize gönderildi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request, Principal principal) {
        String code = request.get("code");
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Doğrulama kodu boş olamaz"));
        }

        try {
            userService.verifyEmail(principal.getName(), code);
            return ResponseEntity.ok(Map.of("message", "E-posta başarıyla doğrulandı"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-posta adresi boş olamaz"));
        }

        try {
            userService.sendPasswordResetEmail(email);
            return ResponseEntity.ok(Map.of("message", "Şifre sıfırlama kodu e-posta adresinize gönderildi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-posta adresi boş olamaz"));
        }
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Doğrulama kodu boş olamaz"));
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Yeni şifre boş olamaz"));
        }

        try {
            userService.resetPassword(email, code, newPassword);
            return ResponseEntity.ok(Map.of("message", "Şifreniz başarıyla güncellendi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request, Principal principal) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentPassword == null || currentPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mevcut şifre boş olamaz"));
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Yeni şifre boş olamaz"));
        }

        try {
            userService.updatePassword(principal.getName(), currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
