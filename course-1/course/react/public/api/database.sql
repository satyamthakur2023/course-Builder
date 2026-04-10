-- Create database
CREATE DATABASE IF NOT EXISTS risegen_courses;
USE risegen_courses;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'instructor') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    category VARCHAR(50),
    duration VARCHAR(20),
    instructor_id INT,
    image_url TEXT,
    rating DECIMAL(2,1) DEFAULT 5.0,
    enrolled_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    progress INT DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- Sessions table for better session management
CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'student@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Jane Smith', 'instructor@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'instructor');

-- Insert sample courses
INSERT INTO courses (title, description, price, level, category, duration, instructor_id, image_url, rating, enrolled_count) VALUES
('Full Stack Web Development', 'Master HTML, CSS, JS, React, Node.js and build dynamic web apps.', 99.00, 'Intermediate', 'development', '8h 30m', 2, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop', 4.8, 1250),
('Machine Learning Basics', 'Understand algorithms, train models, and deploy ML apps with Python.', 149.00, 'Advanced', 'ai', '10h', 2, 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=200&fit=crop', 4.9, 890),
('UI/UX Design for Beginners', 'Learn Figma, typography, wireframing, and design psychology.', 79.00, 'Beginner', 'design', '6h 45m', 2, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop', 4.6, 2100);