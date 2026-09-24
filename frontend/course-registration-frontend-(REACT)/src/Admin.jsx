import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Admin({ onBack }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Search + filter
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [filterOpen, setFilterOpen] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Notification
  const [notification, setNotification] = useState(null);

  const filterRef = useRef(null);

  /* =====================================================
     FETCH DATA
  ===================================================== */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [studentsResponse, coursesResponse] = await Promise.all([
        axios.get("http://localhost:8080/courses/enrolled"),
        axios.get("http://localhost:8080/courses"),
      ]);

      setStudents(studentsResponse.data);
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);

      showNotification(
        "error",
        "Unable to load data",
        "Please make sure the Spring Boot server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CLOSE FILTER WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     NOTIFICATION
  ===================================================== */

  const showNotification = (type, title, text) => {
    setNotification({
      type,
      title,
      text,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  /* =====================================================
     DELETE MODAL
  ===================================================== */

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deletingId !== null) return;

    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  /* =====================================================
     DELETE REGISTRATION
  ===================================================== */

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      setDeletingId(studentToDelete.id);

      await axios.delete(
        `http://localhost:8080/courses/enrolled/${studentToDelete.id}`
      );

      // Remove from frontend immediately
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student.id !== studentToDelete.id
        )
      );

      setShowDeleteModal(false);

      showNotification(
        "success",
        "Registration removed",
        `${studentToDelete.name} has been removed from ${studentToDelete.courseName}.`
      );

      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting registration:", error);

      setShowDeleteModal(false);

      showNotification(
        "error",
        "Deletion failed",
        "The registration could not be removed. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        student.name?.toLowerCase().includes(searchText) ||
        student.emailId?.toLowerCase().includes(searchText) ||
        student.courseName?.toLowerCase().includes(searchText);

      const matchesCourse =
        selectedCourse === "All Courses" ||
        student.courseName === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [students, search, selectedCourse]);

  /* =====================================================
     COURSE COUNT
  ===================================================== */

  const getCourseCount = (courseName) => {
    return students.filter(
      (student) => student.courseName === courseName
    ).length;
  };

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalStudents = students.length;

  const uniqueCourses = new Set(
    students.map((student) => student.courseName)
  ).size;

  const totalCourses = courses.length;

  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  const clearSearch = () => {
    setSearch("");
  };

  /* =====================================================
     SELECT COURSE
  ===================================================== */

  const handleCourseSelect = (courseName) => {
    setSelectedCourse(courseName);
    setFilterOpen(false);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="admin-section">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-heading">

        <button
          className="back-home-btn"
          onClick={onBack}
        >
          ← Back to Learnix
        </button>

        <span>LEARNIX ADMIN</span>

        <h1>Registered Students</h1>

        <p>
          View and manage all students registered for Learnix courses.
        </p>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <strong>{totalStudents}</strong>
          <span>Registered Students</span>
        </div>

        <div className="admin-stat-card">
          <strong>{uniqueCourses}</strong>
          <span>Courses Selected</span>
        </div>

        <div className="admin-stat-card">
          <strong>{totalCourses}</strong>
          <span>Available Courses</span>
        </div>

      </div>


      {/* =================================================
          COURSE ANALYTICS
      ================================================= */}

      <div className="course-count-section">

        <div className="course-count-heading">
          <span>COURSE ANALYTICS</span>

          <h2>Course-wise Registrations</h2>
        </div>

        <div className="course-count-grid">

          {courses.map((course, index) => {
            const count = getCourseCount(course.courseName);

            return (
              <div
                className="course-count-card"
                key={course.id}
              >

                <div className="course-count-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="course-count-info">

                  <h3>{course.courseName}</h3>

                  <p>
                    {count}{" "}
                    {count === 1 ? "student" : "students"}
                  </p>

                </div>

                <strong>{count}</strong>

              </div>
            );
          })}

        </div>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="admin-controls">

        {/* SEARCH */}

        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by name, email or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
            >
              ×
            </button>
          )}

        </div>


        {/* CUSTOM FILTER */}

        <div
          className="filter-box"
          ref={filterRef}
        >

          <button
            type="button"
            className={`filter-trigger ${
              filterOpen ? "open" : ""
            }`}
            onClick={() => setFilterOpen(!filterOpen)}
          >

            <span>{selectedCourse}</span>

            <span
                  className={`filter-arrow ${
                    filterOpen ? "open" : ""
                  }`}   
                >
                  <span></span>
                </span>

          </button>


          {filterOpen && (
            <div className="custom-filter-menu">

              {/* ALL COURSES */}

              <button
                type="button"
                className={`filter-option ${
                  selectedCourse === "All Courses"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleCourseSelect("All Courses")
                }
              >

                <span className="filter-option-number">
                  ✦
                </span>

                <span>All Courses</span>

                {selectedCourse === "All Courses" && (
                  <span className="filter-check">
                    ✓
                  </span>
                )}

              </button>


              {/* COURSES */}

              {courses.map((course, index) => (

                <button
                  type="button"
                  key={course.id}
                  className={`filter-option ${
                    selectedCourse === course.courseName
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleCourseSelect(course.courseName)
                  }
                >

                  <span className="filter-option-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>
                    {course.courseName}
                  </span>

                  {selectedCourse === course.courseName && (
                    <span className="filter-check">
                      ✓
                    </span>
                  )}

                </button>

              ))}

            </div>
          )}

        </div>

      </div>


      {/* =================================================
          RESULTS INFO
      ================================================= */}

      {(search || selectedCourse !== "All Courses") && (
        <div className="results-info">

          <span>
            Showing{" "}
            <strong>{filteredStudents.length}</strong>{" "}
            {filteredStudents.length === 1
              ? "registration"
              : "registrations"}
          </span>

          {selectedCourse !== "All Courses" && (
            <span className="active-filter">
              {selectedCourse}
              <button
                type="button"
                onClick={() =>
                  setSelectedCourse("All Courses")
                }
              >
                ×
              </button>
            </span>
          )}

        </div>
      )}


      {/* =================================================
          STUDENTS TABLE
      ================================================= */}

      <div className="students-table-wrapper">

        {loading ? (

          <div className="admin-loading">
            <div className="loading-spinner"></div>
            Loading registrations...
          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="no-students">

            <div className="empty-icon">
              ⌕
            </div>

            <h3>
              No registrations found
            </h3>

            <p>
              Try changing your search or course filter.
            </p>

            {(search ||
              selectedCourse !== "All Courses") && (
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedCourse("All Courses");
                }}
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          <table className="students-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>COURSE</th>
                <th>ACTION</th>
              </tr>

            </thead>

            <tbody>

              {filteredStudents.map((student, index) => (

                <tr key={student.id}>

                  {/* DYNAMIC DISPLAY ID */}

                  <td className="student-id">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="student-name">
                    {student.name}
                  </td>

                  <td className="student-email">
                    {student.emailId}
                  </td>

                  <td className="student-course">
                    {student.courseName}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        openDeleteModal(student)
                      }
                      disabled={
                        deletingId === student.id
                      }
                    >
                      {deletingId === student.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>


      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {showDeleteModal && studentToDelete && (

        <div
          className="modal-overlay"
          onClick={closeDeleteModal}
        >

          <div
            className="delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-icon">
              !
            </div>

            <h2>
              Remove Registration?
            </h2>

            <p>
              Are you sure you want to remove{" "}
              <strong>
                {studentToDelete.name}
              </strong>{" "}
              from{" "}
              <strong>
                {studentToDelete.courseName}
              </strong>
              ?
            </p>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={closeDeleteModal}
                disabled={deletingId !== null}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deletingId !== null}
              >
                {deletingId !== null
                  ? "Removing..."
                  : "Yes, Remove"}
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          SUCCESS / ERROR NOTIFICATION
      ================================================= */}

      {notification && (

        <div
          className={`success-popup ${
            notification.type === "error"
              ? "error-popup"
              : ""
          }`}
        >

          <div className="success-icon">
            {notification.type === "error"
              ? "!"
              : "✓"}
          </div>

          <div className="notification-content">

            <strong>
              {notification.title}
            </strong>

            <p>
              {notification.text}
            </p>

          </div>

          <button
            className="notification-close"
            onClick={() =>
              setNotification(null)
            }
          >
            ×
          </button>

        </div>

      )}

    </section>
  );
}

export default Admin;