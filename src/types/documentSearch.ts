// Tipos basados en la documentación de la API

export interface Document {
  id: string;
  title?: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadDate: string;
  description?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
  employeeUuid: string;
  employeeName?: string;
  employeeCedula?: string;
  documentType?: string;
  downloadUrl: string;
  viewUrl: string;
  score?: number;
  highlights?: DocumentHighlights;
}

export interface DocumentHighlights {
  title?: string[];
  content?: string[];
  keywords?: string[];
  [field: string]: string[] | undefined;
}

export interface SearchFacet {
  key: string;
  count: number;
}

export interface SearchFacets {
  categories: SearchFacet[];
  documentTypes: SearchFacet[];
  employees: SearchFacet[];
  fileTypes: SearchFacet[];
}

export interface DateRange {
  from?: Date | string;
  to?: Date | string;
}

export interface SearchFilters {
  category?: string;
  documentType?: string;
  employeeUuid?: string;
  dateRange?: DateRange;
  fileType?: string;
}

export interface AdvancedSearchParams {
  query?: string;
  keywords?: string[];
  content?: string;
  fuzzy?: boolean;
  boost?: boolean;
  size?: number;
  from?: number;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'date' | 'size' | 'filename';
  sortOrder?: 'asc' | 'desc';
}

export interface AdvancedSearchResponse {
  documents: Document[];
  total: number;
  took: number;
  facets?: SearchFacets;
  query: AdvancedSearchParams;
}

export interface KeywordSearchParams {
  keywords: string[];
  size?: number;
  from?: number;
  exactMatch?: boolean;
  boost?: boolean;
}

export interface KeywordSearchResponse {
  documents: Document[];
  total: number;
  matchedKeywords: string[];
  searchedKeywords: string[];
}

export interface ContentSearchParams {
  content: string;
  size?: number;
  from?: number;
  fuzzy?: boolean;
  highlight?: boolean;
}

export interface ContentSearchResponse {
  documents: Document[];
  total: number;
  searchTerm: string;
  highlights?: DocumentHighlights[];
}

export interface SuggestionsParams {
  text: string;
  field?: 'title' | 'keywords' | 'content';
  size?: number;
}

export interface SuggestionsResponse {
  suggestions: string[];
  searchTerm: string;
}

export interface SimilarDocumentsParams {
  size?: number;
  minScore?: number;
}

export interface SimilarDocumentsResponse {
  similarDocuments: Document[];
  count: number;
  referenceDocumentId: string;
}

// Parámetros para subida de documentos según CV API
export interface DocumentUploadParams {
  file: File;
  employeeUuid: string;
  employeeName: string;
  employeeCedula: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  documentType?: string; // default: 'hojas-de-vida'
}

// Respuesta de subida según CV API
export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document: {
    id: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    uploadDate: string;
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    employeeUuid: string;
    employeeName: string;
    employeeCedula: string;
    documentType: string;
    year: number;
    relativePath: string;
    keywords: string[];
    downloadUrl: string;
    viewUrl: string;
    elasticsearchIndexed: boolean;
  };
  elasticsearch: {
    indexed: boolean;
    indexName: string;
    documentId: string;
  };
  extractedData: {
    textExtracted: boolean;
    keywordCount: number;
    textLength: number;
  };
}

export interface SearchState {
  results: AdvancedSearchResponse | null;
  loading: boolean;
  error: string | null;
  suggestions: string[];
}

export interface SearchOptions {
  endpoint?: string;
  append?: boolean;
  signal?: AbortSignal;
}

export type SearchEndpoint = 
  | 'advanced-search'
  | 'search/keywords'
  | 'search/content'
  | 'suggestions'
  | `similar/${string}`;

export interface APIError {
  message: string;
  status?: number;
  code?: string;
}