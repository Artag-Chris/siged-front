/**
 * Environment variables configuration and validation
 */

interface EnvConfig {
  API_BASE_URL: string;
  DOCUMENT_API_URL: string;
  CV_UPLOAD_API_URL: string;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
}

/**
 * Validates that required environment variables are present
 */
function validateEnvVars(): EnvConfig {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const DOCUMENT_API_URL = process.env.NEXT_PUBLIC_DOCUMENT_API_URL;
  const CV_UPLOAD_API_URL = process.env.NEXT_PUBLIC_CV_UPLOAD_API_URL;
  const MAX_FILE_SIZE = process.env.NEXT_PUBLIC_MAX_FILE_SIZE;
  const ALLOWED_FILE_TYPES = process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES;

  // Validate required variables
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is required but not defined in environment variables');
  }

  if (!DOCUMENT_API_URL) {
    throw new Error('NEXT_PUBLIC_DOCUMENT_API_URL is required but not defined in environment variables');
  }

  if (!CV_UPLOAD_API_URL) {
    throw new Error('NEXT_PUBLIC_CV_UPLOAD_API_URL is required but not defined in environment variables');
  }

  // Parse and validate optional variables with defaults
  const maxFileSize = MAX_FILE_SIZE ? parseInt(MAX_FILE_SIZE, 10) : 104857600; // 100MB default
  const allowedFileTypes = ALLOWED_FILE_TYPES 
    ? ALLOWED_FILE_TYPES.split(',').map(type => type.trim())
    : ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  if (isNaN(maxFileSize) || maxFileSize <= 0) {
    throw new Error('NEXT_PUBLIC_MAX_FILE_SIZE must be a positive number');
  }

  return {
    API_BASE_URL,
    DOCUMENT_API_URL,
    CV_UPLOAD_API_URL,
    MAX_FILE_SIZE: maxFileSize,
    ALLOWED_FILE_TYPES: allowedFileTypes,
  };
}

// Validate and export configuration
export const env = validateEnvVars();

// Export individual values for convenience
export const {
  API_BASE_URL,
  DOCUMENT_API_URL,
  CV_UPLOAD_API_URL,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} = env;

// Export configuration object for search API
export const searchConfig = {
  baseUrl: DOCUMENT_API_URL,
  defaultPageSize: 10,
  maxCacheSize: 100,
  defaultCacheTTL: 5 * 60 * 1000, // 5 minutes
  debounceDelay: 300,
  endpoints: {
    advancedSearch: 'advanced-search',
    searchKeywords: 'search/keywords',
    searchContent: 'search/content',
    suggestions: 'suggestions',
    similar: 'similar',
    upload: 'upload',
  },
} as const;

export default env;