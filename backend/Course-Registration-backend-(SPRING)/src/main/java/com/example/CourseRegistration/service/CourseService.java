package com.example.CourseRegistration.service;

import com.example.CourseRegistration.model.Course;
import com.example.CourseRegistration.model.CourseRegistry;
import  com.example.CourseRegistration.repository.CourseRepository;
import com.example.CourseRegistration.repository.CourseRegistryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    CourseRepository  courseRepository;

    @Autowired
    CourseRegistryRepository courseRegistryRepository;

    public List<Course> availableCourses() {
        return courseRepository.findAll();
    }

    public List<CourseRegistry> enrolledStudents() {
        return courseRegistryRepository.findAll();
    }

    public void enrollCourse(String name, String emailId, String courseName) {

        Course course = courseRepository.findByCourseName(courseName);

        CourseRegistry courseRegistry = new CourseRegistry();

        courseRegistry.setName(name);
        courseRegistry.setEmailId(emailId);
        courseRegistry.setCourseName(courseName);

        courseRegistryRepository.save(courseRegistry);
    }
}
