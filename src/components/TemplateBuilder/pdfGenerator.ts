import { Template, TemplateItem, FormElement } from '@/services/template.service';

// Note: This is a client-side PDF generator using jsPDF
// For production, consider using a server-side solution like Puppeteer

export const generatePDF = async (template: Template): Promise<void> => {
    // Dynamically import jsPDF to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF({
        orientation: template.settings.orientation,
        unit: 'pt',
        format: template.settings.pageSize.toLowerCase() as any,
    });

    // Set margins
    const margins = template.settings.margins;
    let yPos = margins.top;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margins.left - margins.right;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        if (isBold) {
            doc.setFont('helvetica', 'bold');
        } else {
            doc.setFont('helvetica', 'normal');
        }
        doc.setFontSize(fontSize);
        
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margins.left, yPos);
        yPos += lines.length * (fontSize * 1.2) + 10;
        
        // Add new page if needed
        if (yPos > doc.internal.pageSize.getHeight() - margins.bottom) {
            doc.addPage();
            yPos = margins.top;
        }
        
        return yPos;
    };

    // Helper function to replace variables with sample values
    const replaceVariables = (text: string): string => {
        const sampleVariables: Record<string, string> = {
            client_name: 'John Doe',
            contract_date: new Date().toLocaleDateString(),
            company_name: 'ABC Corporation',
            contract_amount: '$10,000',
            amount: '$10,000',
            service_description: 'Professional consulting services',
            payment_schedule: 'Monthly payments',
            start_date: new Date().toLocaleDateString(),
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            signature_date: new Date().toLocaleDateString(),
            audit_date: new Date().toLocaleDateString(),
            inspector_name: 'Jane Smith',
            site_location: '123 Business Street',
            address: '123 Main St, City, State 12345'
        };
        
        // Add template-specific variables if they exist
        if (template.metadata?.variables) {
            template.metadata.variables.forEach(variable => {
                if (!sampleVariables[variable.name]) {
                    switch (variable.type) {
                        case 'date':
                            sampleVariables[variable.name] = new Date().toLocaleDateString();
                            break;
                        case 'currency':
                            sampleVariables[variable.name] = '$1,000';
                            break;
                        case 'number':
                            sampleVariables[variable.name] = '100';
                            break;
                        default:
                            sampleVariables[variable.name] = `Sample ${variable.name.replace('_', ' ')}`;
                    }
                }
            });
        }
        
        let result = text;
        Object.entries(sampleVariables).forEach(([key, value]) => {
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        });
        
        return result;
    };

    // Helper function to strip HTML tags but preserve image info
    const stripHTML = (html: string): string => {
        // Extract image information before stripping
        const imageRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi;
        const images: { src: string; alt: string }[] = [];
        let match;
        
        while ((match = imageRegex.exec(html)) !== null) {
            images.push({
                src: match[1],
                alt: match[2] || 'Image'
            });
        }
        
        // Replace images with placeholder text for now
        let result = html.replace(imageRegex, (match, src, alt) => {
            return `[IMAGE: ${alt || 'Uploaded image'}]`;
        });
        
        // Strip remaining HTML tags
        result = result.replace(/<[^>]*>/g, '').trim();
        
        return result;
    };

    try {
        // Title
        addText(template.title, 20, true);
        
        // Description
        if (template.description) {
            addText(template.description, 12, false);
        }
        
        yPos += 20;

        // Process each page
        template.pages.forEach((page, pageIndex) => {
            if (template.pages.length > 1) {
                addText(page.title, 16, true);
            }
            
            // Page content
            if (page.content) {
                const content = stripHTML(replaceVariables(page.content));
                if (content) {
                    addText(content, 12, false);
                }
            }

            // Process sections
            page.sections.forEach((section, sectionIndex) => {
                yPos += 10;
                
                // Section title
                addText(section.title, 14, true);
                
                // Section description
                if (section.description) {
                    addText(section.description, 11, false);
                }
                
                // Section template content
                if (section.template_content) {
                    const content = stripHTML(replaceVariables(section.template_content));
                    if (content) {
                        addText(content, 12, false);
                    }
                }

                // Process items
                section.items.forEach((item, itemIndex) => {
                    const isTemplateItem = 'type' in item && ['text', 'multiple_choice', 'dropdown', 'rating', 'date', 'file', 'image', 'instruction', 'rich_text'].includes(item.type);
                    
                    if (isTemplateItem) {
                        const templateItem = item as TemplateItem;
                        
                        switch (templateItem.type) {
                            case 'text':
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                                addText('Answer: ________________________', 10, false);
                                break;
                                
                            case 'multiple_choice':
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                                templateItem.options?.forEach((option, optIndex) => {
                                    addText(`   ${String.fromCharCode(97 + optIndex)}) ${option}`, 10, false);
                                });
                                break;
                                
                            case 'dropdown':
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                                addText('Selection: ________________________', 10, false);
                                break;
                                
                            case 'rating':
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                                const scale = templateItem.rating_scale || 5;
                                addText(`Rating (1-${scale}): ________________________`, 10, false);
                                break;
                                
                            case 'date':
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                                addText('Date: ________________________', 10, false);
                                break;
                                
                            case 'file':
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                                addText('File Attachment: ________________________', 10, false);
                                break;
                                
                            case 'rich_text':
                                let content = templateItem.rich_content || templateItem.label;
                                content = stripHTML(replaceVariables(content));
                                addText(content, 12, false);
                                break;
                                
                            case 'instruction':
                                addText(`NOTE: ${templateItem.label}`, 11, true);
                                break;
                                
                            default:
                                addText(`${itemIndex + 1}. ${templateItem.label}`, 12, false);
                        }
                    } else {
                        // Handle FormElement
                        const formElement = item as FormElement;
                        addText(`${itemIndex + 1}. ${formElement.label}`, 12, false);
                        if (formElement.helpText) {
                            addText(`   ${formElement.helpText}`, 10, false);
                        }
                        addText('Response: ________________________', 10, false);
                    }
                    
                    yPos += 5;
                });
            });
        });

        // Add footer with generation info
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
                `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${totalPages}`,
                margins.left,
                doc.internal.pageSize.getHeight() - margins.bottom + 20
            );
            doc.text(
                `Template: ${template.title}`,
                pageWidth - margins.right - 200,
                doc.internal.pageSize.getHeight() - margins.bottom + 20
            );
        }

        // Save the PDF
        const fileName = `${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF. Please try again.');
    }
};