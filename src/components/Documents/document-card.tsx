"use client";

import { Document } from "@/types/document";
import { Document as APIDocument } from "@/services/document.service";
import { Button } from "@/components/Dashboard/button";
import Link from "next/link";

interface DocumentCardProps {
  document: Document | APIDocument;
  onDelete?: (id: string | number) => void;
  onShare?: (id: string | number) => void;
  onDownload?: (id: string | number) => void;
}

const getFileIcon = (fileType: string) => {
  const icons: Record<string, string> = {
    pdf: "📄",
    word: "📝",
    excel: "📊",
    powerpoint: "🎯",
    image: "🖼️",
    video: "🎬",
    audio: "🎵",
    archive: "📦",
    other: "📁",
  };
  return icons[fileType] || "📄";
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Helper to check if document is from API
function isAPIDocument(doc: Document | APIDocument): doc is APIDocument {
  return 'file_name' in doc;
}

// Helper to get file extension from filename
function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'other';
  // Map extensions to types
  const typeMap: Record<string, string> = {
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'xls': 'excel',
    'xlsx': 'excel',
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'mp4': 'video',
    'avi': 'video',
    'mp3': 'audio',
    'wav': 'audio',
    'zip': 'archive',
    'rar': 'archive',
  };
  return typeMap[ext] || 'other';
}

export function DocumentCard({
  document,
  onDelete,
  onShare,
  onDownload,
}: DocumentCardProps) {
  // Extract data based on format
  const fileName = isAPIDocument(document) ? document.file_name : document.fileName;
  const fileSize = isAPIDocument(document) ? document.file_size : document.fileSize;
  const fileType = isAPIDocument(document)
    ? getFileExtension(document.file_name)
    : document.fileType;
  const updatedAt = isAPIDocument(document) ? document.updated_at : document.updatedAt;
  const updatedBy = isAPIDocument(document) ? document.owner_name : document.updatedBy;
  const expiryDate = isAPIDocument(document) ? document.expiry_date : document.expiryDate;
  const docId = document.id;

  const isExpiringSoon =
    expiryDate &&
    new Date(expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl">{getFileIcon(fileType)}</span>
          <div className="min-w-0 flex-1">
            <Link href={`/documents/${docId}`}>
              <h3 className="font-semibold text-dark dark:text-white truncate hover:text-primary">
                {fileName}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(fileSize)}
            </p>
          </div>
        </div>
        {isExpiringSoon && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            ⚠️ Expiring
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
        <p>Modified: {new Date(updatedAt).toLocaleDateString()}</p>
        <p>by {updatedBy}</p>
      </div>

      {/* Tags - Only show for old format */}
      {!isAPIDocument(document) && document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {document.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
            >
              {tag.name}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{document.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/documents/${docId}`} className="flex-1">
          <Button variant="ghost" size="sm" fullWidth>
            Open
          </Button>
        </Link>
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(docId)}
          >
            ⬇️
          </Button>
        )}
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(docId)}
          >
            🔗
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(docId)}
          >
            🗑️
          </Button>
        )}
      </div>
    </div>
  );
}

