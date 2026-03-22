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


    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        System.out.println("Signup request for: " + user.getEmail() + " with role: " + user.getRole());

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email already exists in database"));
        }

        try {
            // If user is signing up as ADMIN, they need approval
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                user.setApproved(false);
            } else {
                user.setApproved(true);
            }
            
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with UID: " + savedUser.getUid());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Database error: " + e.getMessage()));
        }
    }


    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            if (!user.get().isApproved()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Your account is pending approval by a super admin."));
            }
            return ResponseEntity.ok(user.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
    }


    // Request OTP
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


    // Verify OTP
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
