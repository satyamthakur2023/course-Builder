<?php
require_once 'config.php';

header('Content-Type: application/json');

$courses = [
    [
        'id' => 1,
        'title' => 'Full Stack Web Development',
        'desc' => 'Master HTML, CSS, JS, React, Node.js and build dynamic web apps.',
        'level' => 'Intermediate',
        'rating' => '4.8',
        'time' => '8h 30m',
        'cat' => 'development',
        'instructor' => 'John Parker',
        'img' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
        'price' => 99,
        'enrolled' => 1250,
        'progress' => 65
    ],
    [
        'id' => 2,
        'title' => 'Machine Learning Basics',
        'desc' => 'Understand algorithms, train models, and deploy ML apps with Python.',
        'level' => 'Advanced',
        'rating' => '4.9',
        'time' => '10h',
        'cat' => 'ai',
        'instructor' => 'Dr. Aisha Khan',
        'img' => 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=200&fit=crop',
        'price' => 149,
        'enrolled' => 890,
        'progress' => 0
    ],
    [
        'id' => 3,
        'title' => 'UI/UX Design for Beginners',
        'desc' => 'Learn Figma, typography, wireframing, and design psychology.',
        'level' => 'Beginner',
        'rating' => '4.6',
        'time' => '6h 45m',
        'cat' => 'design',
        'instructor' => 'Elena Rose',
        'img' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
        'price' => 79,
        'enrolled' => 2100,
        'progress' => 100
    ]
];

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        echo json_encode(['success' => true, 'courses' => $courses]);
        break;
        
    case 'POST':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            exit();
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $newCourse = [
            'id' => count($courses) + 1,
            'title' => $input['title'] ?? '',
            'desc' => $input['desc'] ?? '',
            'price' => (int)($input['price'] ?? 0),
            'level' => $input['level'] ?? 'Beginner',
            'cat' => $input['cat'] ?? 'development',
            'time' => $input['time'] ?? '1h',
            'instructor' => $_SESSION['username'] ?? 'Instructor',
            'img' => $input['img'] ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
            'enrolled' => 0,
            'rating' => '5.0',
            'progress' => 0
        ];
        echo json_encode(['success' => true, 'course' => $newCourse]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>