"use client";

import { Folder } from "@/types/document";
import { useState } from "react";
import Link from "next/link";

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId?: string;
  onSelectFolder?: (folderId: string) => void;
}

const folderColors: Record<string, string> = {
  Finance: "text-blue-600",
  Marketing: "text-purple-600",
  Auditors: "text-red-600",
  HR: "text-green-600",
  Clients: "text-orange-600",
  Templates: "text-gray-600",
};

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(folders.map((f) => f.id))
  );

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSelectFolder = (folderId: string) => {
    onSelectFolder?.(folderId);
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const hasSubfolders = (folder.subfolderCount || 0) > 0;
    const colorClass = folderColors[folder.name] || "text-gray-600";

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
            isSelected
              ? "bg-primary/10 text-primary"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => handleSelectFolder(folder.id)}
        >
          {hasSubfolders && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white"
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          {!hasSubfolders && <span className="w-4" />}
          <span className={`text-lg ${colorClass}`}>📁</span>
          <span className="flex-1 text-sm font-medium truncate">
            {folder.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({folder.documentCount || 0})
          </span>
        </div>

        {/* Subfolders */}
        {isExpanded && hasSubfolders && (
          <div>
            {/* Placeholder for subfolders - would be populated from nested data */}
            <div
              className="text-xs text-gray-500 px-3 py-1"
              style={{ paddingLeft: `${(level + 1) * 16 + 12}px` }}
            >
              {folder.subfolderCount} subfolder{folder.subfolderCount !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-dark dark:text-white mb-3">Folders</h3>
      <div className="space-y-1">
        {folders.map((folder) => renderFolder(folder))}
      </div>
      <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
        [EXPAND ALL]
      </button>
    </div>
  );
}

