package com.voyage.travelbackend.controller;

import com.voyage.travelbackend.model.Booking;
import com.voyage.travelbackend.model.User;
import com.voyage.travelbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    // Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update user role or info
    @PutMapping("/users/{uid}")
    public ResponseEntity<?> updateUser(@PathVariable String uid, @RequestBody User userData) {
        Optional<User> user = userRepository.findById(uid);
        if (user.isPresent()) {
            User u = user.get();
            u.setDisplayName(userData.getDisplayName());
            u.setEmail(userData.getEmail());
            u.setRole(userData.getRole());
            userRepository.save(u);
            return ResponseEntity.ok(u);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete user
    @DeleteMapping("/users/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable String uid) {
        userRepository.deleteById(uid);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // Approve user
  @PutMapping("/users/{uid}/approve")
public ResponseEntity<?> approveUser(
        @PathVariable String uid,
        @RequestParam String adminEmail) {

    Optional<User> adminUser = userRepository.findByEmail(adminEmail);

    // ✅ check super admin
    if (adminUser.isEmpty() || !adminUser.get().isSuperAdmin()) {
        return ResponseEntity.status(403)
                .body(Map.of("error", "Only Super Admin can approve users"));
    }

    Optional<User> user = userRepository.findById(uid);

    if (user.isPresent()) {
        User u = user.get();
        u.setApproved(true);
        userRepository.save(u);
        return ResponseEntity.ok(u);
    }

    return ResponseEntity.notFound().build();
}

    // Admin Stats
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
            "totalBookings", bookingRepository.count(),
            "totalUsers", userRepository.count(),
            "totalReviews", reviewRepository.count(),
            "totalItineraries", itineraryRepository.count()
        );
    }

    @PutMapping("/bookings/{id}")
public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody Booking bookingData) {
    Optional<Booking> booking = bookingRepository.findById(id);

    if (booking.isPresent()) {
        Booking b = booking.get();
        b.setDestination(bookingData.getDestination());
        b.setTravelers(bookingData.getTravelers());
        b.setStatus(bookingData.getStatus());
        bookingRepository.save(b);
        return ResponseEntity.ok(b);
    }

    return ResponseEntity.notFound().build();
}
}
