package com.example.CourseRegistration.repository;

import com.example.CourseRegistration.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByCourseName(String courseName);
}
