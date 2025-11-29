"use client";

import React, { useState } from "react";
import { contractService } from "@/services/contract.service";

export default function TestIntegrationPage() {
    const [status, setStatus] = useState<string>("");
    const [templates, setTemplates] = useState<any[]>([]);

    const testCreateTemplate = async () => {
        setStatus("Creating test template...");
        try {
            const mockTemplateData = {
                id: `test-template-${Date.now()}`,
                title: "Test Certification Contract",
                description: "Test template created from integration test",
                type: "contract",
                pages: [
                    {
                        id: "page-1",
                        title: "Test Page",
                        content: "<h1>Test Contract</h1>",
                        sections: [],
                        images: [],
                        layers: []
                    }
                ],
                metadata: {
                    templateType: "CERTIFICATION_CONTRACT",
                    contractData: {
                        companyName: "Test Company",
                        clientName: "Test Client",
                        initialCertificationCost: 5000,
                        firstSurveillanceCost: 3000,
                        secondSurveillanceCost: 3000,
                        recertificationCost: 4000
                    }
                }
            };

            const response = await contractService.createContractTemplate(mockTemplateData);
            
            if (response.success) {
                setStatus(`✅ Template created successfully! ID: ${response.data.id}`);
            } else {
                setStatus(`❌ Failed to create template`);
            }
        } catch (error) {
            setStatus(`❌ Error: ${error}`);
        }
    };

    const testListTemplates = async () => {
        setStatus("Fetching templates...");
        try {
            const response = await contractService.getContractTemplates();
            
            if (response.success) {
                setTemplates(response.data);
                setStatus(`✅ Found ${response.data.length} templates`);
            } else {
                setStatus(`❌ Failed to fetch templates`);
            }
        } catch (error) {
            setStatus(`❌ Error: ${error}`);
        }
    };

    const testGenerateContract = async (templateId: string) => {
        setStatus(`Generating contract from template ${templateId}...`);
        try {
            const response = await contractService.generateContractFromTemplate(templateId, {
                contract_data: {
                    clientName: "Generated Client",
                    serviceScope: "ISO 9001:2015 Certification"
                }
            });
            
            if (response.success) {
                setStatus(`✅ Contract generated! ID: ${response.data.contract_id}, Number: ${response.data.contract_number}`);
            } else {
                setStatus(`❌ Failed to generate contract`);
            }
        } catch (error) {
            setStatus(`❌ Error: ${error}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Contract Template Integration Test</h1>
            
            <div className="space-y-4 mb-6">
                <button
                    onClick={testCreateTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Test Create Template
                </button>
                
                <button
                    onClick={testListTemplates}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4"
                >
                    Test List Templates
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Status:</h3>
                <p>{status || "Ready to test..."}</p>
            </div>

            {templates.length > 0 && (
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Available Templates:</h3>
                    <div className="space-y-2">
                        {templates.map((template) => (
                            <div key={template.id} className="border p-3 rounded flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium">{template.name}</h4>
                                    <p className="text-sm text-gray-600">Type: {template.template_type}</p>
                                    <p className="text-sm text-gray-600">ID: {template.template_id}</p>
                                </div>
                                <button
                                    onClick={() => testGenerateContract(template.template_id)}
                                    className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                                >
                                    Generate Contract
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}