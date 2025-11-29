import { Template, TemplatePage, VisualSection, TemplateItem, FormElement, defaultTemplateSettings } from '@/services/template.service';

export interface ContractTemplateConfig {
  title: string;
  description: string;
  type: 'certification' | 'service' | 'consulting' | 'maintenance';
  pages: ContractPageConfig[];
  variables: ContractVariable[];
}

export interface ContractPageConfig {
  pageNumber: number;
  title: string;
  layout: 'image-text' | 'form-data' | 'editor-content';
  sections: ContractSectionConfig[];
}

export interface ContractSectionConfig {
  id: string;
  title: string;
  type: 'image' | 'text' | 'form' | 'editor' | 'fee-structure';
  content?: string;
  formFields?: FormFieldConfig[];
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface ContractVariable {
  name: string;
  description: string;
  type: 'text' | 'date' | 'currency' | 'number';
  defaultValue?: string;
}

// ISO Certification Contract Template
export const createISO9001CertificationContract = (): Template => {
  // Page 1: Cover page with AI-generated image and text
  const page1: TemplatePage = {
    id: 'page-1',
    title: 'Contract Cover Page',
    order: 0,
    content: '',
    sections: [
      // AI Generated Image Section (Left side)
      {
        id: 'section-cover-image',
        title: 'Contract Cover Image',
        description: 'AI-generated professional contract cover image',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 400, height: 600 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#f8fafc',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 20,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #1e40af; font-size: 28px; font-weight: bold; margin-bottom: 20px;">
              ISO 9001:2015 CERTIFICATION
            </h1>
            <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin: 20px 0;">
              Professional Certification Services
            </div>
            <p style="font-size: 16px; color: #4b5563; margin-top: 20px;">
              Quality Management System Certification
            </p>
          </div>
        `,
        items: []
      },
      // Contract Title and Basic Info (Right side)
      {
        id: 'section-cover-text',
        title: 'Contract Information',
        description: 'Contract title and basic information',
        order: 1,
        position: { x: 500, y: 50 },
        size: { width: 400, height: 600 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 20,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 30px;">
            ISO 9001:2015 CERTIFICATION CONTRACT
          </h2>
          
          <div style="margin-bottom: 20px;">
            <strong>Contract Number:</strong> {contract_number}<br>
            <strong>Date:</strong> {contract_date}<br>
            <strong>Valid Until:</strong> {contract_end_date}
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 10px;">Client Information</h3>
            <strong>Company:</strong> {client_name}<br>
            <strong>Contact:</strong> {client_contact}<br>
            <strong>Email:</strong> {client_email}<br>
            <strong>Phone:</strong> {client_phone}
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 10px;">Certification Details</h3>
            <strong>Standard:</strong> ISO 9001:2015<br>
            <strong>Scope:</strong> {certification_scope}<br>
            <strong>Sites:</strong> {number_of_sites}
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <strong>Total Investment:</strong> {total_contract_value}
          </div>
        `,
        items: []
      }
    ],
    images: [],
    layers: []
  };

  // Page 2: Contract period and parties details (Form data)
  const page2: TemplatePage = {
    id: 'page-2',
    title: 'Contract Parties & Timeline',
    order: 1,
    content: '<h1 style="text-align: center; margin-bottom: 30px;">CONTRACT PARTIES & TIMELINE</h1>',
    sections: [
      // Owner/Provider Details Section
      {
        id: 'section-owner-details',
        title: 'Service Provider Details',
        description: 'Information about the certification body',
        order: 0,
        position: { x: 50, y: 100 },
        size: { width: 400, height: 350 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 20,
          shadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        items: [
          {
            id: 'provider-company-name',
            type: 'text' as FormElement['type'],
            label: 'Certification Body Name',
            name: 'provider_company',
            required: true,
            placeholder: 'Enter certification body name'
          },
          {
            id: 'provider-address',
            type: 'textarea' as FormElement['type'],
            label: 'Business Address',
            name: 'provider_address',
            required: true,
            placeholder: 'Enter complete business address'
          },
          {
            id: 'provider-contact',
            type: 'text' as FormElement['type'],
            label: 'Primary Contact Person',
            name: 'provider_contact',
            required: true,
            placeholder: 'Contact person name and title'
          },
          {
            id: 'provider-email',
            type: 'email' as FormElement['type'],
            label: 'Email Address',
            name: 'provider_email',
            required: true,
            placeholder: 'business@example.com'
          },
          {
            id: 'provider-phone',
            type: 'text' as FormElement['type'],
            label: 'Phone Number',
            name: 'provider_phone',
            required: true,
            placeholder: '+1 (555) 123-4567'
          }
        ]
      },
      // Client Details Section
      {
        id: 'section-client-details',
        title: 'Client Details',
        description: 'Information about the client organization',
        order: 1,
        position: { x: 500, y: 100 },
        size: { width: 400, height: 350 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#10b981',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 20,
          shadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        items: [
          {
            id: 'client-company-name',
            type: 'text' as FormElement['type'],
            label: 'Client Company Name',
            name: 'client_company',
            required: true,
            placeholder: 'Enter client company name'
          },
          {
            id: 'client-industry',
            type: 'text' as FormElement['type'],
            label: 'Industry/Sector',
            name: 'client_industry',
            required: true,
            placeholder: 'e.g., Manufacturing, Healthcare, IT'
          },
          {
            id: 'client-size',
            type: 'select' as FormElement['type'],
            label: 'Company Size',
            name: 'client_size',
            required: true,
            options: ['Small (1-50 employees)', 'Medium (51-250 employees)', 'Large (251-1000 employees)', 'Enterprise (1000+ employees)']
          },
          {
            id: 'client-contact-person',
            type: 'text' as FormElement['type'],
            label: 'Contact Person',
            name: 'client_contact_person',
            required: true,
            placeholder: 'Primary contact name'
          },
          {
            id: 'client-position',
            type: 'text' as FormElement['type'],
            label: 'Position/Title',
            name: 'client_position',
            required: true,
            placeholder: 'Job title or position'
          }
        ]
      },
      // Contract Timeline Section
      {
        id: 'section-timeline',
        title: 'Contract Timeline',
        description: 'Important dates and milestones',
        order: 2,
        position: { x: 275, y: 500 },
        size: { width: 400, height: 250 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 20,
          shadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        items: [
          {
            id: 'contract-start-date',
            type: 'date' as FormElement['type'],
            label: 'Contract Start Date',
            name: 'contract_start_date',
            required: true
          },
          {
            id: 'contract-end-date',
            type: 'date' as FormElement['type'],
            label: 'Contract End Date',
            name: 'contract_end_date',
            required: true
          },
          {
            id: 'audit-start-date',
            type: 'date' as FormElement['type'],
            label: 'Initial Audit Date',
            name: 'audit_start_date',
            required: true
          },
          {
            id: 'certification-target-date',
            type: 'date' as FormElement['type'],
            label: 'Target Certification Date',
            name: 'certification_target_date',
            required: true
          }
        ]
      }
    ],
    images: [],
    layers: []
  };

  // Page 3-10: Detailed contract sections
  const pages3to10: TemplatePage[] = [
    // Page 3: Introduction
    {
      id: 'page-3',
      title: 'Introduction',
      order: 2,
      content: '',
      sections: [{
        id: 'section-introduction',
        title: 'Introduction',
        description: 'Contract introduction and overview',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 600 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 30px;">
            1. INTRODUCTION
          </h2>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            This ISO 9001:2015 Quality Management System Certification Agreement ("Agreement") is entered into on <strong>{contract_date}</strong> 
            between <strong>{provider_company}</strong> ("Certification Body") and <strong>{client_company}</strong> ("Organization").
          </p>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            The purpose of this agreement is to establish the terms and conditions under which the Certification Body will provide 
            ISO 9001:2015 Quality Management System certification services to the Organization.
          </p>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            1.1 Scope of Certification
          </h3>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            The certification will cover the Organization's Quality Management System as it relates to: <strong>{certification_scope}</strong>
          </p>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            1.2 Applicable Standards
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>ISO 9001:2015 - Quality Management Systems - Requirements</li>
            <li>ISO/IEC 17021-1:2015 - Conformity assessment - Requirements for bodies providing audit and certification</li>
            <li>IAF MD1:2018 - IAF Mandatory Document for the Application of ISO/IEC 17021-1</li>
          </ul>
          
          <div style="background: #eff6ff; padding: 20px; border-left: 4px solid #3b82f6; margin-top: 30px;">
            <p style="margin: 0; font-style: italic; color: #1e40af;">
              <strong>Note:</strong> This certification process will be conducted in accordance with international standards 
              and accreditation requirements to ensure global recognition of the certificate.
            </p>
          </div>
        `,
        items: []
      }],
      images: [],
      layers: []
    },

    // Page 4: Client Details (Form Data)
    {
      id: 'page-4',
      title: 'Client Details',
      order: 3,
      content: '<h1 style="text-align: center; margin-bottom: 30px;">CLIENT ORGANIZATION DETAILS</h1>',
      sections: [{
        id: 'section-client-form',
        title: 'Organization Information Form',
        description: 'Detailed client information collection',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 700 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#f9fafb',
          borderColor: '#6366f1',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        items: [
          {
            id: 'org-legal-name',
            type: 'text' as FormElement['type'],
            label: 'Legal Organization Name',
            name: 'org_legal_name',
            required: true,
            placeholder: 'Full legal name as registered'
          },
          {
            id: 'org-trading-name',
            type: 'text' as FormElement['type'],
            label: 'Trading/Brand Name (if different)',
            name: 'org_trading_name',
            required: false,
            placeholder: 'Trading or brand name'
          },
          {
            id: 'org-registration-number',
            type: 'text' as FormElement['type'],
            label: 'Business Registration Number',
            name: 'org_registration_number',
            required: true,
            placeholder: 'Company registration number'
          },
          {
            id: 'org-address',
            type: 'textarea' as FormElement['type'],
            label: 'Head Office Address',
            name: 'org_address',
            required: true,
            placeholder: 'Complete address including postal code'
          },
          {
            id: 'org-website',
            type: 'text' as FormElement['type'],
            label: 'Website URL',
            name: 'org_website',
            required: false,
            placeholder: 'https://www.example.com'
          },
          {
            id: 'org-employees-count',
            type: 'number' as FormElement['type'],
            label: 'Total Number of Employees',
            name: 'org_employees_count',
            required: true,
            placeholder: 'Total employee count'
          },
          {
            id: 'org-annual-revenue',
            type: 'select' as FormElement['type'],
            label: 'Annual Revenue Range',
            name: 'org_annual_revenue',
            required: true,
            options: [
              'Under $1M',
              '$1M - $10M',
              '$10M - $50M',
              '$50M - $100M',
              'Over $100M',
              'Prefer not to disclose'
            ]
          },
          {
            id: 'org-quality-manager',
            type: 'text' as FormElement['type'],
            label: 'Quality Manager/Representative Name',
            name: 'org_quality_manager',
            required: true,
            placeholder: 'Name of quality manager or representative'
          },
          {
            id: 'org-quality-manager-email',
            type: 'email' as FormElement['type'],
            label: 'Quality Manager Email',
            name: 'org_quality_manager_email',
            required: true,
            placeholder: 'quality.manager@company.com'
          }
        ]
      }],
      images: [],
      layers: []
    },

    // Page 5: Scope of Work (Form Data)
    {
      id: 'page-5',
      title: 'Scope of Work',
      order: 4,
      content: '<h1 style="text-align: center; margin-bottom: 30px;">SCOPE OF WORK & REQUIREMENTS</h1>',
      sections: [{
        id: 'section-scope-form',
        title: 'Certification Scope Definition',
        description: 'Define the scope and requirements for certification',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 700 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#f0f9ff',
          borderColor: '#0ea5e9',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        items: [
          {
            id: 'scope-business-activities',
            type: 'textarea' as FormElement['type'],
            label: 'Business Activities to be Covered',
            name: 'scope_business_activities',
            required: true,
            placeholder: 'Describe the business activities and processes to be included in the QMS scope'
          },
          {
            id: 'scope-products-services',
            type: 'textarea' as FormElement['type'],
            label: 'Products and/or Services',
            name: 'scope_products_services',
            required: true,
            placeholder: 'List the products and/or services covered by the QMS'
          },
          {
            id: 'scope-locations',
            type: 'textarea' as FormElement['type'],
            label: 'Locations/Sites to be Certified',
            name: 'scope_locations',
            required: true,
            placeholder: 'List all locations/sites to be included in the certification'
          },
          {
            id: 'scope-exclusions',
            type: 'textarea' as FormElement['type'],
            label: 'Exclusions (if any)',
            name: 'scope_exclusions',
            required: false,
            placeholder: 'Any exclusions from ISO 9001:2015 requirements with justification'
          },
          {
            id: 'scope-current-certification',
            type: 'select' as FormElement['type'],
            label: 'Current Certification Status',
            name: 'scope_current_certification',
            required: true,
            options: [
              'First-time certification',
              'Transfer from another certification body',
              'Upgrading from ISO 9001:2008',
              'Recertification'
            ]
          },
          {
            id: 'scope-qms-implementation-date',
            type: 'date' as FormElement['type'],
            label: 'QMS Implementation Date',
            name: 'scope_qms_implementation_date',
            required: true
          },
          {
            id: 'scope-internal-audit-status',
            type: 'select' as FormElement['type'],
            label: 'Internal Audit Status',
            name: 'scope_internal_audit_status',
            required: true,
            options: [
              'Complete internal audit cycle completed',
              'Partial internal audit completed',
              'Internal audit planned',
              'No internal audit conducted'
            ]
          },
          {
            id: 'scope-management-review-status',
            type: 'select' as FormElement['type'],
            label: 'Management Review Status',
            name: 'scope_management_review_status',
            required: true,
            options: [
              'Management review completed',
              'Management review planned',
              'No management review conducted'
            ]
          }
        ]
      }],
      images: [],
      layers: []
    },

    // Page 6: Certification Process (Written in Visual Canvas)
    {
      id: 'page-6',
      title: 'Certification Process',
      order: 5,
      content: '',
      sections: [{
        id: 'section-cert-process',
        title: 'Certification Process',
        description: 'Detailed certification process and methodology',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 700 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 30px;">
            2. CERTIFICATION PROCESS
          </h2>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            The certification process will be conducted in accordance with ISO/IEC 17021-1:2015 and consists of the following stages:
          </p>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            2.1 Application Review
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Review of application and supporting documentation</li>
            <li>Confirmation of scope and applicable standards</li>
            <li>Assessment of audit time requirements</li>
            <li>Assignment of audit team</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            2.2 Stage 1 Audit (Documentation Review)
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Review of QMS documentation and procedures</li>
            <li>Verification of readiness for Stage 2 audit</li>
            <li>Review of audit logistics and arrangements</li>
            <li>Identification of any concerns or areas of focus</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            2.3 Stage 2 Audit (Implementation Assessment)
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>On-site assessment of QMS implementation</li>
            <li>Evaluation of effectiveness of processes</li>
            <li>Verification of compliance with ISO 9001:2015</li>
            <li>Assessment of continual improvement activities</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            2.4 Certification Decision
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Review of audit findings and evidence</li>
            <li>Certification decision by independent certification committee</li>
            <li>Issuance of certificate (if successful)</li>
            <li>Certificate valid for 3 years</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            2.5 Surveillance Audits
          </h3>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            Annual surveillance audits will be conducted to verify continued compliance and effectiveness of the QMS.
          </p>
          
          <div style="background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin-top: 30px;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">
              Timeline: The complete certification process typically takes 3-6 months from application to certificate issuance.
            </p>
          </div>
        `,
        items: []
      }],
      images: [],
      layers: []
    },

    // Page 7: Certification Conditions
    {
      id: 'page-7',
      title: 'Certification Conditions',
      order: 6,
      content: '',
      sections: [{
        id: 'section-cert-conditions',
        title: 'Certification Conditions',
        description: 'Terms and conditions for maintaining certification',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 700 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 30px;">
            3. CERTIFICATION CONDITIONS
          </h2>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            3.1 Certificate Validity and Maintenance
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Certificate is valid for 3 years from the date of issue</li>
            <li>Annual surveillance audits are mandatory to maintain certification</li>
            <li>Recertification audit required before certificate expiry</li>
            <li>Certificate may be suspended or withdrawn for non-compliance</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            3.2 Use of Certificate and Marks
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Certificate and marks may only be used in accordance with certification body rules</li>
            <li>Misuse of certificate or marks may result in certificate withdrawal</li>
            <li>Organization must maintain records of certificate usage</li>
            <li>Certificate applies only to the defined scope and locations</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            3.3 Changes to Certified Organization
          </h3>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            The Organization must notify the Certification Body of any changes that may affect the QMS or certification:
          </p>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Changes in legal, commercial, organizational status or ownership</li>
            <li>Changes in organization and management</li>
            <li>Changes in contact address and sites</li>
            <li>Major changes in the QMS or processes</li>
            <li>Significant changes in scope of activities</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            3.4 Complaints and Appeals
          </h3>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Organization has the right to appeal certification decisions</li>
            <li>Complaints about auditor conduct or certification process will be investigated</li>
            <li>Appeals and complaints must be submitted in writing within 30 days</li>
            <li>Independent review process available for appeals</li>
          </ul>
          
          <div style="background: #fee2e2; padding: 20px; border-left: 4px solid #ef4444; margin-top: 30px;">
            <p style="margin: 0; font-weight: bold; color: #dc2626;">
              Important: Failure to comply with these conditions may result in certificate suspension or withdrawal.
            </p>
          </div>
        `,
        items: []
      }],
      images: [],
      layers: []
    },

    // Page 8: Fee Structure (Form Builder)
    {
      id: 'page-8',
      title: 'Fee Structure',
      order: 7,
      content: '<h1 style="text-align: center; margin-bottom: 30px;">FEE STRUCTURE</h1>',
      sections: [{
        id: 'section-fee-structure',
        title: 'Certification Fees',
        description: 'Detailed breakdown of certification costs',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 700 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#f0fdf4',
          borderColor: '#16a34a',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        items: [
          {
            id: 'fee-initial-certification',
            type: 'number' as FormElement['type'],
            label: 'Initial Certification Cost',
            name: 'fee_initial_certification',
            required: true,
            placeholder: 'Enter amount for initial certification'
          },
          {
            id: 'fee-surveillance-1',
            type: 'number' as FormElement['type'],
            label: '1st Surveillance Audit Cost',
            name: 'fee_surveillance_1',
            required: true,
            placeholder: 'Enter amount for 1st surveillance'
          },
          {
            id: 'fee-surveillance-2',
            type: 'number' as FormElement['type'],
            label: '2nd Surveillance Audit Cost',
            name: 'fee_surveillance_2',
            required: true,
            placeholder: 'Enter amount for 2nd surveillance'
          },
          {
            id: 'fee-recertification',
            type: 'number' as FormElement['type'],
            label: 'Recertification Cost',
            name: 'fee_recertification',
            required: true,
            placeholder: 'Enter amount for recertification'
          },
          {
            id: 'fee-currency',
            type: 'select' as FormElement['type'],
            label: 'Currency',
            name: 'fee_currency',
            required: true,
            options: ['USD', 'EUR', 'GBP', 'KES', 'ZAR']
          },
          {
            id: 'fee-payment-terms',
            type: 'textarea' as FormElement['type'],
            label: 'Payment Terms',
            name: 'fee_payment_terms',
            required: true,
            placeholder: 'e.g., 50% advance, 50% upon completion'
          }
        ]
      }],
      images: [],
      layers: []
    },

    // Page 9: Legal Terms (Confidentiality, Data Protection, etc.)
    {
      id: 'page-9',
      title: 'Legal Terms & Conditions',
      order: 8,
      content: '',
      sections: [{
        id: 'section-legal-terms',
        title: 'Legal Terms',
        description: 'Confidentiality, Data Protection, Responsibilities, and Terms',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 900 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 30px;">
            4. LEGAL TERMS AND CONDITIONS
          </h2>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            4.1 Confidentiality
          </h3>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            Both parties agree to keep confidential all information obtained from the other party that is designated as confidential 
            or which by its nature is confidential. This obligation shall survive the termination of this Agreement.
          </p>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            4.2 Data Protection
          </h3>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            The Certification Body shall process personal data in accordance with applicable data protection laws. 
            The Organization consents to the processing of its data for the purpose of certification and accreditation requirements.
          </p>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            4.3 Responsibilities of the Client
          </h3>
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li>Comply with certification requirements</li>
            <li>Make all necessary arrangements for audits</li>
            <li>Provide access to documentation and records</li>
            <li>Inform the Certification Body of significant changes</li>
          </ul>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            4.4 Cancellation and Termination
          </h3>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            Either party may terminate this Agreement by giving 30 days written notice. 
            Cancellation fees may apply if audits are cancelled within 14 days of the scheduled date.
          </p>
          
          <h3 style="color: #374151; font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">
            4.5 General Terms
          </h3>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            This Agreement constitutes the entire agreement between the parties. 
            Any amendments must be in writing and signed by both parties.
          </p>
        `,
        items: []
      }],
      images: [],
      layers: []
    },

    // Page 10: Signatures (Form Builder)
    {
      id: 'page-10',
      title: 'Signatures',
      order: 9,
      content: '<h1 style="text-align: center; margin-bottom: 30px;">AGREEMENT SIGNATURES</h1>',
      sections: [{
        id: 'section-signatures',
        title: 'Signatures',
        description: 'Authorized signatures',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 800, height: 500 },
        zIndex: 1,
        locked: false,
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#94a3b8',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: 30,
          shadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        items: [
          {
            id: 'sig-agreement-text',
            type: 'label' as FormElement['type'],
            label: 'By signing below, the parties agree to the terms and conditions of this Agreement.',
            name: 'sig_agreement_text',
            required: false
          },
          // Provider Signature
          {
            id: 'sig-provider-name',
            type: 'text' as FormElement['type'],
            label: 'For Certification Body (Name)',
            name: 'sig_provider_name',
            required: true,
            placeholder: 'Name of authorized signatory'
          },
          {
            id: 'sig-provider-title',
            type: 'text' as FormElement['type'],
            label: 'Title',
            name: 'sig_provider_title',
            required: true,
            placeholder: 'Title'
          },
          {
            id: 'sig-provider-date',
            type: 'date' as FormElement['type'],
            label: 'Date',
            name: 'sig_provider_date',
            required: true
          },
          // Client Signature
          {
            id: 'sig-client-name',
            type: 'text' as FormElement['type'],
            label: 'For Client Organization (Name)',
            name: 'sig_client_name',
            required: true,
            placeholder: 'Name of authorized signatory'
          },
          {
            id: 'sig-client-title',
            type: 'text' as FormElement['type'],
            label: 'Title',
            name: 'sig_client_title',
            required: true,
            placeholder: 'Title'
          },
          {
            id: 'sig-client-date',
            type: 'date' as FormElement['type'],
            label: 'Date',
            name: 'sig_client_date',
            required: true
          }
        ]
      }],
      images: [],
      layers: []
    }
  ];

  return {
    id: 'iso-9001-contract',
    title: 'ISO 9001:2015 Certification Contract',
    description: 'Standard contract for ISO 9001:2015 Quality Management System certification services',
    type: 'contract',
    pages: [page1, page2, ...pages3to10],
    is_published: false,
    settings: defaultTemplateSettings,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
