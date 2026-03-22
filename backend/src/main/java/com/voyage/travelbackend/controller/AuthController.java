package com.voyage.travelbackend.controller;

import com.voyage.travelbackend.model.User;
import com.voyage.travelbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Temporary OTP storage
    private Map<String, String> otpStore = new HashMap<>();


    // ---------------- SIGNUP ----------------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email already exists"));
        }

        try {
            // ✅ DEFAULT VALUES
            user.setSuperAdmin(false); // ⭐ IMPORTANT
            user.setRole(user.getRole() == null ? "USER" : user.getRole());

            // ✅ ADMIN needs approval
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                user.setApproved(false);
            } else {
                user.setApproved(true);
            }

            User savedUser = userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Database error: " + e.getMessage()));
        }
    }


    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {

            // ❌ BLOCK if not approved
            if (!user.get().isApproved()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Your account is pending approval by super admin"));
            }

            // ✅ RETURN FULL USER (includes superAdmin)
            return ResponseEntity.ok(user.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
    }


    // ---------------- OTP REQUEST ----------------
    @PostMapping("/otp/request")
    public ResponseEntity<?> requestOTP(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        otpStore.put(email, otp);

        System.out.println("OTP for " + email + " is: " + otp);

        return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully",
                "otp", otp
        ));
    }


    // ---------------- OTP VERIFY ----------------
    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        String storedOtp = otpStore.get(email);

        if (storedOtp != null && storedOtp.equals(otp)) {

            Optional<User> user = userRepository.findByEmail(email);

            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Invalid OTP"));
    }
}