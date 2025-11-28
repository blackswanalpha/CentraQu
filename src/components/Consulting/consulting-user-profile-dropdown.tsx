"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDownIcon, LogOutIcon, SettingsIconSmall } from "../Layouts/header-icons";
import { UserIcon } from "../Layouts/sidebar-icons";
import { LogoutConfirmationModal } from "./logout-confirmation-modal";

export function ConsultingUserProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            // Redirect to consulting login page
            router.push("/consulting/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    // Show loading state if user data is not available
    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
        );
    }

    const displayName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email.split("@")[0];
    const displayRole = user.profile?.role || "Consultant";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-900"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {displayRole}
                        </p>
                    </div>
                    <ChevronDownIcon
                        className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {/* User Info Section */}
                    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                <UserIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {displayName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                                    {displayRole}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            href="/consulting/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <SettingsIconSmall className="w-4 h-4" />
                            <span>Account Settings</span>
                        </Link>

                        <Link
                            href="/consulting/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Dashboard</span>
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                        <button
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOutIcon className="w-4 h-4" />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <LogoutConfirmationModal
                isOpen={showLogoutModal}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
                isLoading={isLoggingOut}
            />
        </div>
    );
}
