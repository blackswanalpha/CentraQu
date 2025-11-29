import { TemplatePage, TemplateSettings, PAGE_DIMENSIONS } from "@/services/template.service";

export interface PDFOptions {
    filename?: string;
    includeWatermark?: boolean;
    watermarkText?: string;
    includeMetadata?: boolean;
    quality?: 'low' | 'medium' | 'high';
}

export class PDFGenerator {
    private static async loadJsPDF() {
        // Dynamically import jsPDF to avoid SSR issues
        const { jsPDF } = await import('jspdf');
        await import('html2canvas');
        return jsPDF;
    }

    static async generateFromPage(
        page: TemplatePage,
        settings: TemplateSettings,
        options: PDFOptions = {}
    ): Promise<Blob> {
        const jsPDF = await this.loadJsPDF();
        const html2canvas = (await import('html2canvas')).default;

        // Get page dimensions
        const getPageDimensions = () => {
            if (settings.pageSize === 'Custom' && settings.customWidth && settings.customHeight) {
                return { width: settings.customWidth, height: settings.customHeight };
            }
            const dimensions = PAGE_DIMENSIONS[settings.pageSize as keyof typeof PAGE_DIMENSIONS];
            return dimensions[settings.orientation];
        };

        const pageDimensions = getPageDimensions();
        
        // Create PDF with correct dimensions
        const pdf = new jsPDF({
            orientation: settings.orientation === 'landscape' ? 'l' : 'p',
            unit: 'px',
            format: [pageDimensions.width, pageDimensions.height],
        });

        // Create a temporary div for rendering
        const tempDiv = document.createElement('div');
        tempDiv.style.width = `${pageDimensions.width}px`;
        tempDiv.style.height = `${pageDimensions.height}px`;
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '-9999px';
        tempDiv.style.left = '-9999px';
        tempDiv.style.backgroundColor = settings.backgroundColor;
        
        if (settings.backgroundImage) {
            tempDiv.style.backgroundImage = `url(${settings.backgroundImage})`;
            tempDiv.style.backgroundSize = 'cover';
            tempDiv.style.backgroundPosition = 'center';
        }

        document.body.appendChild(tempDiv);

        try {
            // Create content wrapper with margins
            const contentWrapper = document.createElement('div');
            contentWrapper.style.position = 'absolute';
            contentWrapper.style.top = `${settings.margins.top}px`;
            contentWrapper.style.left = `${settings.margins.left}px`;
            contentWrapper.style.right = `${settings.margins.right}px`;
            contentWrapper.style.bottom = `${settings.margins.bottom}px`;
            contentWrapper.style.overflow = 'hidden';

            // Add page content
            if (page.content) {
                const contentDiv = document.createElement('div');
                contentDiv.className = 'prose prose-sm max-w-none';
                contentDiv.innerHTML = page.content;
                contentWrapper.appendChild(contentDiv);
            }

            // Add sections
            const sectionsContainer = document.createElement('div');
            sectionsContainer.style.position = 'relative';
            sectionsContainer.style.width = '100%';
            sectionsContainer.style.height = '100%';

            page.sections.forEach((section) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.style.position = 'absolute';
                sectionDiv.style.left = `${section.position.x}px`;
                sectionDiv.style.top = `${section.position.y}px`;
                sectionDiv.style.width = `${section.size.width}px`;
                sectionDiv.style.height = section.size.height === 'auto' ? 'auto' : `${section.size.height}px`;
                sectionDiv.style.zIndex = section.zIndex.toString();
                
                // Apply section styling
                if (section.style.backgroundColor) {
                    sectionDiv.style.backgroundColor = section.style.backgroundColor;
                }
                if (section.style.borderColor) {
                    sectionDiv.style.borderColor = section.style.borderColor;
                }
                if (section.style.borderWidth) {
                    sectionDiv.style.borderWidth = `${section.style.borderWidth}px`;
                }
                if (section.style.borderStyle) {
                    sectionDiv.style.borderStyle = section.style.borderStyle;
                }
                if (section.style.borderRadius) {
                    sectionDiv.style.borderRadius = `${section.style.borderRadius}px`;
                }
                if (section.style.padding) {
                    sectionDiv.style.padding = `${section.style.padding}px`;
                }
                if (section.style.shadow) {
                    sectionDiv.style.boxShadow = section.style.shadow;
                }

                // Add section content
                const sectionHeader = document.createElement('div');
                sectionHeader.innerHTML = `<h3 style="margin: 0 0 8px 0; font-weight: 500; font-size: 14px;">${section.title}</h3>`;
                if (section.description) {
                    sectionHeader.innerHTML += `<p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">${section.description}</p>`;
                }
                sectionDiv.appendChild(sectionHeader);

                // Add template content
                if (section.template_content) {
                    const templateContentDiv = document.createElement('div');
                    templateContentDiv.className = 'prose prose-sm max-w-none';
                    templateContentDiv.innerHTML = section.template_content;
                    sectionDiv.appendChild(templateContentDiv);
                }

                // Add form items
                const itemsContainer = document.createElement('div');
                section.items.forEach((item) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.style.marginBottom = '12px';

                    const label = document.createElement('label');
                    label.style.display = 'block';
                    label.style.fontSize = '12px';
                    label.style.fontWeight = '500';
                    label.style.color = '#374151';
                    label.style.marginBottom = '4px';
                    label.textContent = item.label;
                    if (item.required) {
                        const required = document.createElement('span');
                        required.style.color = '#ef4444';
                        required.style.marginLeft = '4px';
                        required.textContent = '*';
                        label.appendChild(required);
                    }
                    itemDiv.appendChild(label);

                    // Create form elements based on type
                    if (item.type === 'text') {
                        const input = document.createElement('div');
                        input.style.width = '100%';
                        input.style.padding = '4px 8px';
                        input.style.border = '1px solid #d1d5db';
                        input.style.borderRadius = '4px';
                        input.style.fontSize = '12px';
                        input.style.minHeight = '24px';
                        input.style.backgroundColor = '#ffffff';
                        if (item.placeholder) {
                            input.style.color = '#9ca3af';
                            input.textContent = item.placeholder;
                        }
                        itemDiv.appendChild(input);
                    } else if (item.type === 'multiple_choice' && item.options) {
                        const optionsContainer = document.createElement('div');
                        item.options.forEach((option) => {
                            const optionDiv = document.createElement('div');
                            optionDiv.style.display = 'flex';
                            optionDiv.style.alignItems = 'center';
                            optionDiv.style.gap = '8px';
                            optionDiv.style.marginBottom = '4px';
                            
                            const radio = document.createElement('div');
                            radio.style.width = '12px';
                            radio.style.height = '12px';
                            radio.style.border = '1px solid #d1d5db';
                            radio.style.borderRadius = '50%';
                            radio.style.backgroundColor = '#ffffff';
                            
                            const optionLabel = document.createElement('span');
                            optionLabel.style.fontSize = '12px';
                            optionLabel.textContent = option;
                            
                            optionDiv.appendChild(radio);
                            optionDiv.appendChild(optionLabel);
                            optionsContainer.appendChild(optionDiv);
                        });
                        itemDiv.appendChild(optionsContainer);
                    } else if (item.type === 'dropdown' && item.options) {
                        const select = document.createElement('div');
                        select.style.width = '100%';
                        select.style.padding = '4px 8px';
                        select.style.border = '1px solid #d1d5db';
                        select.style.borderRadius = '4px';
                        select.style.fontSize = '12px';
                        select.style.minHeight = '24px';
                        select.style.backgroundColor = '#ffffff';
                        select.style.position = 'relative';
                        select.textContent = 'Select an option...';
                        select.style.color = '#9ca3af';
                        
                        // Add dropdown arrow
                        const arrow = document.createElement('div');
                        arrow.style.position = 'absolute';
                        arrow.style.right = '8px';
                        arrow.style.top = '50%';
                        arrow.style.transform = 'translateY(-50%)';
                        arrow.style.fontSize = '10px';
                        arrow.style.color = '#6b7280';
                        arrow.textContent = '▼';
                        select.appendChild(arrow);
                        
                        itemDiv.appendChild(select);
                    } else if (item.type === 'date') {
                        const dateInput = document.createElement('div');
                        dateInput.style.width = '100%';
                        dateInput.style.padding = '4px 8px';
                        dateInput.style.border = '1px solid #d1d5db';
                        dateInput.style.borderRadius = '4px';
                        dateInput.style.fontSize = '12px';
                        dateInput.style.minHeight = '24px';
                        dateInput.style.backgroundColor = '#ffffff';
                        dateInput.style.color = '#9ca3af';
                        dateInput.textContent = 'Select date...';
                        itemDiv.appendChild(dateInput);
                    } else if (item.type === 'rating') {
                        const ratingContainer = document.createElement('div');
                        ratingContainer.style.display = 'flex';
                        ratingContainer.style.gap = '2px';
                        
                        for (let i = 0; i < (item.rating_scale || 5); i++) {
                            const star = document.createElement('span');
                            star.style.fontSize = '14px';
                            star.style.color = '#d1d5db';
                            star.textContent = '★';
                            ratingContainer.appendChild(star);
                        }
                        itemDiv.appendChild(ratingContainer);
                    }

                    itemsContainer.appendChild(itemDiv);
                });

                sectionDiv.appendChild(itemsContainer);
                sectionsContainer.appendChild(sectionDiv);
            });

            contentWrapper.appendChild(sectionsContainer);

            // Add images
            const imagesContainer = document.createElement('div');
            imagesContainer.style.position = 'relative';
            imagesContainer.style.width = '100%';
            imagesContainer.style.height = '100%';

            for (const image of page.images) {
                const imgDiv = document.createElement('div');
                imgDiv.style.position = 'absolute';
                imgDiv.style.left = `${image.position.x}px`;
                imgDiv.style.top = `${image.position.y}px`;
                imgDiv.style.width = `${image.size.width}px`;
                imgDiv.style.height = `${image.size.height}px`;
                imgDiv.style.zIndex = image.zIndex.toString();
                imgDiv.style.transform = `rotate(${image.rotation}deg)`;
                imgDiv.style.opacity = image.opacity.toString();

                const img = document.createElement('img');
                img.src = image.url;
                img.alt = image.alt || '';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';

                // Wait for image to load
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });

                imgDiv.appendChild(img);
                imagesContainer.appendChild(imgDiv);
            }

            contentWrapper.appendChild(imagesContainer);
            tempDiv.appendChild(contentWrapper);

            // Add watermark if specified
            if (options.includeWatermark && options.watermarkText) {
                const watermark = document.createElement('div');
                watermark.style.position = 'absolute';
                watermark.style.top = '50%';
                watermark.style.left = '50%';
                watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
                watermark.style.fontSize = '48px';
                watermark.style.color = 'rgba(0, 0, 0, 0.1)';
                watermark.style.fontWeight = 'bold';
                watermark.style.pointerEvents = 'none';
                watermark.style.zIndex = '1000';
                watermark.textContent = options.watermarkText;
                tempDiv.appendChild(watermark);
            }

            // Render to canvas
            const canvas = await html2canvas(tempDiv, {
                width: pageDimensions.width,
                height: pageDimensions.height,
                scale: options.quality === 'high' ? 2 : options.quality === 'low' ? 0.5 : 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: settings.backgroundColor,
            });

            // Add canvas to PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, pageDimensions.width, pageDimensions.height);

            // Add metadata if specified
            if (options.includeMetadata) {
                pdf.setProperties({
                    title: page.title,
                    subject: 'Template Export',
                    author: 'AssureHub',
                    creator: 'AssureHub Template Builder',
                });
            }

            // Generate blob
            const pdfBlob = pdf.output('blob');
            return pdfBlob;

        } finally {
            // Clean up
            document.body.removeChild(tempDiv);
        }
    }

    static async downloadPDF(
        page: TemplatePage,
        settings: TemplateSettings,
        options: PDFOptions = {}
    ): Promise<void> {
        try {
            const blob = await this.generateFromPage(page, settings, options);
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = options.filename || `${page.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            throw new Error('Failed to generate PDF. Please try again.');
        }
    }

    static async generatePreview(
        page: TemplatePage,
        settings: TemplateSettings
    ): Promise<string> {
        try {
            const blob = await this.generateFromPage(page, settings, { quality: 'low' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Failed to generate PDF preview:', error);
            throw new Error('Failed to generate PDF preview.');
        }
    }
}