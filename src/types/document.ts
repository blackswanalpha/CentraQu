/**
 * Document Management Types
 * Defines all TypeScript interfaces for document-related data structures
 */

// Document Status
export type DocumentStatus = "active" | "archived" | "deleted" | "expiring-soon";

// Document Type
export type DocumentType = 
  | "pdf" 
  | "word" 
  | "excel" 
  | "powerpoint" 
  | "image" 
  | "video" 
  | "audio" 
  | "archive" 
  | "other";

// Permission Level
export type PermissionLevel = "view" | "edit" | "full-control" | "owner";

// Access Duration Type
export type AccessDurationType = "permanent" | "temporary";

// Document Version
export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  changeNotes?: string;
  isCurrentVersion: boolean;
  downloads?: number;
  views?: number;
}

// Document Permission
export interface DocumentPermission {
  id: string;
  documentId: string;
  userId?: string;
  teamId?: string;
  userName?: string;
  teamName?: string;
  permissionLevel: PermissionLevel;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  isInherited: boolean;
  inheritedFrom?: string; // folder ID
}

// Shared Link
export interface SharedLink {
  id: string;
  documentId: string;
  token: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  permissionLevel: "view" | "view-download";
  requiresPassword: boolean;
  password?: string;
  views: number;
  downloads: number;
  lastAccessedAt?: Date;
}

// Document Activity Log
export interface DocumentActivityLog {
  id: string;
  documentId: string;
  action: "created" | "updated" | "viewed" | "downloaded" | "shared" | "permission-changed" | "deleted" | "restored";
  performedBy: string;
  performedAt: Date;
  details?: string;
  ipAddress?: string;
}

// Document Comment
export interface DocumentComment {
  id: string;
  documentId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  mentions?: string[]; // user IDs
}

// Document Tag
export interface DocumentTag {
  id: string;
  name: string;
  color?: string;
  usageCount?: number;
}

// Document
export interface Document {
  id: string;
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  fileUrl: string;
  folderId: string;
  folderPath: string;
  
  // Metadata
  title?: string;
  description?: string;
  tags?: DocumentTag[];
  
  // Ownership & Permissions
  ownerId: string;
  ownerName: string;
  permissions: DocumentPermission[];
  sharedLinks?: SharedLink[];
  
  // Dates
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  expiryDate?: Date;
  
  // Status
  status: DocumentStatus;
  isStarred?: boolean;
  
  // Relations
  relatedClientId?: string;
  relatedAuditId?: string;
  relatedContractId?: string;
  
  // Versioning
  currentVersion: number;
  versions?: DocumentVersion[];
  
  // Activity
  activityLog?: DocumentActivityLog[];
  comments?: DocumentComment[];
  
  // Tracking
  viewCount?: number;
  downloadCount?: number;
  lastAccessedAt?: Date;
  lastAccessedBy?: string;
}

// Folder
export interface Folder {
  id: string;
  name: string;
  parentFolderId?: string;
  parentFolderPath?: string;
  description?: string;
  
  // Ownership & Permissions
  ownerId: string;
  ownerName: string;
  permissions: DocumentPermission[];
  
  // Dates
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  
  // Statistics
  documentCount?: number;
  subfolderCount?: number;
  totalSize?: number;
  
  // Color coding
  color?: string;
  icon?: string;
}

// Document Library Stats
export interface DocumentLibraryStats {
  totalDocuments: number;
  totalSize: number;
  storageUsagePercentage: number;
  addedThisMonth: number;
  expiringDocuments: number;
  pendingAccessRequests: number;
}

// Document Search Result
export interface DocumentSearchResult {
  document: Document;
  relevanceScore: number;
  matchedFields: string[];
  snippet?: string;
}

// Document Filter Options
export interface DocumentFilters {
  documentType?: DocumentType[];
  status?: DocumentStatus[];
  folderId?: string;
  clientId?: string;
  auditId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchTerm?: string;
  sortBy?: "name" | "date-modified" | "date-created" | "size" | "relevance";
  sortOrder?: "asc" | "desc";
}

// Document Upload Options
export interface DocumentUploadOptions {
  destinationFolderId: string;
  relatedClientId?: string;
  relatedAuditId?: string;
  relatedContractId?: string;
  tags?: string[];
  permissions?: "inherit-from-folder" | "custom";
  customPermissions?: Omit<DocumentPermission, "id" | "documentId" | "grantedBy" | "grantedAt">[];
  expiryDate?: Date;
  sendReminderBeforeExpiry?: boolean;
  reminderDays?: number;
  extractTextForSearch?: boolean;
  generateThumbnail?: boolean;
  notifyTeamMembers?: boolean;
  addToClientPortal?: boolean;
}

// Document Bulk Action
export interface DocumentBulkAction {
  action: "move" | "delete" | "share" | "download" | "archive" | "restore";
  documentIds: string[];
  targetFolderId?: string;
  permissions?: DocumentPermission[];
  notifyUsers?: boolean;
}

