# Template Save/Publish Troubleshooting Guide

## Issue: Cannot Save or Publish Templates

### Prerequisites Checklist

Before troubleshooting, verify:

1. **Django Backend is Running**:
   ```bash
   cd /home/mbugua/Documents/augment-projects/AssureHub/backend_centra
   python manage.py runserver
   ```
   Should see: `Starting development server at http://127.0.0.1:8000/`

2. **Frontend is Running**:
   ```bash
   cd /home/mbugua/Documents/augment-projects/AssureHub/assure
   npm run dev
   ```
   Should see: `ready - started server on 0.0.0.0:3000`

3. **Environment Variable is Set** (optional, uses default if not set):
   - Default: `http://localhost:8000/api/v1`
   - Custom: Set `NEXT_PUBLIC_DJANGO_API_URL` in `.env.local`

### Diagnostic Steps

#### Step 1: Open Browser Console
1. Open the template builder at `http://localhost:3000/template/builder`
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Keep this open while you test

#### Step 2: Try to Save
1. Make any change to the template (add a section, edit content, etc.)
2. Click the "Save" button in the header
3. Watch the console for log messages

**What to Look For:**

✅ **Success Flow**:
```
💾 Attempting to save template... {savedBackendId: undefined, templateTitle: "...", ...}
🌐 API: Creating template... {url: "http://localhost:8000/api/v1/contract-templates/", ...}
📡 API Response: {status: 200, statusText: "OK", ok: true}
✅ API Success: {success: true, data: {...}}
✅ Template created successfully: {id: 1, template_id: "...", ...}
📤 Calling parent onSave...
✅ Save complete!
```

❌ **Error Flow** - One of these will appear:
```
❌ API Error: {error: "..."}
❌ Failed to save template: Error: ...
```

#### Step 3: Common Errors and Solutions

##### Error 1: "Failed to fetch" or "NetworkError"
**Symptom**: Console shows network error or fetch failed

**Cause**: Backend is not running or CORS issue

**Solutions**:
1. Verify Django backend is running: `curl http://localhost:8000/api/v1/contract-templates/`
2. Check Django CORS settings in `backend_centra/backend/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```
3. Restart Django server after changing settings

##### Error 2: 400 BadRequest or 500 Internal Server Error
**Symptom**: API returns error status code

**Cause**: Invalid data format or backend error

**Solutions**:
1. Check Django console for error messages
2. Verify template data structure matches expected format
3. Check Django logs: `tail -f backend_centra/debug.log`

##### Error 3: TypeError or undefined errors
**Symptom**: JavaScript errors in console

**Cause**: Missing required fields or data structure issues

**Solutions**:
1. Ensure template has at least one page: Add a page before saving
2. Ensure template has a title: Should be "Untitled Contract" by default
3. Check template data in console: `console.log(template)`

##### Error 4: "Template data is required"
**Symptom**: Backend returns this error message

**Cause**: Empty or null template_data field

**Solution**: Verify the API call includes template_data:
```javascript
// Should send:
{
  "template_data": {
    "title": "...",
    "type": "contract",
    "pages": [...]
  }
}
```

#### Step 4: Test Backend Directly

Test the API endpoint directly using curl:

```bash
# Test GET (list templates)
curl http://localhost:8000/api/v1/contract-templates/

# Test POST (create template)
curl -X POST http://localhost:8000/api/v1/contract-templates/ \
  -H "Content-Type: application/json" \
  -d '{
    "template_data": {
      "title": "Test Template",
      "description": "Test",
      "type": "contract",
      "pages": [],
      "is_published": false,
      "settings": {},
      "metadata": {}
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "id": 1,
    "template_id": "test-template-...",
    "name": "Test Template",
    ...
  }
}
```

### New Logging Features (Just Added)

The code now includes detailed logging at every step:

1. **In AdvancedContractBuilder**:
   - 💾 Save attempt with template details
   - 📝 Update or 🆕 Create indicators
   - ✅ Success confirmations
   - ❌ Error details with actual error message

2. **In template-api.service.ts**:
   - 🌐 API call details (URL, method, data)
   - 📡 Response status
   - ✅ Success with response data
   - ❌ Error with full error details

3. **Error Alerts**:
   - Now shows the actual error message
   - Tells you to check console for details

### Manual Verification

After saving, verify the template was saved:

1. **Check Database**:
   ```bash
   cd backend_centra
   python manage.py shell
   ```
   ```python
   from apps.business_development.models import ContractTemplate
   templates = ContractTemplate.objects.all()
   for t in templates:
       print(f"{t.id}: {t.name} - {t.template_type}")
   ```

2. **Check API Response**:
   ```bash
   curl http://localhost:8000/api/v1/contract-templates/
   ```

3. **Reload Page**:
   - Go back to `/business-development/contracts`
   - Your saved template should appear in the list

### Still Not Working?

If you've tried all the above and it still doesn't work:

1. **Clear Browser Cache**:
   - Ctrl+Shift+Delete → Clear cache
   - Or use Incognito mode

2. **Restart Both Servers**:
   ```bash
   # Terminal 1: Django
   cd backend_centra
   python manage.py runserver

   # Terminal 2: Next.js
   cd assure
   npm run dev
   ```

3. **Check for Multiple Instances**:
   - Ensure only one Django server is running
   - Ensure only one Next.js server is running
   - Kill any duplicate processes

4. **Provide Console Output**:
   - Copy all console log messages
   - Copy all console error messages
   - Share the output for further debugging

### Quick Test Procedure

1. Open `http://localhost:3000/template/builder`
2. Open browser console (F12)
3. Click "Save" button
4. Look for the emoji indicators in console:
   - 💾 🌐 📡 ✅ = Success!
   - ❌ = Error (read the error message)

### Environment Variables

If you need to change the backend URL:

Create `/assure/.env.local`:
```bash
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api/v1
```

Restart Next.js dev server after changing env variables.
