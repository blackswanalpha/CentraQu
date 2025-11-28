"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}

export const SearchableSelect = ({
    label,
    error,
    hint,
    options,
    value,
    onChange,
    placeholder = "Select an option...",
    required,
    className,
    disabled = false,
}: SearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div className={cn("space-y-2", className)} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-dark dark:text-white">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 text-dark dark:text-white",
                        error
                            ? "border-red-500 focus:ring-red-500"
                            : isOpen
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-stroke dark:border-gray-700 hover:border-primary",
                        disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
                    )}
                >
                    <span className={cn(!selectedOption && "text-gray-500 dark:text-gray-400")}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center gap-2">
                        {value && !disabled && (
                            <div
                                onClick={handleClear}
                                className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </div>
                        )}
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 text-gray-500 transition-transform",
                                isOpen && "transform rotate-180"
                            )}
                        />
                    </div>
                </div>

                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-stroke dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-stroke dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-stroke dark:border-gray-700 rounded-md focus:outline-none focus:border-primary text-dark dark:text-white"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                                            String(option.value) === String(value)
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {option.label}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                                    No options found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            {hint && !error && (
                <p className="text-xs text-gray-600 dark:text-gray-400">{hint}</p>
            )}
        </div>
    );
};
