"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Client } from "@/types/audit";

export default function NewOpportunityPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    // Step 1: Company Information
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    address: "",
    city: "",
    country: "Kenya",
    
    // Step 2: Opportunity Details
    opportunityName: "",
    serviceType: "",
    estimatedValue: "",
    probability: 50,
    expectedCloseDate: "",
    stage: "Discovery",
    priority: "Medium",
    source: "",
    
    // Step 3: Contact & Additional Info
    primaryContact: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    assignedTo: "",
    description: "",
    nextSteps: "",
    competitors: "",
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const industries = [
    "Financial Services",
    "Manufacturing",
    "Healthcare",
    "Technology",
    "Retail",
    "Education",
    "Government",
    "Energy",
    "Telecommunications",
    "Other",
  ];

  const serviceTypes = [
    "Strategy Consulting",
    "Digital Transformation",
    "Process Optimization",
    "Change Management",
    "Risk Management",
    "IT Consulting",
    "HR Consulting",
    "Financial Advisory",
    "Operations Consulting",
    "Custom Engagement",
  ];

  const sources = [
    "Referral",
    "Website",
    "LinkedIn",
    "Event/Conference",
    "Cold Outreach",
    "RFP",
    "Existing Client",
    "Partner",
    "Other",
  ];

  const consultants = [
    "James Kennedy",
    "Sarah Mitchell",
    "Linda Peterson",
    "Michael Roberts",
    "Emma Thompson",
  ];

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setClients(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

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
    console.log("Creating opportunity...", formData);
    // Handle opportunity creation
    router.push("/consulting/business-development/opportunities");
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
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
              ← Back to Opportunities
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              NEW OPPORTUNITY
            </h1>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-dark dark:text-white">
              CREATE NEW SALES OPPORTUNITY
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
          
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-4">
            <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Company Info</span>
            </div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Opportunity Details</span>
            </div>
            <div className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Contact & Additional</span>
            </div>
          </div>
        </div>

        {/* Step 1: Company Information */}
        {currentStep === 1 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              COMPANY INFORMATION
            </h3>

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Company Name *
                </label>
                <select
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.filter(client => client.status === 'active').map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Select from existing clients or add a new client first
                </p>
              </div>

              {/* Industry & Company Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateFormData("industry", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => updateFormData("companySize", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://www.example.com"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Street address"
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Nairobi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Quick Search Existing Companies */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  💡 Quick Tip
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Check if this company already exists in your client database to avoid duplicates.
                </p>
                <button className="mt-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                  SEARCH EXISTING COMPANIES
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Opportunity Details */}
        {currentStep === 2 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              OPPORTUNITY DETAILS
            </h3>

            <div className="space-y-6">
              {/* Opportunity Name */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Opportunity Name *
                </label>
                <input
                  type="text"
                  value={formData.opportunityName}
                  onChange={(e) => updateFormData("opportunityName", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Digital Transformation Initiative"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Suggested format: [Company Name] - [Service Type]
                </p>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Service Type *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => updateFormData("serviceType", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Service</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Value & Probability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Estimated Value (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => updateFormData("estimatedValue", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Probability (%) *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.probability}
                      onChange={(e) => updateFormData("probability", parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">0%</span>
                      <span className="font-semibold text-blue-600">{formData.probability}%</span>
                      <span className="text-gray-600 dark:text-gray-400">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expected Close Date */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Expected Close Date *
                </label>
                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => updateFormData("expectedCloseDate", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Stage, Priority, Source */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Stage *
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => updateFormData("stage", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Discovery">Discovery</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => updateFormData("priority", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Source *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => updateFormData("source", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Source</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weighted Value Calculation */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
                <p className="text-sm font-medium text-dark dark:text-white mb-2">
                  Weighted Forecast Value
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${((parseFloat(formData.estimatedValue) || 0) * (formData.probability / 100)).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on {formData.probability}% probability
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Additional Information */}
        {currentStep === 3 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-6">
              CONTACT & ADDITIONAL INFORMATION
            </h3>

            <div className="space-y-6">
              {/* Primary Contact */}
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">Primary Contact</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      value={formData.primaryContact}
                      onChange={(e) => updateFormData("primaryContact", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Title/Position
                    </label>
                    <input
                      type="text"
                      value={formData.contactTitle}
                      onChange={(e) => updateFormData("contactTitle", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., CEO, CTO, Operations Manager"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData("contactEmail", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData("contactPhone", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Assign To *
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => updateFormData("assignedTo", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Consultant</option>
                  {consultants.map((consultant) => (
                    <option key={consultant} value={consultant}>
                      {consultant}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  This consultant will be responsible for managing this opportunity
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Opportunity Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Describe the client's needs, challenges, and what they're looking to achieve..."
                />
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Next Steps
                </label>
                <textarea
                  value={formData.nextSteps}
                  onChange={(e) => updateFormData("nextSteps", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="What are the immediate next steps? (e.g., Schedule discovery call, Send proposal, etc.)"
                />
              </div>

              {/* Competitors */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Known Competitors
                </label>
                <input
                  type="text"
                  value={formData.competitors}
                  onChange={(e) => updateFormData("competitors", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Deloitte, McKinsey, Local Firm XYZ"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate multiple competitors with commas
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                  Opportunity Summary
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400">Company:</p>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      {formData.companyName || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-400">Service:</p>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      {formData.serviceType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-400">Estimated Value:</p>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      ${formData.estimatedValue ? parseFloat(formData.estimatedValue).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-400">Weighted Value:</p>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      ${((parseFloat(formData.estimatedValue) || 0) * (formData.probability / 100)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-400">Expected Close:</p>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      {formData.expectedCloseDate || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-400">Assigned To:</p>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      {formData.assignedTo || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Send notification to assigned consultant
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Add to my watchlist
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Schedule follow-up reminder (7 days)
                  </span>
                </label>
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
          <div className="flex gap-3">
            {currentStep === totalSteps && (
              <button
                onClick={() => console.log("Save as draft")}
                className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                SAVE AS DRAFT
              </button>
            )}
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
                className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
              >
                CREATE OPPORTUNITY
              </button>
            )}
          </div>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

