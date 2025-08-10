import Joi from 'joi';

// Validation schemas
const chatRequestSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000).messages({
    'string.empty': 'Message cannot be empty',
    'string.min': 'Message must be at least 1 character long',
    'string.max': 'Message cannot exceed 1000 characters',
    'any.required': 'Message is required'
  }),
  conversationId: Joi.string().uuid().optional().messages({
    'string.guid': 'Conversation ID must be a valid UUID'
  }),
  stream: Joi.boolean().optional().default(false)
});

const searchQuerySchema = Joi.object({
  q: Joi.string().required().min(1).max(100).messages({
    'string.empty': 'Search query cannot be empty',
    'string.min': 'Search query must be at least 1 character long',
    'string.max': 'Search query cannot exceed 100 characters',
    'any.required': 'Search query is required'
  })
});

const projectFilterSchema = Joi.object({
  technology: Joi.string().optional().min(1).max(50),
  limit: Joi.number().integer().min(1).max(100).optional(),
  category: Joi.string().optional().min(1).max(50)
});

const skillFilterSchema = Joi.object({
  category: Joi.string().optional().min(1).max(50),
  proficiency: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional()
});

const experienceFilterSchema = Joi.object({
  company: Joi.string().optional().min(1).max(100),
  duration: Joi.string().optional().min(1).max(50)
});

// Validation middleware functions
export const validateChatRequest = (req, res, next) => {
  const { error, value } = chatRequestSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  // Replace req.body with validated data
  req.body = value;
  next();
};

export const validateSearchQuery = (req, res, next) => {
  const { error, value } = searchQuerySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid search query',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  // Replace req.query with validated data
  req.query = value;
  next();
};

export const validateProjectFilters = (req, res, next) => {
  const { error, value } = projectFilterSchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid project filter parameters',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  // Replace req.query with validated data
  req.query = value;
  next();
};

export const validateSkillFilters = (req, res, next) => {
  const { error, value } = skillFilterSchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid skill filter parameters',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  // Replace req.query with validated data
  req.query = value;
  next();
};

export const validateExperienceFilters = (req, res, next) => {
  const { error, value } = experienceFilterSchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid experience filter parameters',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  // Replace req.query with validated data
  req.query = value;
  next();
};

// Generic validation middleware
export const validateRequest = (schema, location = 'body') => {
  return (req, res, next) => {
    const dataToValidate = location === 'body' ? req.body : req.query;
    const { error, value } = schema.validate(dataToValidate);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Invalid ${location} data`,
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        })),
        timestamp: new Date().toISOString()
      });
    }
    
    // Replace the validated data
    if (location === 'body') {
      req.body = value;
    } else {
      req.query = value;
    }
    
    next();
  };
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  const sanitizeString = (str) => {
    if (typeof str === 'string') {
      return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
    }
    return str;
  };
  
  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    } else {
      return sanitizeString(obj);
    }
  };
  
  // Sanitize request body and query
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

// Rate limiting validation
export const validateRateLimit = (req, res, next) => {
  // This would typically integrate with your rate limiting solution
  // For now, we'll just pass through
  next();
};
