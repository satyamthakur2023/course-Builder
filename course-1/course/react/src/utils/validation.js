// Enhanced validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: [
      ...(password.length < minLength ? [`Password must be at least ${minLength} characters`] : []),
      ...(!hasUpperCase ? ['Password must contain uppercase letter'] : []),
      ...(!hasLowerCase ? ['Password must contain lowercase letter'] : []),
      ...(!hasNumbers ? ['Password must contain number'] : [])
    ]
  };
};

export const validateCourse = (course) => {
  const errors = [];
  
  if (!course.title?.trim()) {
    errors.push('Course title is required');
  } else if (course.title.length < 3) {
    errors.push('Course title must be at least 3 characters');
  } else if (course.title.length > 100) {
    errors.push('Course title must be less than 100 characters');
  }

  if (!course.desc?.trim()) {
    errors.push('Course description is required');
  } else if (course.desc.length < 10) {
    errors.push('Course description must be at least 10 characters');
  } else if (course.desc.length > 500) {
    errors.push('Course description must be less than 500 characters');
  }

  if (!course.price || course.price < 0) {
    errors.push('Course price must be a positive number');
  } else if (course.price > 10000) {
    errors.push('Course price cannot exceed ₹10,000');
  }

  if (!course.time?.trim()) {
    errors.push('Course duration is required');
  }

  if (!course.instructor?.trim()) {
    errors.push('Instructor name is required');
  }

  if (!['Beginner', 'Intermediate', 'Advanced'].includes(course.level)) {
    errors.push('Invalid course level');
  }

  if (!['development', 'design', 'business', 'ai'].includes(course.cat)) {
    errors.push('Invalid course category');
  }

  // Validate video URLs if provided
  if (course.youtubeLink && !isValidYouTubeUrl(course.youtubeLink)) {
    errors.push('Invalid YouTube URL');
  }

  if (course.videoLink && !isValidUrl(course.videoLink)) {
    errors.push('Invalid video URL');
  }

  if (course.thumbnailUrl && !isValidUrl(course.thumbnailUrl)) {
    errors.push('Invalid thumbnail URL');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const isValidYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, 1000); // Limit length
};

export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 100 * 1024 * 1024, // 100MB default
    allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'],
    maxDuration = 3600 // 1 hour in seconds
  } = options;

  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
  };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  
  const sanitized = sanitizeInput(query);
  return sanitized.length >= 1 && sanitized.length <= 100;
};