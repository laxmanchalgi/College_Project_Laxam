package com.voyage.travelbackend.repository;

import com.voyage.travelbackend.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, String> {
}
