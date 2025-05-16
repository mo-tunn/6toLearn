package com.service._tolearn.services;

import com.service._tolearn.entities.User;
import com.service._tolearn.repostories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String usernameOrEmail, String password) {
        Optional<User> userOptional = userRepository.findByUsername(usernameOrEmail);
        if (userOptional.isEmpty()) { // If not found by username, try by email
            userOptional = userRepository.findByEmail(usernameOrEmail);
        }

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }
        return getUserByUsername(authentication.getName());
    }

    public void updateEmail(String username, String newEmail) {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }

        // Email formatını kontrol et
        if (!newEmail.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Geçersiz e-posta formatı");
        }

        // Email benzersiz mi kontrol et
        if (userRepository.findByEmail(newEmail).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanılıyor");
        }

        user.setEmail(newEmail);
        user.setEmailVerified(false); // Email değiştiğinde doğrulama durumunu sıfırla
        userRepository.save(user);
    }

    public void sendVerificationEmail(String username) {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }

        // 6 haneli rastgele kod oluştur
        String verificationCode = String.format("%06d", (int)(Math.random() * 1000000));
        
        // Kodun geçerlilik süresini ayarla (24 saat)
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        user.setEmailVerificationCode(verificationCode);
        user.setEmailVerificationCodeExpiry(expiryTime);
        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (Exception e) {
            throw new RuntimeException("E-posta gönderilemedi: " + e.getMessage());
        }
    }

    public void verifyEmail(String username, String code) {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }

        if (user.getEmailVerificationCode() == null || user.getEmailVerificationCodeExpiry() == null) {
            throw new RuntimeException("Doğrulama kodu bulunamadı");
        }

        if (System.currentTimeMillis() > user.getEmailVerificationCodeExpiry()) {
            throw new RuntimeException("Doğrulama kodunun süresi dolmuş");
        }

        if (!user.getEmailVerificationCode().equals(code)) {
            throw new RuntimeException("Geçersiz doğrulama kodu");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationCode(null);
        user.setEmailVerificationCodeExpiry(null);
        userRepository.save(user);
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı"));

        // 6 haneli rastgele kod oluştur
        String resetCode = String.format("%06d", (int)(Math.random() * 1000000));
        
        // Kodun geçerlilik süresini ayarla (1 saat)
        long expiryTime = System.currentTimeMillis() + (60 * 60 * 1000);

        user.setEmailVerificationCode(resetCode);
        user.setEmailVerificationCodeExpiry(expiryTime);
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
        } catch (Exception e) {
            throw new RuntimeException("E-posta gönderilemedi: " + e.getMessage());
        }
    }

    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı"));

        if (user.getEmailVerificationCode() == null || user.getEmailVerificationCodeExpiry() == null) {
            throw new RuntimeException("Şifre sıfırlama kodu bulunamadı");
        }

        if (System.currentTimeMillis() > user.getEmailVerificationCodeExpiry()) {
            throw new RuntimeException("Şifre sıfırlama kodunun süresi dolmuş");
        }

        if (!user.getEmailVerificationCode().equals(code)) {
            throw new RuntimeException("Geçersiz şifre sıfırlama kodu");
        }

        // Yeni şifreyi hashle ve kaydet
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        user.setEmailVerificationCode(null);
        user.setEmailVerificationCodeExpiry(null);
        userRepository.save(user);
    }

    public void updatePassword(String username, String currentPassword, String newPassword) {
        User user = getUserByUsername(username);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Mevcut şifre yanlış");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
