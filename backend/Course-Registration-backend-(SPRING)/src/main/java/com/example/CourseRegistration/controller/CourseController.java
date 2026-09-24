package com.example.CourseRegistration.controller;

import com.example.CourseRegistration.model.Course;
import com.example.CourseRegistration.model.CourseRegistry;
import com.example.CourseRegistration.repository.CourseRegistryRepository;
import com.example.CourseRegistration.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CourseController {

    private final CourseRepository courseRepository;
    private final CourseRegistryRepository courseRegistryRepository;

    // Register a student for a course
    @PostMapping("/register")
    public String registerCourse(
            @RequestParam String name,
            @RequestParam String emailId,
            @RequestParam String courseName
    ) {
        Course course = courseRepository.findByCourseName(courseName);

        if (course == null) {
            return "Course not found.";
        }

        CourseRegistry registry = CourseRegistry.builder()
                .name(name)
                .emailId(emailId)
                .courseName(courseName)
                .build();

        courseRegistryRepository.save(registry);

        return "Successfully registered.";
    }

    // Get all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get all registered students
    @GetMapping("/enrolled")
    public List<CourseRegistry> getAllEnrolled() {
        return courseRegistryRepository.findAll();
    }

    // Delete a registration
    @DeleteMapping("/enrolled/{id}")
    public String deleteRegistration(@PathVariable Long id) {

        if (!courseRegistryRepository.existsById(id)) {
            return "Registration not found.";
        }

        courseRegistryRepository.deleteById(id);

        return "Registration deleted successfully.";
    }
}