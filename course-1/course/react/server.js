const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file
async function initializeData() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    const initialData = {
      courses: [
        {id:1,title:'Full Stack Web Development',desc:'Master HTML, CSS, JS, React, Node.js and build dynamic web apps.',level:'Intermediate',rating:'4.8',time:'8h 30m',cat:'development',instructor:'John Parker',img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',price:99,enrolled:1250,progress:65,createdAt:new Date().toISOString()},
        {id:2,title:'Machine Learning Basics',desc:'Understand algorithms, train models, and deploy ML apps with Python.',level:'Advanced',rating:'4.9',time:'10h',cat:'ai',instructor:'Dr. Aisha Khan',img:'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=200&fit=crop',price:149,enrolled:890,progress:0,createdAt:new Date().toISOString()},
        {id:3,title:'UI/UX Design for Beginners',desc:'Learn Figma, typography, wireframing, and design psychology.',level:'Beginner',rating:'4.6',time:'6h 45m',cat:'design',instructor:'Elena Rose',img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',price:79,enrolled:2100,progress:100,createdAt:new Date().toISOString()},
        {id:4,title:'Entrepreneurship Essentials',desc:'Learn how to start and scale your business with proven models.',level:'Intermediate',rating:'4.7',time:'5h 20m',cat:'business',instructor:'Michael Stone',img:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop',price:89,enrolled:567,progress:30,createdAt:new Date().toISOString()},
        {id:5,title:'Data Science with Python',desc:'Dive into data visualization, cleaning, and statistical analysis.',level:'Advanced',rating:'4.9',time:'12h 15m',cat:'ai',instructor:'Dr. Lin Wei',img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',price:159,enrolled:1890,progress:0,createdAt:new Date().toISOString()},
        {id:6,title:'Digital Marketing Strategy',desc:'Master SEO, SEM, and social media advertising for maximum reach.',level:'Beginner',rating:'4.5',time:'7h 0m',cat:'business',instructor:'Sarah Lee',img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',price:69,enrolled:3200,progress:85,createdAt:new Date().toISOString()}
      ],
      enrollments: [],
      users: []
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Helper functions
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/courses', async (req, res) => {
  try {
    const data = await readData();
    res.json({ data: data.courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const data = await readData();
    const course = data.courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ data: course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const data = await readData();
    const newCourse = {
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      enrolled: 0,
      rating: '5.0'
    };
    data.courses.push(newCourse);
    await writeData(data);
    res.status(201).json({ data: newCourse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const data = await readData();
    const courseIndex = data.courses.findIndex(c => c.id === parseInt(req.params.id));
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    data.courses[courseIndex] = { ...data.courses[courseIndex], ...req.body };
    await writeData(data);
    res.json({ data: data.courses[courseIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const data = await readData();
    const courseIndex = data.courses.findIndex(c => c.id === parseInt(req.params.id));
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    data.courses.splice(courseIndex, 1);
    await writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Enrollment endpoints
app.post('/api/enrollments', async (req, res) => {
  try {
    const data = await readData();
    const { courseId, userId } = req.body;
    
    const enrollment = {
      id: Date.now(),
      courseId,
      userId,
      enrolledAt: new Date().toISOString(),
      progress: 0
    };
    
    data.enrollments.push(enrollment);
    
    // Update course enrollment count
    const course = data.courses.find(c => c.id === courseId);
    if (course) {
      course.enrolled += 1;
    }
    
    await writeData(data);
    res.status(201).json({ data: enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

// Analytics endpoints
app.get('/api/instructors/:id/stats', async (req, res) => {
  try {
    const data = await readData();
    const instructorCourses = data.courses.filter(c => c.instructor === req.params.id);
    
    const stats = {
      totalCourses: instructorCourses.length,
      totalStudents: instructorCourses.reduce((sum, course) => sum + course.enrolled, 0),
      totalRevenue: instructorCourses.reduce((sum, course) => sum + (course.price * course.enrolled), 0),
      avgRating: instructorCourses.length > 0 
        ? (instructorCourses.reduce((sum, course) => sum + parseFloat(course.rating), 0) / instructorCourses.length).toFixed(1)
        : '0.0'
    };
    
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch instructor stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await initializeData();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);