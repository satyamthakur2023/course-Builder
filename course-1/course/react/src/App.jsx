import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, ChevronDown, Moon, Sun, LogOut, BookOpen, GraduationCap, X } from 'lucide-react';
import Course from './Course.jsx';
import InstructorDashboard from './InstructorDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import LoginModal from './components/LoginModal.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider, useToast } from './components/Toast.jsx';
import { validateCourse } from './utils/validation.js';
import useCourseStore from './store/courseStore.js';
import useAuthStore from './store/authStore.js';
import dataService from './services/api.js';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('courses');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { showToast } = useToast();
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { courses, notifications, loading, error, setCourses, addCourse, updateCourse, deleteCourse, setLoading, setError, getStats, markNotificationRead, cacheValid } = useCourseStore();
  
  const stats = getStats();

  useEffect(() => {
    if (!cacheValid) loadDefaultCourses();
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notifications if clicking outside
      if (showNotifications && !event.target.closest('.notification-menu')) {
        setShowNotifications(false);
      }
      // Close user menu if clicking outside
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showNotifications, showUserMenu]);

  const loadDefaultCourses = async () => {
    setLoading(true);
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocal ? 'https://b7_40130868.byethost7.com/api/courses.php' : '/api/courses.php';
    try {
      const response = await fetch(apiUrl, { credentials: 'include' });
      const data = await response.json();
      if (data.success && data.courses && data.courses.length > 0) {
        setCourses(data.courses);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('PHP API unavailable, loading default courses...');
    } finally {
      setLoading(false);
    }
    const defaultCourses = [
        {id:0,title:'React JS Full Course for Beginners',desc:'Complete React JS tutorial for beginners. Learn React hooks, components, state management, and build real projects from scratch.',level:'Beginner',rating:'4.9',time:'12h 30m',cat:'development',instructor:'Bro Code',img:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',price:0,enrolled:45200,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/1L420xXpDTg',freeContent:['Introduction to React','Setting Up Environment','JSX Basics','Components & Props'],paidContent:['React Hooks Deep Dive','State Management','React Router','Building Projects','Deployment']},{id:1,title:'Full Stack Web Development',desc:'Master HTML, CSS, JS, React, Node.js and build dynamic web apps.',level:'Intermediate',rating:'4.8',time:'8h 30m',cat:'development',instructor:'John Parker',img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',price:99,enrolled:1250,progress:65,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Introduction to Web Development','Setting up Development Environment'],paidContent:['Advanced React Concepts','Node.js Backend','Database Integration','Deployment Strategies']},
        {id:2,title:'Machine Learning Basics',desc:'Understand algorithms, train models, and deploy ML apps with Python.',level:'Advanced',rating:'4.9',time:'10h',cat:'ai',instructor:'Dr. Aisha Khan',img:'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=200&fit=crop',price:149,enrolled:890,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['What is Machine Learning?','Python Basics for ML'],paidContent:['Supervised Learning','Neural Networks','Model Deployment','Real-world Projects']},
        {id:3,title:'UI/UX Design for Beginners',desc:'Learn Figma, typography, wireframing, and design psychology.',level:'Beginner',rating:'4.6',time:'6h 45m',cat:'design',instructor:'Elena Rose',img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',price:79,enrolled:2100,progress:100,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Design Principles','Color Theory Basics'],paidContent:['Advanced Figma','User Research','Prototyping','Portfolio Building']},
        {id:4,title:'Advanced React Development',desc:'Deep dive into React hooks, context, performance optimization, and testing.',level:'Advanced',rating:'4.9',time:'12h 15m',cat:'development',instructor:'Sarah Chen',img:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',price:179,enrolled:756,progress:45,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['React Basics Review','Hooks Introduction'],paidContent:['Advanced Hooks','Context API','Performance Optimization','Testing Strategies']},
        {id:5,title:'Digital Marketing Mastery',desc:'Learn SEO, social media marketing, content strategy, and analytics.',level:'Intermediate',rating:'4.7',time:'9h 20m',cat:'business',instructor:'Mike Rodriguez',img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',price:129,enrolled:1890,progress:78,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Marketing Basics','SEO Introduction'],paidContent:['Advanced SEO','Social Media Strategy','Analytics','Content Marketing']},
        {id:6,title:'Python for Data Science',desc:'Master pandas, numpy, matplotlib, and machine learning fundamentals.',level:'Intermediate',rating:'4.8',time:'11h 45m',cat:'ai',instructor:'Dr. Lisa Wang',img:'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop',price:159,enrolled:1456,progress:23,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Python Basics','Data Types'],paidContent:['Pandas Mastery','NumPy Advanced','Data Visualization','ML Algorithms']},
        {id:7,title:'Mobile App Design',desc:'Create stunning mobile interfaces with modern design principles.',level:'Beginner',rating:'4.5',time:'7h 30m',cat:'design',instructor:'Alex Thompson',img:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',price:89,enrolled:2340,progress:89,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Design Basics','Mobile UI Principles'],paidContent:['Advanced Design','Prototyping','User Testing','App Store Guidelines']},
        {id:8,title:'Blockchain Development',desc:'Build decentralized applications with Ethereum, Solidity, and Web3.',level:'Advanced',rating:'4.6',time:'14h 20m',cat:'development',instructor:'David Kim',img:'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop',price:199,enrolled:567,progress:12,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Blockchain Basics','Cryptocurrency Overview'],paidContent:['Smart Contracts','DApp Development','Web3 Integration','Security Best Practices']},
        {id:9,title:'Financial Planning & Analysis',desc:'Master budgeting, forecasting, and financial modeling techniques.',level:'Intermediate',rating:'4.4',time:'8h 15m',cat:'business',instructor:'Jennifer Adams',img:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',price:139,enrolled:1123,progress:56,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Finance Basics','Budgeting 101'],paidContent:['Advanced Modeling','Forecasting','Risk Analysis','Investment Planning']},
        {id:10,title:'Deep Learning with TensorFlow',desc:'Build neural networks, CNNs, and RNNs for complex AI applications.',level:'Advanced',rating:'4.9',time:'16h 30m',cat:'ai',instructor:'Prof. Robert Zhang',img:'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',price:249,enrolled:423,progress:34,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Neural Network Basics','TensorFlow Setup'],paidContent:['CNN Architecture','RNN Models','Transfer Learning','Production Deployment']},
        {id:11,title:'Brand Identity Design',desc:'Create compelling brand identities, logos, and visual systems.',level:'Intermediate',rating:'4.7',time:'9h 45m',cat:'design',instructor:'Maria Garcia',img:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=200&fit=crop',price:119,enrolled:1678,progress:67,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Branding Fundamentals','Logo Design Basics'],paidContent:['Brand Strategy','Visual Identity Systems','Brand Guidelines','Portfolio Development']},
        {id:12,title:'Cloud Architecture with AWS',desc:'Design scalable cloud solutions using AWS services and best practices.',level:'Advanced',rating:'4.8',time:'13h 10m',cat:'development',instructor:'James Wilson',img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',price:189,enrolled:834,progress:41,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['AWS Basics','Cloud Concepts'],paidContent:['EC2 Mastery','Database Services','Security','Cost Optimization']},
        {id:13,title:'Cybersecurity Fundamentals',desc:'Learn ethical hacking, network security, and threat analysis.',level:'Intermediate',rating:'4.7',time:'15h 20m',cat:'development',instructor:'Alex Morgan',img:'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop',price:169,enrolled:945,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Security Basics','Common Threats'],paidContent:['Ethical Hacking','Network Security','Penetration Testing','Incident Response']},
        {id:14,title:'Content Creation & Video Editing',desc:'Master video editing, motion graphics, and content strategy.',level:'Beginner',rating:'4.5',time:'8h 45m',cat:'design',instructor:'Sophie Turner',img:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=200&fit=crop',price:109,enrolled:1567,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Video Basics','Editing Fundamentals'],paidContent:['Advanced Editing','Motion Graphics','Color Grading','Content Strategy']},
        {id:15,title:'E-commerce Business Strategy',desc:'Build and scale successful online businesses from scratch.',level:'Intermediate',rating:'4.6',time:'10h 30m',cat:'business',instructor:'Marcus Johnson',img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',price:149,enrolled:1234,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['E-commerce Basics','Market Research'],paidContent:['Store Setup','Marketing Strategies','Analytics','Scaling Business']},
        {id:16,title:'iOS App Development with Swift',desc:'Create native iOS applications using Swift and Xcode.',level:'Advanced',rating:'4.8',time:'18h 15m',cat:'development',instructor:'Emma Davis',img:'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop',price:219,enrolled:678,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Swift Basics','Xcode Setup'],paidContent:['UIKit Mastery','Core Data','App Store Submission','Advanced iOS Features']},
        {id:17,title:'Graphic Design Masterclass',desc:'Learn typography, color theory, and visual communication.',level:'Beginner',rating:'4.4',time:'7h 20m',cat:'design',instructor:'Ryan Cooper',img:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=200&fit=crop',price:89,enrolled:2456,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Design Principles','Typography Basics'],paidContent:['Advanced Typography','Color Theory','Layout Design','Brand Design']},
        {id:18,title:'Project Management Professional',desc:'Master Agile, Scrum, and project leadership skills.',level:'Intermediate',rating:'4.5',time:'12h 40m',cat:'business',instructor:'Lisa Anderson',img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',price:159,enrolled:1789,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['PM Fundamentals','Agile Basics'],paidContent:['Scrum Mastery','Leadership Skills','Risk Management','PMP Certification']},
        {id:19,title:'Natural Language Processing',desc:'Build chatbots and text analysis systems with NLP.',level:'Advanced',rating:'4.9',time:'14h 50m',cat:'ai',instructor:'Dr. Kevin Liu',img:'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',price:199,enrolled:567,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['NLP Introduction','Text Processing'],paidContent:['Advanced NLP','Chatbot Development','Sentiment Analysis','Language Models']},
        {id:20,title:'DevOps & CI/CD Pipeline',desc:'Automate deployment with Docker, Kubernetes, and Jenkins.',level:'Advanced',rating:'4.7',time:'16h 10m',cat:'development',instructor:'Michael Brown',img:'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=200&fit=crop',price:189,enrolled:823,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['DevOps Basics','Docker Introduction'],paidContent:['Kubernetes Mastery','CI/CD Pipelines','Monitoring','Infrastructure as Code']},
        {id:21,title:'Social Media Marketing',desc:'Grow your brand with Instagram, TikTok, and Facebook strategies.',level:'Beginner',rating:'4.3',time:'6h 30m',cat:'business',instructor:'Jessica White',img:'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=200&fit=crop',price:79,enrolled:3245,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Social Media Basics','Platform Overview'],paidContent:['Content Strategy','Influencer Marketing','Paid Advertising','Analytics']},
        {id:22,title:'3D Modeling & Animation',desc:'Create stunning 3D models and animations with Blender.',level:'Intermediate',rating:'4.6',time:'13h 25m',cat:'design',instructor:'Carlos Rodriguez',img:'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=200&fit=crop',price:139,enrolled:1456,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Blender Basics','3D Fundamentals'],paidContent:['Advanced Modeling','Animation Techniques','Rendering','Character Design']},
        {id:23,title:'Cryptocurrency & Blockchain',desc:'Understand crypto trading, DeFi, and blockchain technology.',level:'Intermediate',rating:'4.4',time:'9h 15m',cat:'business',instructor:'Nathan Green',img:'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=200&fit=crop',price:129,enrolled:1678,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Crypto Basics','Blockchain Overview'],paidContent:['Trading Strategies','DeFi Protocols','NFTs','Investment Analysis']},
        {id:24,title:'Game Development with Unity',desc:'Build 2D and 3D games using Unity and C# programming.',level:'Advanced',rating:'4.8',time:'20h 30m',cat:'development',instructor:'Oliver Stone',img:'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop',price:229,enrolled:789,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Unity Basics','C# Fundamentals'],paidContent:['2D Game Development','3D Game Creation','Physics Systems','Game Publishing']},
        {id:25,title:'Photography & Photo Editing',desc:'Master camera techniques and Adobe Lightroom editing.',level:'Beginner',rating:'4.5',time:'8h 10m',cat:'design',instructor:'Isabella Martinez',img:'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=200&fit=crop',price:99,enrolled:2134,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Photography Basics','Camera Settings'],paidContent:['Advanced Techniques','Lightroom Mastery','Photo Composition','Portfolio Building']},
        {id:26,title:'Data Analytics with Excel',desc:'Advanced Excel functions, pivot tables, and data visualization.',level:'Beginner',rating:'4.2',time:'5h 45m',cat:'business',instructor:'Robert Taylor',img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',price:69,enrolled:4567,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Excel Basics','Data Entry'],paidContent:['Advanced Functions','Pivot Tables','Data Visualization','Dashboard Creation']},
        {id:27,title:'Computer Vision & OpenCV',desc:'Build image recognition and computer vision applications.',level:'Advanced',rating:'4.9',time:'17h 20m',cat:'ai',instructor:'Dr. Priya Sharma',img:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',price:209,enrolled:456,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Computer Vision Basics','OpenCV Setup'],paidContent:['Image Processing','Object Detection','Face Recognition','Real-time Applications']},
        {id:28,title:'Angular Complete Guide',desc:'Master Angular framework with TypeScript, RxJS, and modern development.',level:'Intermediate',rating:'4.7',time:'14h 30m',cat:'development',instructor:'Thomas Mueller',img:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',price:169,enrolled:1234,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Angular Basics','TypeScript Introduction'],paidContent:['Components & Services','RxJS Mastery','State Management','Testing']},
        {id:29,title:'WordPress Development',desc:'Create custom themes, plugins, and dynamic websites with WordPress.',level:'Beginner',rating:'4.4',time:'9h 15m',cat:'development',instructor:'Rachel Green',img:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop',price:99,enrolled:2890,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['WordPress Basics','Theme Setup'],paidContent:['Custom Themes','Plugin Development','WooCommerce','SEO Optimization']},
        {id:30,title:'Figma to Code',desc:'Convert Figma designs to pixel-perfect HTML, CSS, and React components.',level:'Intermediate',rating:'4.8',time:'8h 20m',cat:'design',instructor:'Alex Rivera',img:'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=200&fit=crop',price:119,enrolled:1456,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Figma Basics','Design Handoff'],paidContent:['HTML/CSS Conversion','React Components','Responsive Design','Animation Implementation']},
        {id:31,title:'Vue.js Mastery',desc:'Build modern web applications with Vue.js, Vuex, and Vue Router.',level:'Intermediate',rating:'4.7',time:'12h 45m',cat:'development',instructor:'Sophie Chen',img:'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',price:149,enrolled:987,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Vue.js Basics','Component System'],paidContent:['Vuex State Management','Vue Router','Composition API','Testing Vue Apps']},
        {id:32,title:'AWS Certified Solutions Architect',desc:'Prepare for AWS certification with hands-on cloud computing skills.',level:'Advanced',rating:'4.8',time:'18h 30m',cat:'development',instructor:'Michael Brown',img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',price:229,enrolled:1234,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['AWS Overview','EC2 Basics'],paidContent:['Solutions Architecture','Security','Databases','Certification Prep']},
        {id:33,title:'Copywriting & Content Marketing',desc:'Write compelling copy that converts and build content marketing strategies.',level:'Beginner',rating:'4.4',time:'8h 15m',cat:'business',instructor:'Emma Davis',img:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop',price:99,enrolled:2345,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Copywriting Basics','Headlines'],paidContent:['Sales Copy','Email Marketing','Content Strategy','Conversion Optimization']},
        {id:34,title:'Motion Graphics with After Effects',desc:'Create stunning animations and motion graphics for videos and web.',level:'Advanced',rating:'4.6',time:'15h 10m',cat:'design',instructor:'James Wilson',img:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=200&fit=crop',price:189,enrolled:678,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['After Effects Basics','Animation Principles'],paidContent:['Advanced Animation','3D Motion','Visual Effects','Client Projects']},
        {id:35,title:'Artificial Intelligence Ethics',desc:'Understand AI ethics, bias, and responsible AI development practices.',level:'Intermediate',rating:'4.6',time:'6h 45m',cat:'ai',instructor:'Dr. Sarah Johnson',img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',price:89,enrolled:567,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['AI Ethics Introduction','Bias in AI'],paidContent:['Responsible AI','Fairness Metrics','Governance','Case Studies']},
        {id:36,title:'Startup Business Planning',desc:'Learn to create business plans, pitch decks, and secure funding.',level:'Beginner',rating:'4.5',time:'7h 30m',cat:'business',instructor:'Mark Thompson',img:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',price:109,enrolled:1789,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Business Model Canvas','Market Research'],paidContent:['Financial Planning','Pitch Deck Creation','Investor Relations','Legal Basics']},
        {id:37,title:'Kubernetes Container Orchestration',desc:'Deploy and manage containerized applications with Kubernetes.',level:'Advanced',rating:'4.9',time:'16h 45m',cat:'development',instructor:'David Kim',img:'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=200&fit=crop',price:199,enrolled:567,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Kubernetes Basics','Pods & Services'],paidContent:['Deployments','Networking','Security','Production Best Practices']},
        {id:38,title:'Podcast Production & Marketing',desc:'Create, produce, and market successful podcasts from scratch.',level:'Beginner',rating:'4.3',time:'6h 30m',cat:'business',instructor:'Lisa Anderson',img:'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=200&fit=crop',price:79,enrolled:1456,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Podcast Basics','Equipment Setup'],paidContent:['Audio Production','Marketing Strategies','Monetization','Growth Tactics']},
        {id:39,title:'Sketch to Prototype',desc:'Design and prototype mobile apps using Sketch and modern design tools.',level:'Intermediate',rating:'4.5',time:'9h 20m',cat:'design',instructor:'Maria Garcia',img:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',price:129,enrolled:890,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Sketch Basics','Design Systems'],paidContent:['Advanced Prototyping','User Testing','Handoff Process','Design Collaboration']},
        {id:40,title:'Rust Programming Language',desc:'Learn systems programming with Rust for performance and safety.',level:'Advanced',rating:'4.7',time:'14h 15m',cat:'development',instructor:'Oliver Stone',img:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',price:179,enrolled:456,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Rust Basics','Memory Safety'],paidContent:['Advanced Rust','Web Development','System Programming','Performance Optimization']},
        {id:41,title:'Email Marketing Automation',desc:'Build automated email campaigns that drive sales and engagement.',level:'Intermediate',rating:'4.6',time:'7h 45m',cat:'business',instructor:'Jennifer Adams',img:'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=200&fit=crop',price:119,enrolled:1678,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['Email Marketing Basics','List Building'],paidContent:['Automation Workflows','Segmentation','A/B Testing','Analytics & Optimization']},
        {id:42,title:'Augmented Reality Development',desc:'Create AR experiences for mobile apps using ARKit and ARCore.',level:'Advanced',rating:'4.8',time:'13h 30m',cat:'development',instructor:'Carlos Rodriguez',img:'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=200&fit=crop',price:209,enrolled:345,progress:0,hasVideo:true,videoUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ',freeContent:['AR Fundamentals','ARKit Basics'],paidContent:['Advanced AR Features','3D Object Tracking','AR Games','Publishing AR Apps']}
      ];
      console.log('Setting', defaultCourses.length, 'courses');
      setCourses(defaultCourses);
      setLoading(false);
  };

  const handleCourseAction = async (action, courseData, courseId) => {
    try {
      setLoading(true);
      let result;
      
      switch (action) {
        case 'add':
          const validation = validateCourse(courseData);
          if (!validation.isValid) throw new Error(validation.errors[0]);
          result = { ...courseData, id: Date.now(), enrolled: 0, rating: '5.0', hasVideo: !!courseData.videoUrl };
          addCourse(result);
          showToast('Course created successfully!', 'success');
          // Notify all students about new course
          if (user?.role === 'instructor') {
            showToast('📢 Course announcement sent to all students!', 'info');
          }
          break;
        case 'update':
          updateCourse(courseId, courseData);
          showToast('Course updated successfully!', 'success');
          break;
        case 'delete':
          deleteCourse(courseId);
          showToast('Course deleted successfully!', 'success');
          break;
        case 'enroll':
          // enrollInCourse(courseId); // This function should be implemented in the store
          showToast('🎉 Successfully enrolled! Welcome to the course!', 'success');
          setTimeout(() => showToast('📧 Enrollment confirmation sent to your email', 'info'), 1500);
          break;
      }
      
      try {
        await dataService[action === 'add' ? 'createCourse' : action === 'update' ? 'updateCourse' : 'deleteCourse'](action === 'delete' ? courseId : result || courseData);
      } catch (apiErr) {
        console.log('API sync failed, operation saved locally');
      }
      
      return result;
    } catch (err) {
      showToast(`Failed to ${action} course: ${err.message}`, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationRead(notification.id);
    setShowNotifications(false);
    showToast('Notification marked as read', 'info');
  };

  const handlePaymentVerification = (courseId, paymentData) => {
    // Simulate payment verification
    setTimeout(() => {
      handleCourseAction('enroll', null, courseId);
      showToast('💳 Payment verified successfully!', 'success');
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('courses');
    setShowUserMenu(false);
    showToast('Logged out successfully', 'info');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to RiseGen</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Choose your role to get started with our learning platform</p>
          <div className="space-y-4">
            <button onClick={() => setShowLoginModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all block mx-auto">
              Get Started
            </button>
            <div className="text-sm text-gray-500">
              <p>Demo accounts:</p>
              <p>Student: student@example.com / password</p>
              <p>Instructor: instructor@example.com / password</p>
            </div>
          </div>
        </div>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'
    }`}>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50' 
          : 'glass-nav'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className={`font-display text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'gradient-text'
                }`}>RiseGen</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCurrentPage('courses')} 
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${currentPage === 'courses' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' : isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800/80 hover:scale-105' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 hover:scale-105'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{stats.totalCourses}</span>
                </button>
                
                {user?.role === 'student' && (
                  <button 
                    onClick={() => setCurrentPage('dashboard')} 
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${currentPage === 'dashboard' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 scale-105' : isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-gray-800/80 hover:scale-105' : 'text-gray-600 hover:text-green-600 hover:bg-green-50/80 hover:scale-105'}`}
                  >
                    <User className="w-4 h-4" />
                    <span>My Learning</span>
                  </button>
                )}
                
                {user?.role === 'instructor' && (
                  <button 
                    onClick={() => setCurrentPage('instructor')} 
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${currentPage === 'instructor' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105' : isDarkMode ? 'text-gray-300 hover:text-purple-400 hover:bg-gray-800/80 hover:scale-105' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 hover:scale-105'}`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Instructor Panel</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  const newDarkMode = !isDarkMode;
                  setIsDarkMode(newDarkMode);
                  localStorage.setItem('darkMode', newDarkMode.toString());
                  if (newDarkMode) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }} 
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/80' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80'
                }`}
              >
                {isDarkMode ? 
                  <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> : 
                  <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                }
              </button>
              
              <div className="relative notification-menu">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }} 
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 relative group ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800/80' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80'
                  }`}
                >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" />
                  {stats.unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className={`absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl py-3 z-50 animate-fadeIn transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/95 backdrop-blur-xl border border-gray-700/50' 
                      : 'glass-card border border-white/20'
                  }`}>
                    <div className={`px-6 py-3 border-b ${
                      isDarkMode ? 'border-gray-700/50' : 'border-white/10'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-bold ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>Notifications</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-blue-900/50 text-blue-300' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {stats.unreadNotifications} new
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowNotifications(false);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(notification => (
                        <button 
                          key={notification.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }} 
                          className={`w-full text-left px-6 py-4 border-l-4 transition-all duration-300 group ${
                            notification.unread 
                              ? isDarkMode 
                                ? 'border-blue-400 bg-blue-900/20 hover:bg-blue-900/30' 
                                : 'border-blue-500 bg-blue-50/20 hover:bg-blue-50/30'
                              : isDarkMode 
                                ? 'border-transparent hover:bg-gray-700/30' 
                                : 'border-transparent hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread 
                                ? 'bg-blue-500 animate-pulse' 
                                : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-200 group-hover:text-blue-400' 
                                  : 'text-gray-900 group-hover:text-blue-600'
                              }`}>{notification.message}</p>
                              <p className={`text-xs mt-1 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      )) : (
                        <div className="px-6 py-8 text-center">
                          <Bell className={`w-12 h-12 mx-auto mb-3 ${
                            isDarkMode ? 'text-gray-600' : 'text-gray-300'
                          }`} />
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative user-menu">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }} 
                  className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 hover:scale-105 group ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800/80' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{user?.name}</p>
                    <p className={`text-xs capitalize ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{user?.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl py-3 z-50 animate-fadeIn transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/95 backdrop-blur-xl border border-gray-700/50' 
                      : 'glass-card border border-white/20'
                  }`}>
                    <div className={`px-6 py-4 border-b ${
                      isDarkMode ? 'border-gray-700/50' : 'border-white/10'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${
                              isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>{user?.name}</p>
                            <p className={`text-xs capitalize px-2 py-1 rounded-full ${
                              isDarkMode 
                                ? 'text-gray-300 bg-gray-700/50' 
                                : 'text-gray-500 bg-gray-100'
                            }`}>{user?.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowUserMenu(false);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className={`w-full flex items-center px-6 py-3 text-sm transition-all duration-300 group ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100' 
                          : 'text-gray-700 hover:bg-white/10'
                      }`}>
                        <Settings className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">Settings</span>
                      </button>
                      <hr className={`my-2 ${
                        isDarkMode ? 'border-gray-700/50' : 'border-white/10'
                      }`} />
                      <button 
                        onClick={handleLogout} 
                        className={`w-full flex items-center px-6 py-3 text-sm text-red-500 transition-all duration-300 group ${
                          isDarkMode 
                            ? 'hover:bg-red-900/30 hover:text-red-400' 
                            : 'hover:bg-red-50/50 hover:text-red-600'
                        }`}
                      >
                        <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {loading && <div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="large" text="Loading..." /></div>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
            <strong>Error: </strong>{error}
          </div>
        )}
        {!loading && !error && (
          <>
            {currentPage === 'courses' && <Course courses={courses} />}
            {currentPage === 'dashboard' && user?.role === 'student' && <StudentDashboard />}
            {currentPage === 'instructor' && user?.role === 'instructor' && (
              <InstructorDashboard courses={courses} onAddCourse={(data) => handleCourseAction('add', data)} onUpdateCourse={(id, data) => handleCourseAction('update', data, id)} onDeleteCourse={(id) => handleCourseAction('delete', null, id)} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </ErrorBoundary>
);

export default App;