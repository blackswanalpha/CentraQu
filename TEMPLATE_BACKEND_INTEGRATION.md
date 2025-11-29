# Template Builder Backend Integration - Implementation Summary

## Overview
This document explains the integration between the template builder frontend and the Django backend (backend_centra).

## Architecture

### Frontend (Next.js/React)
- **Location**: `/assure/src/components/`
- **Main Components**:
  - `AdvancedContractBuilder` - Advanced template builder with visual canvas
  - `TemplateManagement` - Template list and management UI
  - `InteractiveVisualCanvas` - Visual drag-and-drop editor
  - `WritableSection` - Editable sections with rich text support

### Backend (Django)
- **Location**: `/backend_centra/apps/business_development/`
- **API Endpoints**: `/api/v1/contract-templates/`
- **Models**: `ContractTemplate` in `models.py`
- **Views**: `ContractTemplateViewSet` in `views.py`

## API Integration

### Service Layer
**File**: `/assure/src/services/template-api.service.ts`

Functions:
- `fetchTemplates(templateType?)` - Get all templates
- `fetchTemplateById(templateId)` - Get specific template
- `createTemplate(templateData)` - Create new template
- `updateTemplate(templateId, templateData)` - Update existing template
- `deleteTemplate(templateId)` - Delete template
- `exportTemplate(templateId)` - Export as JSON
- `importTemplate(templateJson)` - Import from JSON

### Environment Configuration
Set the Django API URL in your environment:
```bash
# .env.local (create this file)
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api/v1
```

## How Publishing Works

### 1. Creating/Editing Templates
1. User navigates to `/business-development/contracts` (for contracts) or `/dashboard/audits/templates` (for audits)
2. Clicks "Create Template" or "Edit" on existing template
3. Opens `AdvancedContractBuilder` component at `/template/builder`

### 2. Saving Templates
When user clicks "Save" button:
```typescript
// In AdvancedContractBuilder
const handleSave = async () => {
    setIsSaving(true);
    try {
        if (savedBackendId) {
            // Update existing template in backend
            await updateTemplate(savedBackendId, template);
        } else {
            // Create new template in backend
            const backendTemplate = await createTemplate(template);
            setSavedBackendId(backendTemplate.template_id);
        }
        // Notify parent component
        await onSave(template);
    } catch (error) {
        console.error('Failed to save template to backend:', error);
        alert('Failed to save template. Please try again.');
    } finally {
        setIsSaving(false);
    }
};
```

### 3. Publishing Templates
When user clicks "Publish" button:
```typescript
const handlePublish = async () => {
    const updatedTemplate = { 
        ...template, 
        is_published: !template.is_published 
    };
    setTemplate(updatedTemplate);
    
    // Save to backend with published status
    if (savedBackendId) {
        await updateTemplate(savedBackendId, updatedTemplate);
    } else {
        const backendTemplate = await createTemplate(updatedTemplate);
        setSavedBackendId(backendTemplate.template_id);
    }
};
```

### 4. Backend Processing
```python
# In Django backend: apps/business_development/views.py
class ContractTemplateViewSet(viewsets.ModelViewSet):
    def create(self, request):
        template_data = request.data.get('template_data', {})
        template = ContractTemplateService.create_contract_template(
            template_data=template_data,
            created_by=request.user
        )
        return Response({'success': True, 'data': template})
    
    def update(self, request, pk=None):
        template_data = request.data.get('template_data', {})
        template = ContractTemplateService.update_contract_template(
            template_id=pk,
            template_data=template_data
        )
        return Response({'success': True, 'data': template})
```

### 5. Displaying Templates

#### Contract Templates
**Route**: `/business-development/contracts`
**Component**: `TemplateManagement`

```typescript
// Fetches templates on mount
useEffect(() => {
    const loadTemplates = async () => {
        const backendData = await fetchTemplates('CERTIFICATION_CONTRACT');
        const mappedTemplates = backendData.map(bt => ({
            ...bt.template_data,
            id: bt.template_id,
            is_published: bt.status === 'ACTIVE',
        }));
        setTemplates(mappedTemplates);
    };
    loadTemplates();
}, []);
```

#### Audit Templates
**Route**: `/dashboard/audits/templates`
**Component**: Existing audit checklist page

Note: To integrate audit templates with the new builder, update this page to:
1. Fetch templates with type `AUDIT_CHECKLIST`
2. Use `AdvancedContractBuilder` for editing
3. Map template type appropriately

## Template Type Mapping

Frontend → Backend:
- `contract` → `CERTIFICATION_CONTRACT`
- `audit` → `AUDIT_CHECKLIST`
- `certification` → `CERTIFICATION_CONTRACT`
- other → `OTHER`

## Database Schema

### Django Model: ContractTemplate
```python
class ContractTemplate(models.Model):
    template_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    template_type = models.CharField(max_length=50)
    template_data = models.JSONField()  # Stores full Template object
    status = models.CharField(
        max_length=20,
        choices=[('DRAFT', 'Draft'), ('ACTIVE', 'Active'), ('ARCHIVED', 'Archived')]
    )
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    version = models.CharField(max_length=20, default='1.0.0')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Testing the Integration

### 1. Start Backend
```bash
cd /home/mbugua/Documents/augment-projects/AssureHub/backend_centra
python manage.py runserver
```

### 2. Start Frontend
```bash
cd /home/mbugua/Documents/augment-projects/AssureHub/assure
npm run dev
```

### 3. Test Workflow
1. Navigate to `http://localhost:3000/business-development/contracts`
2. Click "Create Template"
3. Build your template using the visual builder
4. Click "Save" - template saves to database
5. Click "Publish" - template status changes to ACTIVE
6. Return to list - template appears with "Published" status
7. Template is now available for use in contracts

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure Django settings include:
```python
# backend_centra/backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### API Not Found
- Verify Django server is running on port 8000
- Check `NEXT_PUBLIC_DJANGO_API_URL` environment variable
- Ensure API endpoints are registered in Django URLs

### Templates Not Loading
- Check browser console for errors
- Verify API response format matches `BackendTemplate` interface
- Check template_data field contains valid Template object

## Next Steps

1. **Add Authentication**: Currently uses `AllowAny` permission - change to `IsAuthenticated`
2. **Add Audit Template Support**: Update audit templates page to use new builder
3. **Add Template Versioning**: Track template version history
4. **Add Template Preview**: Implement proper preview rendering for published templates
5. **Add Template Sharing**: Allow templates to be shared across organizations
