# Image Upload Troubleshooting Guide

## How Image Upload Works in the Template Builder

### Image Insertion Methods
There are two ways to insert images into a section:

1. **Drag and Drop**:
   - Click on a section to edit its content (click the "Edit" button or "+ Add rich text content")
   - Drag an image file from your computer
   - Drop it into the content editor area

2. **File Upload Button**:
   - Click on a section to edit its content
   - Click the image icon (📷) in the toolbar
   - Select an image file from your computer

### What Happens When You Upload an Image

1. **File Validation**:
   - File must be an image (PNG, JPG, GIF, etc.)
   - File size must be less than 5MB

2. **Image Processing**:
   - Image is converted to a base64 data URL
   - HTML `<img>` tag is created with inline styles
   - Image is inserted at cursor position or appended to content

3. **Save Process**:
   - Image is now part of the `contentValue` state
   - Click the green **Save** button (checkmark ✓) in the toolbar
   - Content (including images) is saved to `section.template_content`
   - Exit edit mode to see the saved content

## Common Issues and Solutions

### Issue 1: Image Not Visible After Upload
**Symptom**: You upload an image but don't see it in the editor

**Solution**:
1. Make sure you're in edit mode (editing content)
2. Check browser console for errors
3. Verify the image file is a valid format (PNG, JPG, GIF)
4. Ensure file size is under 5MB

### Issue 2: Image Disappears After Saving
**Symptom**: Image shows in editor but disappears when you save

**Possible Causes**:
1. **Not clicking Save button**: Make sure to click the green checkmark (✓) button before clicking the X or clicking outside
2. **Content not being persisted**: Check if `onUpdateSection` callback is working properly

**Solution**:
- Always click the green Save button (✓) after inserting images
- Don't click the red X button or click outside the editor without saving
- Check browser console for any errors

### Issue 3: Image Shows Broken Icon
**Symptom**: Image placeholder shows but actual image doesn't load

**Possible Causes**:
1. Base64 data URL is corrupted
2. Image data is too large
3. Browser security settings blocking data URLs

**Solution**:
- Try a smaller image (under 1MB recommended)
- Use JPG format for photos, PNG for graphics
- Check browser console for Content Security Policy (CSP) errors

## Step-by-Step: How to Add an Image

1. **Select a Section**:
   - Click on any section card in the template builder

2. **Enter Edit Mode**:
   - Click "+ Add rich text content" or the edit pencil button
   - The content editor will open with a toolbar

3. **Insert Image**:
   - **Option A**: Click the image icon (📷) in the toolbar → Select file
   - **Option B**: Drag and drop an image file into the editor area

4. **Verify Image Appeared**:
   - You should see the image immediately in the editor
   - If not, check file format and size

5. **Save Changes**:
   - Click the green **checkmark (✓)** button in the toolbar
   - This saves the content including the image

6. **View Result**:
   - The editor closes and shows your content
   - Image should now be visible in the section

## Technical Details

### Image Storage Format
Images are stored as base64 data URLs:
```html
<img src="data:image/png;base64,iVBORw0KG..." alt="filename.png" 
     style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px;" />
```

### Image Styles
Default image styles applied:
- `max-width: 100%` - Responsive width
- `height: auto` - Maintain aspect ratio
- `margin: 10px 0` - Vertical spacing
- `border-radius: 4px` - Rounded corners

### File Size Considerations
- **Recommended**: Keep images under 1MB
- **Maximum**: 5MB enforced by code
- **Why**: Large base64 data URLs can cause:
  - Slow database saves
  - Large template file sizes
  - Browser performance issues

## Debugging Steps

If images still aren't showing:

1. **Open Browser DevTools** (F12):
   ```
   - Check Console tab for errors
   - Look for image-related errors
   - Check for CSP violations
   ```

2. **Inspect the Content**:
   ```javascript
   // In browser console:
   // Find the contentEditable div and check its innerHTML
   const editor = document.querySelector('[contenteditable="true"]');
   console.log(editor.innerHTML);
   ```

3. **Check Network Tab**:
   - Verify no network errors preventing image load
   - Data URLs don't make network requests, so shouldn't see any

4. **Verify Save Function**:
   - Add console.log to `saveContent` function
   - Confirm it's being called and content includes image HTML

## Code References

### Image Insertion Function
Location: `WritableSection.tsx` line 270-290
```typescript
const insertImage = useCallback((dataUrl: string, fileName: string) => {
    if (contentEditorRef.current && editState.isEditingContent) {
        const imageHtml = `<img src="${dataUrl}" alt="${fileName}" 
            style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px;" />`;
        // ... insertion logic
    }
}, [editState.isEditingContent]);
```

### Save Content Function
Location: `WritableSection.tsx` line 112-117
```typescript
const saveContent = useCallback(() => {
    if (editState.contentValue !== section.template_content) {
        onUpdateSection({ template_content: editState.contentValue });
    }
    setEditState(prev => ({ ...prev, isEditingContent: false }));
}, [editState.contentValue, section.template_content, onUpdateSection]);
```

## Recent Fixes Applied

1. **Content Initialization Fix** (Just Applied):
   - Fixed issue where entering edit mode would overwrite existing content
   - Now preserves `section.template_content` including images when re-entering edit mode

2. **Cursor Position Fix** (Previously Applied):
   - Fixed cursor jumping to top when typing
   - Removed `dangerouslySetInnerHTML` from contentEditable div
   - Added useEffect to sync content properly

## Need More Help?

If images still aren't working:
1. Take a screenshot of the browser console showing any errors
2. Check what's in `section.template_content` after saving
3. Verify the image file format and size
4. Try with a very small test image (< 100KB)
