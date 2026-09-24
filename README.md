# 🚀 Learnix - Course Registration System

A full-stack course registration and management system built using React, Spring Boot, and MySQL.

Learnix allows students to explore available courses and register for their preferred course. It also provides an admin dashboard to view, search, filter, and manage student registrations.

---

## ✨ Features

### 👨‍🎓 Student

- View available courses
- View course descriptions
- Select a course
- Register using name and email
- Dynamic course data from the backend
- Registration stored in MySQL

### 👨‍💼 Admin

- View all registered students
- View registration statistics
- Course-wise registration counts
- Search students by name, email, or course
- Filter registrations by course
- Delete registrations
- Custom delete confirmation popup
- Success and error notifications

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Java
- Spring Boot
- Spring Data JPA
- REST API
- Lombok

### Database

- MySQL

---

## 🏗️ Project Architecture

```text
React Frontend
      ↓
    Axios
      ↓
Spring Boot REST API
      ↓
Spring Data JPA
      ↓
     MySQL
