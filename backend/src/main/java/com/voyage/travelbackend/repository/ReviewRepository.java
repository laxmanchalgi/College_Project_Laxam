package com.voyage.travelbackend.repository;

import com.voyage.travelbackend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findAllByOrderByCreatedAtDesc();
}
