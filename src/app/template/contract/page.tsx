"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createServiceContractTemplate } from "@/components/TemplateBuilder/exampleTemplates";

export default function ContractTemplatePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to builder with template type
        router.push('/template/builder?type=certification-contract');
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading contract template...</p>
            </div>
        </div>
    );
}