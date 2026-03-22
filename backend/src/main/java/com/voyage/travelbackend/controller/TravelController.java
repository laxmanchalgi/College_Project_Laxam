package com.voyage.travelbackend.controller;

import com.voyage.travelbackend.model.*;
import com.voyage.travelbackend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TravelController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DestinationRepository destinationRepository;


    // ---------------- REVIEWS ----------------

    @GetMapping("/reviews")
    public List<Review> getReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/reviews")
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }


    // ---------------- ITINERARIES ----------------

    @GetMapping("/itineraries")
    public List<Itinerary> getAllItineraries() {
        return itineraryRepository.findAll();
    }

    @GetMapping("/itineraries/{uid}")
    public List<Itinerary> getItineraries(@PathVariable String uid) {
        return itineraryRepository.findByUidOrderByCreatedAtDesc(uid);
    }

    @PostMapping("/itineraries")
    public ResponseEntity<Itinerary> saveItinerary(@RequestBody Itinerary itinerary) {
        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItinerary);
    }

    @DeleteMapping("/itineraries/{id}")
    public ResponseEntity<?> deleteItinerary(@PathVariable String id) {
        itineraryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Itinerary deleted"));
    }


    // ---------------- BOOKINGS ----------------

    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/bookings/user/{uid}")
    public List<Booking> getUserBookings(@PathVariable String uid) {
        return bookingRepository.findByUid(uid);
    }

    // ✅ FIXED UPDATE BOOKING (handles null safely)
    @PutMapping("/bookings/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody Booking bookingData) {
        Optional<Booking> booking = bookingRepository.findById(id);

        if (booking.isPresent()) {
            Booking b = booking.get();

            if (bookingData.getDestination() != null)
                b.setDestination(bookingData.getDestination());

            if (bookingData.getTravelers() != 0)
                b.setTravelers(bookingData.getTravelers());

            if (bookingData.getStartDate() != null)
                b.setStartDate(bookingData.getStartDate());

            if (bookingData.getEndDate() != null)
                b.setEndDate(bookingData.getEndDate());

            if (bookingData.getPrice() != null)
                b.setPrice(bookingData.getPrice());

            if (bookingData.getStatus() != null)
                b.setStatus(bookingData.getStatus());

            bookingRepository.save(b);
            return ResponseEntity.ok(b);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Booking not found"));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        bookingRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Booking deleted"));
    }


    // ---------------- DESTINATIONS ----------------

    @GetMapping("/destinations")
    public List<Destination> getDestinations() {
        List<Destination> list = destinationRepository.findAll();

        if (list.isEmpty()) {
            Destination d1 = new Destination();
            d1.setName("Amalfi Coast");
            d1.setCountry("Italy");
            d1.setPrice(1200.0);
            d1.setRating(4.9);
            d1.setCategory("Coastal");
            d1.setImage("https://picsum.photos/seed/amalfi/800/600");
            destinationRepository.save(d1);

            Destination d2 = new Destination();
            d2.setName("Kyoto");
            d2.setCountry("Japan");
            d2.setPrice(1500.0);
            d2.setRating(4.8);
            d2.setCategory("Cultural");
            d2.setImage("https://picsum.photos/seed/kyoto/800/600");
            destinationRepository.save(d2);

            return destinationRepository.findAll();
        }

        return list;
    }

    @PostMapping("/destinations")
    public ResponseEntity<Destination> addDestination(@RequestBody Destination destination) {
        Destination saved = destinationRepository.save(destination);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ FIXED UPDATE DESTINATION (safe update)
    @PutMapping("/destinations/{id}")
    public ResponseEntity<?> updateDestination(@PathVariable String id, @RequestBody Destination data) {
        Optional<Destination> dest = destinationRepository.findById(id);

        if (dest.isPresent()) {
            Destination d = dest.get();

            if (data.getName() != null)
                d.setName(data.getName());

            if (data.getCountry() != null)
                d.setCountry(data.getCountry());

            if (data.getPrice() != null)
                d.setPrice(data.getPrice());

            if (data.getImage() != null)
                d.setImage(data.getImage());

            if (data.getDescription() != null)
                d.setDescription(data.getDescription());

            if (data.getRating() != null)
                d.setRating(data.getRating());

            destinationRepository.save(d);
            return ResponseEntity.ok(d);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Destination not found"));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable String id) {
        destinationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Destination deleted"));
    }
}