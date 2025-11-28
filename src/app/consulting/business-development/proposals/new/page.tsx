"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { useState } from "react";
import Link from "next/link";

export default function ProposalGeneratorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    linkToOpportunity: true,
    opportunityId: "OPP-2025-086",
    template: "standard",
    validUntil: "2025-12-05",
    version: "1.0",
    
    // Step 2
    clientChallenge: "",
    approach: "",
    deliverables: [],
    successMetrics: "",
    duration: 4,
    startDate: "2025-12-01",
    completionDate: "2026-03-31",
    
    // Step 3
    leadConsultant: "Linda Peterson",
    supportingConsultants: ["Emma Thompson"],
    pricingModel: "fixed",
    totalValue: 52000,
    
    // Step 4
    reviewed: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const opportunityData = {
    id: "OPP-2025-086",
    client: "KLM Enterprises",
    contact: "Michael Ochieng (COO)",
    email: "m.ochieng@klmenterprises.co.ke",
    service: "Process Optimization",
    estimatedValue: 52000,
    expectedDuration: 4,
  };

  const templates = [
    { id: "standard", name: "Standard Consulting Proposal", description: "General purpose consulting proposal" },
    { id: "process", name: "Process Optimization Proposal", description: "Specialized for process improvement projects" },
    { id: "digital", name: "Digital Transformation Proposal", description: "For digital transformation initiatives" },
    { id: "strategic", name: "Strategic Planning Proposal", description: "For strategic planning engagements" },
    { id: "change", name: "Change Management Proposal", description: "For organizational change projects" },
    { id: "custom", name: "Custom Proposal", description: "Start from scratch" },
  ];

  const deliverableOptions = [
    { id: "assessment", name: "Current State Assessment Report", format: "PDF Document, 40-50 pages", timeline: "End of Week 3" },
    { id: "roadmap", name: "Process Optimization Roadmap", format: "Interactive presentation + detailed document", timeline: "End of Week 7" },
    { id: "guide", name: "Implementation Guide & Playbook", format: "Detailed documentation with templates", timeline: "End of Week 12" },
    { id: "change", name: "Change Management Plan", format: "Strategy document with communication templates", timeline: "End of Week 10" },
    { id: "presentation", name: "Final Presentation to Executive Team", format: "Executive presentation (in-person)", timeline: "End of Week 16" },
  ];

  const consultants = [
    { id: "linda", name: "Linda Peterson", title: "Senior Consultant, Process Optimization", experience: "12 years", certs: "Lean Six Sigma Black Belt, PMP" },
    { id: "emma", name: "Emma Thompson", title: "Consultant, Data Analytics", experience: "4 years", skills: "Data analysis, process mining" },
    { id: "james", name: "James Kennedy", title: "Senior Consultant, Strategy", experience: "15 years", certs: "MBA, Certified Management Consultant" },
    { id: "sarah", name: "Sarah Mitchell", title: "Senior Consultant, Change Management", experience: "10 years", certs: "Prosci Certified Change Practitioner" },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Generating proposal...", formData);
    // Handle proposal generation
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/consulting/business-development/opportunities"
              className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
            >
              ← Back
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              PROPOSAL GENERATOR
            </h1>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-dark dark:text-white">
              CREATE CONSULTING PROPOSAL
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Opportunity & Template */}
        {currentStep === 1 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              SELECT OPPORTUNITY & TEMPLATE
            </h3>

            <div className="space-y-6">
              {/* Link to Opportunity */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-3">
                  Link to Opportunity? (Recommended)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.linkToOpportunity}
                      onChange={() => setFormData({ ...formData, linkToOpportunity: true })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Yes - Link to existing opportunity
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.linkToOpportunity}
                      onChange={() => setFormData({ ...formData, linkToOpportunity: false })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      No - Create standalone proposal
                    </span>
                  </label>
                </div>
              </div>

              {/* Select Opportunity */}
              {formData.linkToOpportunity && (
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Select Opportunity *
                  </label>
                  <select
                    value={formData.opportunityId}
                    onChange={(e) => setFormData({ ...formData, opportunityId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="OPP-2025-086">OPP-2025-086 - KLM Enterprises - Process Optimization</option>
                    <option value="OPP-2025-085">OPP-2025-085 - NOP Group - Change Management</option>
                    <option value="OPP-2025-084">OPP-2025-084 - STU Technologies - Digital Strategy</option>
                  </select>

                  {/* Opportunity Details Auto-Populated */}
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                    <p className="text-sm font-medium text-dark dark:text-white mb-2">
                      [Opportunity Details Auto-Populated:]
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Opportunity:</span>{" "}
                        <span className="text-dark dark:text-white">{opportunityData.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Client:</span>{" "}
                        <span className="text-dark dark:text-white">{opportunityData.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Contact:</span>{" "}
                        <span className="text-dark dark:text-white">{opportunityData.contact}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>{" "}
                        <span className="text-dark dark:text-white">{opportunityData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Service:</span>{" "}
                        <span className="text-dark dark:text-white">{opportunityData.service}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Estimated Value:</span>{" "}
                        <span className="text-dark dark:text-white">${opportunityData.estimatedValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Expected Duration:</span>{" "}
                        <span className="text-dark dark:text-white">{opportunityData.expectedDuration} months</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Proposal Template */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Proposal Template *
                </label>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <label key={template.id} className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 cursor-pointer">
                      <input
                        type="radio"
                        name="template"
                        value={template.id}
                        checked={formData.template === template.id}
                        onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <p className="font-medium text-dark dark:text-white">{template.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.template === "standard" && (
                  <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
                    <p className="text-sm font-medium text-dark dark:text-white mb-2">Template Preview:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Standard Consulting Proposal includes:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Executive Summary</li>
                      <li>• Understanding Your Challenge</li>
                      <li>• Our Approach and Methodology</li>
                      <li>• Scope of Work and Deliverables</li>
                      <li>• Project Timeline and Milestones</li>
                      <li>• Team and Qualifications</li>
                      <li>• Investment and Payment Terms</li>
                      <li>• Terms and Conditions</li>
                      <li>• Case Studies and References</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Proposal Valid Until */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Proposal Valid Until *
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                />
                <p className="text-sm text-gray-500 mt-1">(30 days default)</p>
              </div>

              {/* Proposal Version */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Proposal Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="1.0"
                />
                <p className="text-sm text-gray-500 mt-1">Version: 1.0 (Initial proposal)</p>
                <label className="flex items-center mt-2">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    This is a revised proposal (v2.0, v3.0, etc.)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Scope & Approach */}
        {currentStep === 2 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              PROJECT SCOPE & METHODOLOGY
            </h3>

            <div className="space-y-6">
              {/* Client Challenge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-dark dark:text-white">
                    Client Challenge/Objectives (AI-Assisted)
                  </label>
                  <button className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium dark:bg-purple-900 dark:text-purple-300">
                    ✨ AI SUGGEST
                  </button>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-900/20 mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    [Based on discovery notes from opportunity]
                  </p>
                  <p className="text-sm text-dark dark:text-white mb-3">
                    KLM Enterprises is experiencing operational inefficiencies in their supply chain management,
                    resulting in increased costs, delayed deliveries, and customer dissatisfaction. They seek to:
                  </p>
                  <ul className="text-sm text-dark dark:text-white space-y-1 mb-3">
                    <li>• Reduce operational costs by 25%</li>
                    <li>• Improve on-time delivery from 78% to 95%</li>
                    <li>• Streamline procurement and inventory processes</li>
                    <li>• Enhance visibility across the supply chain</li>
                    <li>• Build sustainable, scalable processes</li>
                  </ul>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg bg-white text-gray-700 text-sm font-medium border border-gray-200">
                      EDIT
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm font-medium">
                      ACCEPT AI SUGGESTION
                    </button>
                  </div>
                </div>
              </div>

              {/* Our Approach */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Our Approach & Methodology
                </label>
                <label className="flex items-center mb-3">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Use standard consulting methodology
                  </span>
                </label>
                <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <p className="text-sm text-dark dark:text-white mb-3">
                    We will employ our proven 4-phase Process Optimization Methodology:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-dark dark:text-white">Phase 1: Discovery & Assessment (3 weeks)</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                        <li>• Current state process mapping</li>
                        <li>• Stakeholder interviews and workshops</li>
                        <li>• Data collection and analysis</li>
                        <li>• Pain point identification</li>
                        <li>• Benchmark analysis</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-dark dark:text-white">Phase 2: Design & Planning (4 weeks)</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                        <li>• Future state process design</li>
                        <li>• Technology and tool recommendations</li>
                        <li>• Implementation roadmap development</li>
                        <li>• Change management strategy</li>
                        <li>• Risk assessment and mitigation plans</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium dark:bg-purple-900 dark:text-purple-300">
                      ✨ AI EXPAND
                    </button>
                    <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium dark:border-gray-600">
                      EDIT
                    </button>
                    <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium dark:border-gray-600">
                      ADD PHASE
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Deliverables */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-dark dark:text-white">
                    Key Deliverables
                  </label>
                  <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium">
                    + Add More
                  </button>
                </div>
                <div className="space-y-3">
                  {deliverableOptions.map((deliverable) => (
                    <label key={deliverable.id} className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <input type="checkbox" className="mr-3 mt-1" defaultChecked />
                      <div className="flex-1">
                        <p className="font-medium text-dark dark:text-white">{deliverable.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Format: {deliverable.format}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Timeline: {deliverable.timeline}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-dark dark:text-white">
                    Success Metrics & KPIs
                  </label>
                  <button className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium dark:bg-purple-900 dark:text-purple-300">
                    ✨ AI SUGGEST METRICS
                  </button>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <ul className="text-sm text-dark dark:text-white space-y-1">
                    <li>• 25% reduction in operational costs within 12 months</li>
                    <li>• 95% on-time delivery rate achievement</li>
                    <li>• 40% reduction in inventory carrying costs</li>
                    <li>• 30% improvement in procurement cycle time</li>
                    <li>• 90% stakeholder satisfaction with new processes</li>
                  </ul>
                  <button className="mt-3 px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium dark:border-gray-600">
                    EDIT
                  </button>
                </div>
              </div>

              {/* Project Duration */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Project Duration & Timeline
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Total Duration (months)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Completion</label>
                    <input
                      type="date"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Include detailed Gantt chart in proposal
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Include milestone schedule
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Team & Pricing */}
        {currentStep === 3 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              TEAM COMPOSITION & PRICING
            </h3>

            <div className="space-y-6">
              {/* Consulting Team */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-dark dark:text-white">
                    Consulting Team
                  </label>
                  <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
                    Auto-Assign
                  </button>
                </div>

                {/* Lead Consultant */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Lead Consultant *</label>
                  <select
                    value={formData.leadConsultant}
                    onChange={(e) => setFormData({ ...formData, leadConsultant: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 mb-2"
                  >
                    {consultants.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="text-sm text-dark dark:text-white">Title: Senior Consultant, Process Optimization</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Experience: 12 years | Certifications: Lean Six Sigma Black Belt, PMP</p>
                    <label className="flex items-center mt-2">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Include bio in proposal</span>
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Role: Project leadership, client relationship, strategy
                    </p>
                  </div>
                </div>

                {/* Supporting Consultants */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-600 dark:text-gray-400">Supporting Consultants</label>
                    <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium">
                      + Add Member
                    </button>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="text-sm text-dark dark:text-white font-medium">Emma Thompson</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Title: Consultant, Data Analytics</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Experience: 4 years | Skills: Data analysis, process mining</p>
                    <label className="flex items-center mt-2">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Include bio in proposal</span>
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Role: Data analysis, metrics development, reporting
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Structure */}
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">PRICING STRUCTURE</h4>

                {/* Pricing Model */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Pricing Model *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pricingModel"
                        value="fixed"
                        checked={formData.pricingModel === "fixed"}
                        onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Fixed Price (Recommended for defined scope)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="pricingModel" value="time" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Time & Materials (Hourly/daily rates)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="pricingModel" value="retainer" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Retainer (Monthly fee for ongoing services)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="pricingModel" value="value" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Value-Based (Tied to client outcomes)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Resource Allocation */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <p className="font-medium text-dark dark:text-white mb-3">Resource Allocation & Pricing</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 text-gray-600 dark:text-gray-400">Role</th>
                          <th className="text-left py-2 text-gray-600 dark:text-gray-400">Hours</th>
                          <th className="text-left py-2 text-gray-600 dark:text-gray-400">Rate</th>
                          <th className="text-left py-2 text-gray-600 dark:text-gray-400">Extended</th>
                          <th className="text-left py-2 text-gray-600 dark:text-gray-400">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-2 text-dark dark:text-white">Lead Consultant</td>
                          <td className="py-2 text-dark dark:text-white">240</td>
                          <td className="py-2 text-dark dark:text-white">$150/hr</td>
                          <td className="py-2 text-dark dark:text-white">$36,000</td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">Linda Peterson</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-2 text-dark dark:text-white">Consultant</td>
                          <td className="py-2 text-dark dark:text-white">160</td>
                          <td className="py-2 text-dark dark:text-white">$100/hr</td>
                          <td className="py-2 text-dark dark:text-white">$16,000</td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">Emma Thompson</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-dark dark:text-white">Project Manager</td>
                          <td className="py-2 text-dark dark:text-white">40</td>
                          <td className="py-2 text-dark dark:text-white">$120/hr</td>
                          <td className="py-2 text-dark dark:text-white">$4,800</td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">Coordination</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal Professional Fees:</span>
                      <span className="font-semibold text-dark dark:text-white">$56,800</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <p className="font-medium text-dark dark:text-white mb-2">Expenses (Estimated):</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">• Travel & accommodation:</span>
                        <span className="text-dark dark:text-white">$2,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">• Software/tools (if needed):</span>
                        <span className="text-dark dark:text-white">$0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">• Materials & documentation:</span>
                        <span className="text-dark dark:text-white">$800</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal Expenses:</span>
                        <span className="font-semibold text-dark dark:text-white">$3,200</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-dark dark:text-white">Total Project Value:</span>
                        <span className="font-bold text-lg text-blue-600">$60,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Discounts */}
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Apply discount:</span>
                      <input
                        type="number"
                        placeholder="10"
                        className="ml-2 w-16 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-sm"
                      />
                      <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">%</span>
                      <select className="ml-2 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-sm">
                        <option>Reason: First-time client</option>
                        <option>Volume discount</option>
                        <option>Strategic partnership</option>
                      </select>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Add contingency:</span>
                      <input
                        type="number"
                        placeholder="5"
                        className="ml-2 w-16 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-sm"
                      />
                      <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">% for scope changes</span>
                    </label>
                  </div>

                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-dark dark:text-white">Final Project Investment:</span>
                      <span className="font-bold text-2xl text-blue-600">$52,000</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">(13% discount applied)</p>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">PAYMENT TERMS</h4>
                <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">• 30% upon contract signature:</span>
                      <span className="text-dark dark:text-white font-medium">$15,600</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">• 40% upon Phase 2 completion:</span>
                      <span className="text-dark dark:text-white font-medium">$20,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">• 30% upon final delivery:</span>
                      <span className="text-dark dark:text-white font-medium">$15,600</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Payment terms:</span>
                      <span className="text-dark dark:text-white font-medium">Net 30 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Generate */}
        {currentStep === 4 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              REVIEW & GENERATE
            </h3>

            <div className="space-y-6">
              {/* Proposal Summary */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-6">
                <h4 className="font-semibold text-dark dark:text-white mb-4">Proposal Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Client:</p>
                    <p className="text-dark dark:text-white font-medium">{opportunityData.client}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Service:</p>
                    <p className="text-dark dark:text-white font-medium">{opportunityData.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Value:</p>
                    <p className="text-dark dark:text-white font-medium">${formData.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Duration:</p>
                    <p className="text-dark dark:text-white font-medium">{formData.duration} months</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Lead Consultant:</p>
                    <p className="text-dark dark:text-white font-medium">{formData.leadConsultant}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Valid Until:</p>
                    <p className="text-dark dark:text-white font-medium">{formData.validUntil}</p>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">Customization Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include company overview and credentials</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include relevant case studies</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include team bios and photos</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include client testimonials</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include detailed timeline/Gantt chart</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include risk assessment section</span>
                  </label>
                </div>
              </div>

              {/* Output Format */}
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">Output Format</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">PDF (Recommended for client delivery)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Word Document (Editable)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Both PDF and Word</span>
                  </label>
                </div>
              </div>

              {/* Branding */}
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">Branding & Design</h4>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                  <option>Standard Company Template</option>
                  <option>Premium Template (Executive)</option>
                  <option>Minimal Template (Clean)</option>
                  <option>Custom Template</option>
                </select>
              </div>

              {/* Final Review Checklist */}
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
                <h4 className="font-semibold text-dark dark:text-white mb-3">✓ Final Review Checklist</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.reviewed}
                      onChange={(e) => setFormData({ ...formData, reviewed: e.target.checked })}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      I have reviewed all proposal details and they are accurate
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Pricing and payment terms are correct
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Team assignments are confirmed
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Timeline and deliverables are realistic
                    </span>
                  </label>
                </div>
              </div>

              {/* Generation Options */}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
                  GENERATE PROPOSAL
                </button>
                <button className="px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  SAVE AS DRAFT
                </button>
                <button className="px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  PREVIEW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            BACK
          </button>
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              NEXT STEP
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.reviewed}
              className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              GENERATE PROPOSAL
            </button>
          )}
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

