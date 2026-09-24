import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Admin from "./Admin";

function App() {
  const [active, setActive] = useState("Home");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdmin, setShowAdmin] = useState(false);

  // Registration form states
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [courseName, setCourseName] = useState("");

  // Custom dropdown state
  const [courseOpen, setCourseOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // FETCH COURSES
  // =========================================================

  useEffect(() => {
    axios
      .get("http://localhost:8080/courses")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  // =========================================================
  // SCROLL NAVIGATION
  // =========================================================

  const scrollTo = (section) => {
    setActive(section);

    document
      .getElementById(section.toLowerCase())
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  // =========================================================
  // REGISTER STUDENT
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !emailId || !courseName) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:8080/courses/register",
        null,
        {
          params: {
            name: name,
            emailId: emailId,
            courseName: courseName,
          },
        }
      );

      setMessage(response.data);

      // Clear form
      setName("");
      setEmailId("");
      setCourseName("");

      // Close dropdown
      setCourseOpen(false);

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage("Registration failed. Please try again.");
      }

    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // ADMIN PAGE
  // =========================================================

  if (showAdmin) {
    return (
      <Admin
        onBack={() => {
          setShowAdmin(false);
          setActive("Home");
        }}
      />
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        <div className="logo">
          <span>LEARN</span>
          <b>IX</b>
        </div>

        <div className="nav-links">

          {/* HOME */}

          <button
            className={active === "Home" ? "active" : ""}
            onClick={() => scrollTo("Home")}
          >
            Home
          </button>

          {/* COURSES */}

          <button
            className={active === "Courses" ? "active" : ""}
            onClick={() => scrollTo("Courses")}
          >
            Courses
          </button>

          {/* ADMIN */}

          <button
            className={active === "Admin" ? "active" : ""}
            onClick={() => {
              setShowAdmin(true);
              setActive("Admin");
            }}
          >
            Admin
          </button>

        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero" id="home">

        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <div className="hero-content">

          <div className="eyebrow">
            LEARN <span>•</span> BUILD <span>•</span> GROW
          </div>

          <h1>
            Build Your Future
            <br />
            <span>With The Right</span>
            <br />
            Skills.
          </h1>

          <p>
            Choose from our professional courses and start your
            journey toward becoming a skilled developer.
          </p>

          <button
            className="register-btn"
            onClick={() => scrollTo("Register")}
          >
            Register Now <span>→</span>
          </button>

        </div>


        {/* =================================================
            LX CARD
        ================================================= */}

        <div className="hero-card">

          <div className="lx-logo">

            <span>L</span>

            <b>X</b>

            <div className="orbit"></div>

          </div>

          <h2>Learnix</h2>

          <p>Learn. Build. Grow.</p>

          <div className="stats">

            <div>
              <strong>8+</strong>
              <small>Courses</small>
            </div>

            <div>
              <strong>100+</strong>
              <small>Students</small>
            </div>

            <div>
              <strong>24/7</strong>
              <small>Learning</small>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          COURSES
      ===================================================== */}

      <section
        className="courses-section"
        id="courses"
      >

        <div className="section-heading">

          <span>EXPLORE</span>

          <h2>Popular Courses</h2>

          <p>
            Choose a course that matches your career goals.
          </p>

        </div>


        <div className="course-grid">

          {loading ? (

            <p>Loading courses...</p>

          ) : courses.length === 0 ? (

            <p>No courses available.</p>

          ) : (

            courses.map((course, index) => (

              <div
                className="course-card"
                key={course.id}
              >

                <div className="course-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="course-icon">
                  {
                    [
                      "☕",
                      "🐍",
                      "🌱",
                      "💙",
                      "⚛️",
                      "🟢",
                      "🤖",
                      "🧠",
                    ][index]
                  }
                </div>

                <h3>
                  {course.courseName}
                </h3>

                <p>
                  {course.description}
                </p>

              </div>

            ))

          )}

        </div>

      </section>


      {/* =====================================================
          REGISTER SECTION
      ===================================================== */}

      <section
        className="register-section"
        id="register"
      >

        <div className="register-box">

          <span>
            START YOUR JOURNEY
          </span>

          <h2>
            Ready to <strong>Level Up?</strong>
          </h2>

          <p>
            Pick your course and start building the skills
            that shape your future.
          </p>


          {/* =================================================
              REGISTRATION FORM
          ================================================= */}

          <form
            className="registration-form"
            onSubmit={handleRegister}
          >

            {/* NAME */}

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />


            {/* EMAIL */}

            <input
              type="email"
              placeholder="Enter your email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />


            {/* =================================================
                CUSTOM COURSE DROPDOWN
            ================================================= */}

            <div className="custom-course-dropdown">

              {/* DROPDOWN BUTTON */}

              <button
                type="button"
                className={`course-select ${
                  courseOpen ? "open" : ""
                }`}
                onClick={() =>
                  setCourseOpen(!courseOpen)
                }
              >

                <span>
                  {courseName || "Select a course"}
                </span>


                {/* CUSTOM CHEVRON */}

                <span
                  className={`course-arrow ${
                    courseOpen ? "open" : ""
                  }`}
                >
                  <span></span>
                </span>

              </button>


              {/* =================================================
                  COURSE OPTIONS
              ================================================= */}

              {courseOpen && (

                <div className="course-options">

                  {courses.map((course, index) => (

                    <button
                      type="button"
                      key={course.id}
                      className={`course-option ${
                        courseName === course.courseName
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {

                        setCourseName(
                          course.courseName
                        );

                        setCourseOpen(false);

                        setMessage("");

                      }}
                    >

                      {/* COURSE NUMBER */}

                      <span className="option-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>


                      {/* COURSE NAME */}

                      <span>
                        {course.courseName}
                      </span>


                      {/* SELECTED CHECK */}

                      {courseName === course.courseName && (

                        <span className="option-check">
                          ✓
                        </span>

                      )}

                    </button>

                  ))}

                </div>

              )}

            </div>


            {/* =================================================
                REGISTER BUTTON
            ================================================= */}

            <button
              type="submit"
              className="register-btn"
              disabled={submitting}
            >

              {submitting
                ? "Registering..."
                : "Register Now →"}

            </button>

          </form>


          {/* =================================================
              REGISTRATION MESSAGE
          ================================================= */}

          {message && (

            <p className="registration-message">
              {message}
            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <div className="footer-brand">

            <div className="logo">
              <span>LEARN</span>
              <b>IX</b>
            </div>

            <p>
              Learnix helps you build practical skills,
              grow your knowledge and prepare for your future.
            </p>

          </div>

          <div className="footer-right">

            <p>
              Learn. Build. Grow.
            </p>

            <span>
              © 2026 Learnix. All rights reserved.
            </span>

          </div>

      </footer>

    </div>
  );
}

export default App;