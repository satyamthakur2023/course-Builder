export const sortCourses = (courses, sortBy) => {
  return [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'price': return (a.price || 0) - (b.price || 0);
      case 'enrolled': return (b.enrolled || 0) - (a.enrolled || 0);
      case 'rating': return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
      default: return 0;
    }
  });
};

export const removeDuplicateCourses = (courses) => {
  const seen = new Set();
  return courses.filter(course => {
    if (seen.has(course.id)) return false;
    seen.add(course.id);
    return true;
  });
};

export const formatDuration = (timeString) => {
  const match = timeString.match(/(\d+)h?\s*(\d+)?m?/);
  if (!match) return timeString;
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
};

export const getCourseProgress = (courseId, enrolledCourses) => {
  const course = enrolledCourses.find(c => c.id === courseId);
  return course?.progress || 0;
};

export const filterCourses = (courses, filters) => {
  return courses.filter(course => {
    const { category, priceRange, rating, level, search } = filters;
    
    if (category && category !== 'all' && course.cat !== category) return false;
    if (priceRange && (course.price < priceRange[0] || course.price > priceRange[1])) return false;
    if (rating && parseFloat(course.rating) < rating) return false;
    if (level && level !== 'all' && course.level !== level) return false;
    if (search && !course.title.toLowerCase().includes(search.toLowerCase()) && 
        !course.instructor.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });
};