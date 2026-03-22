package com.voyage.travelbackend.repository;

import com.voyage.travelbackend.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItineraryRepository extends JpaRepository<Itinerary, String> {
    List<Itinerary> findByUidOrderByCreatedAtDesc(String uid);
}
