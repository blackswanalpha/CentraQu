import { Template, TemplatePage, VisualSection, TemplateItem, defaultTemplateSettings } from '@/services/template.service';

export const createServiceContractTemplate = (): Template => {
    const mainSection: VisualSection = {
        id: 'section-main',
        title: 'Service Agreement Terms',
        description: 'Main contract terms and conditions',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 700, height: 400 },
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
            <h2>Service Agreement</h2>
            <p>This Service Agreement ("Agreement") is entered into on <strong>{contract_date}</strong> between <strong>{client_name}</strong> ("Client") and <strong>{company_name}</strong> ("Service Provider").</p>
            
            <h3>1. Services</h3>
            <p>The Service Provider agrees to provide the following services: <strong>{service_description}</strong></p>
            
            <h3>2. Payment Terms</h3>
            <p>Total contract value: <strong>{contract_amount}</strong></p>
            <p>Payment schedule: <strong>{payment_schedule}</strong></p>
            
            <h3>3. Duration</h3>
            <p>This agreement shall commence on <strong>{start_date}</strong> and continue until <strong>{end_date}</strong>, unless terminated earlier in accordance with the terms herein.</p>
        `,
        items: [
            {
                id: 'item-service-desc',
                type: 'text',
                label: 'Service Description',
                order: 0,
                required: true,
                placeholder: 'Describe the services to be provided...'
            },
            {
                id: 'item-payment-terms',
                type: 'multiple_choice',
                label: 'Payment Schedule',
                order: 1,
                required: true,
                options: [
                    'Monthly installments',
                    'Quarterly payments',
                    'Upon completion',
                    'Custom schedule'
                ]
            },
            {
                id: 'item-start-date',
                type: 'date',
                label: 'Service Start Date',
                order: 2,
                required: true
            },
            {
                id: 'item-end-date',
                type: 'date',
                label: 'Service End Date',
                order: 3,
                required: true
            }
        ]
    };

    const clientInfoSection: VisualSection = {
        id: 'section-client-info',
        title: 'Client Information',
        description: 'Client details and contact information',
        order: 1,
        position: { x: 50, y: 500 },
        size: { width: 700, height: 300 },
        zIndex: 1,
        locked: false,
        style: {
            backgroundColor: '#f8fafc',
            borderColor: '#cbd5e1',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 12,
            padding: 20,
            shadow: '0 1px 4px rgba(0,0,0,0.05)'
        },
        items: [
            {
                id: 'item-client-name',
                type: 'text',
                label: 'Client Name/Organization',
                order: 0,
                required: true,
                placeholder: 'Enter client name or organization...'
            },
            {
                id: 'item-client-address',
                type: 'text',
                label: 'Client Address',
                order: 1,
                required: true,
                placeholder: 'Enter complete address...'
            },
            {
                id: 'item-client-contact',
                type: 'text',
                label: 'Primary Contact',
                order: 2,
                required: true,
                placeholder: 'Contact person name and title...'
            },
            {
                id: 'item-client-email',
                type: 'text',
                label: 'Email Address',
                order: 3,
                required: true,
                placeholder: 'primary@email.com'
            },
            {
                id: 'item-client-phone',
                type: 'text',
                label: 'Phone Number',
                order: 4,
                required: true,
                placeholder: '+1 (555) 123-4567'
            }
        ]
    };

    const signaturesSection: VisualSection = {
        id: 'section-signatures',
        title: 'Signatures',
        description: 'Contract execution signatures',
        order: 2,
        position: { x: 50, y: 850 },
        size: { width: 700, height: 200 },
        zIndex: 1,
        locked: false,
        style: {
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 2,
            borderStyle: 'solid',
            borderRadius: 12,
            padding: 20,
            shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        template_content: `
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <div style="width: 45%;">
                    <p><strong>Client Signature:</strong></p>
                    <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 8px;">
                        <p>Name: {client_name}</p>
                        <p>Date: {signature_date}</p>
                    </div>
                </div>
                <div style="width: 45%;">
                    <p><strong>Service Provider Signature:</strong></p>
                    <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 8px;">
                        <p>Name: {company_name}</p>
                        <p>Date: {signature_date}</p>
                    </div>
                </div>
            </div>
        `,
        items: [
            {
                id: 'item-signature-method',
                type: 'multiple_choice',
                label: 'Signature Method',
                order: 0,
                required: true,
                options: [
                    'Electronic signature',
                    'Physical signature',
                    'Digital signature'
                ]
            },
            {
                id: 'item-witness-required',
                type: 'multiple_choice',
                label: 'Witness Required?',
                order: 1,
                required: false,
                options: ['Yes', 'No']
            }
        ]
    };

    const mainPage: TemplatePage = {
        id: 'page-main',
        title: 'Service Agreement',
        order: 0,
        content: '',
        sections: [mainSection, clientInfoSection, signaturesSection],
        images: [],
        layers: []
    };

    const contractTemplate: Template = {
        title: 'Professional Service Agreement',
        description: 'A comprehensive service agreement template for professional services contracts',
        type: 'contract',
        pages: [mainPage],
        is_published: false,
        settings: {
            ...defaultTemplateSettings,
            pageSize: 'Letter',
            orientation: 'portrait',
            margins: { top: 50, right: 50, bottom: 50, left: 50 }
        },
        metadata: {
            variables: [
                { name: 'client_name', description: 'Client or organization name', type: 'text' },
                { name: 'company_name', description: 'Service provider company name', type: 'text' },
                { name: 'contract_date', description: 'Date of contract execution', type: 'date' },
                { name: 'contract_amount', description: 'Total contract value', type: 'currency' },
                { name: 'service_description', description: 'Description of services', type: 'text' },
                { name: 'payment_schedule', description: 'Payment schedule terms', type: 'text' },
                { name: 'start_date', description: 'Service start date', type: 'date' },
                { name: 'end_date', description: 'Service end date', type: 'date' },
                { name: 'signature_date', description: 'Date of signing', type: 'date' }
            ],
            require_all: true,
            show_progress: true,
            auto_save: true
        }
    };

    return contractTemplate;
};

export const createAuditChecklistTemplate = (): Template => {
    const generalSection: VisualSection = {
        id: 'section-general',
        title: 'General Site Conditions',
        description: 'Overall assessment of site conditions and maintenance',
        order: 0,
        position: { x: 50, y: 50 },
        size: { width: 700, height: 350 },
        zIndex: 1,
        locked: false,
        style: {
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 8,
            padding: 16,
            shadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        items: [
            {
                id: 'item-cleanliness',
                type: 'rating',
                label: 'How would you rate the overall cleanliness of the premises?',
                order: 0,
                required: true,
                rating_scale: 5
            },
            {
                id: 'item-safety-signs',
                type: 'multiple_choice',
                label: 'Are safety signs clearly visible and unobstructed?',
                order: 1,
                required: true,
                options: ['Yes', 'No', 'Partially']
            },
            {
                id: 'item-emergency-exits',
                type: 'multiple_choice',
                label: 'Are all emergency exits clearly marked and accessible?',
                order: 2,
                required: true,
                options: ['Yes', 'No', 'Some issues noted']
            },
            {
                id: 'item-maintenance-issues',
                type: 'text',
                label: 'Describe any maintenance issues observed',
                order: 3,
                required: false,
                placeholder: 'List any maintenance concerns or observations...'
            }
        ]
    };

    const auditPage: TemplatePage = {
        id: 'page-audit',
        title: 'Site Audit Checklist',
        order: 0,
        content: '<h1>Site Inspection Audit</h1><p>Conducted on: {audit_date}</p><p>Inspector: {inspector_name}</p>',
        sections: [generalSection],
        images: [],
        layers: []
    };

    return {
        title: 'Site Audit Checklist',
        description: 'Standard site inspection and audit checklist template',
        type: 'audit',
        pages: [auditPage],
        is_published: false,
        settings: defaultTemplateSettings,
        metadata: {
            variables: [
                { name: 'audit_date', description: 'Date of audit', type: 'date' },
                { name: 'inspector_name', description: 'Name of inspector', type: 'text' },
                { name: 'site_location', description: 'Location being audited', type: 'text' }
            ]
        }
    };
};