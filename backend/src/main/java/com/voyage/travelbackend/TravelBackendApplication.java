package com.voyage.travelbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.voyage.travelbackend.model.User;
import com.voyage.travelbackend.repository.UserRepository;

@SpringBootApplication
public class TravelBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelBackendApplication.class, args);
	}

	@Bean
public CommandLineRunner seedData(UserRepository userRepository) {
    return args -> {
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {

            User admin = new User();
            admin.setEmail("admin@gmail.com"); // 
            admin.setPassword("admin@123");
            admin.setDisplayName("System Admin");
            admin.setRole("ADMIN");
            admin.setApproved(true);
            admin.setSuperAdmin(true); 
            userRepository.save(admin);

        
        }
    };
}

}
