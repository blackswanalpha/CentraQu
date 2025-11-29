"use client";

import React from 'react';
import { Save, Eye, Share2, Download } from 'lucide-react';
import { Template } from '@/services/template.service';

interface TemplateHeaderProps {
    template: Template;
    onSave: () => void;
    onPublish: () => void;
    isSaving: boolean;
    onPreview?: () => void;
    onDownloadPDF?: () => void;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({
    template,
    onSave,
    onPublish,
    isSaving,
    onPreview,
    onDownloadPDF
}) => {
    return (
        <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-6 h-16">
            <div className="flex items-center gap-4">
                <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor" />
                    </svg>
                </div>
                <div className="flex items-center gap-2">
                    <a className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary" href="/template">
                        Templates
                    </a>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">/</span>
                    <span className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">
                        {template.title}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 justify-end items-center gap-4">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                    {isSaving ? 'Saving...' : template.updated_at ? `Last saved ${new Date(template.updated_at).toLocaleTimeString()}` : 'Auto-saving...'}
                </p>
                
                {onPreview && (
                    <button 
                        onClick={onPreview}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-subtle-light dark:bg-subtle-dark text-text-light dark:text-text-dark text-sm font-medium leading-normal tracking-[-0.01em] gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Preview template"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="truncate">Preview</span>
                    </button>
                )}

                {onDownloadPDF && (
                    <button 
                        onClick={onDownloadPDF}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-green-600 text-white text-sm font-medium leading-normal tracking-[-0.01em] gap-2 hover:bg-green-700 transition-colors"
                        title="Download as PDF"
                    >
                        <Download className="w-4 h-4" />
                        <span className="truncate">PDF</span>
                    </button>
                )}

                <button 
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-subtle-light dark:bg-subtle-dark text-text-light dark:text-text-dark text-sm font-medium leading-normal tracking-[-0.01em] gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save template"
                >
                    <Save className="w-4 h-4" />
                    <span className="truncate">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>

                <button 
                    onClick={onPublish}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-primary text-white text-sm font-medium leading-normal tracking-[-0.01em] gap-2 hover:bg-primary/90 transition-colors"
                    title="Publish template"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="truncate">
                        {template.is_published ? 'Update' : 'Publish'}
                    </span>
                </button>
                
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9" 
                     style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8fPZhcBxTw-zbcgOR8H4hLQimwxrli6W0A1GiXxd9QjHbcZWY9Afn83xBZM4sMS13s7VP1GBOPET9p3hq_qK1nK49TpZpaV7QR6LF3a-dVPpDEmCCOzyxiHxBUp3gCdVIzDV-zcOZzYX-qdYg3uX81_5mtM06JwOrdGEtprwSeDmbu6zEhLl8Q-f9sz2QnfJg6XzpZsb1zIzrm854Ulf9S2TWCuSF6fKekoP-Yt8BRK_lZjgwM9jYyhJEJU7aDZs4dEv69G0YIHI0")'}}
                />
            </div>
        </header>
    );
};