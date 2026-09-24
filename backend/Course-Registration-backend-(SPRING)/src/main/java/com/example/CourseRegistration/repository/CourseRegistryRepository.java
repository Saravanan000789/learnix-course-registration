package com.example.CourseRegistration.repository;

import com.example.CourseRegistration.model.CourseRegistry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRegistryRepository extends JpaRepository<CourseRegistry, Long> {
}
