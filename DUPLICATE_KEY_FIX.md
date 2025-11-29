# React Duplicate Key Fix

## Issue Resolved
**Warning**: `Encountered two children with the same key, page-1764358911900. Keys should be unique...`

**Root Cause**: When creating pages, sections, or items rapidly (e.g., double-clicking "Add Page" button), `Date.now()` could return the same millisecond timestamp, resulting in duplicate React keys.

## Solution Applied

Updated ID generation across all create/duplicate operations to include a random component.

### Before:
```typescript
id: `page-${Date.now()}`        // Could create duplicates!
id: `section-${Date.now()}`     // Could create duplicates!
id: `item-${Date.now()}`        // Could create duplicates!
```

### After:
```typescript
const uniqueId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
id: uniqueId  // Always unique!
```

## Changes Made

### 1. Page Creation (`handleAddPage`)
```typescript
const uniqueId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const newPage: TemplatePage = {
    id: uniqueId,
    // ... other properties
};
```

### 2. Section Creation (`handleAddSection`)
```typescript
const uniqueId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const newSection: VisualSection = {
    id: uniqueId,
    // ... other properties
};
```

### 3. Item Creation (`handleAddQuestionToLastSection`)
```typescript
const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const newItem: TemplateItem = {
    id: uniqueId,
    // ... other properties
};
```

### 4. Section Duplication (`handleDuplicateSection`)
```typescript
const uniqueId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const newSection = {
    ...sectionToDuplicate,
    id: uniqueId,
    // ... other properties
};
```

## How It Works

### ID Format
```
page-1764358911900-x7k2m9p3q
     └─timestamp─┘ └─random─┘
```

- **Timestamp**: Milliseconds since epoch (13 digits)
- **Random**: Base-36 alphanumeric string (9 characters)

### Uniqueness Guarantee
- **Timestamp alone**: Unique per millisecond
- **Random component**: 36^9 = ~10 trillion possibilities
- **Combined**: Virtually guaranteed to be unique

### Example IDs
```
page-1764358911900-x7k2m9p3q
page-1764358911901-a5b8c2d1e
section-1764358912000-z9y8x7w6v
section-1764358912001-p0o9i8u7y
item-1764358912100-m6n5b4v3c
```

## Why This Fix Works

1. **Prevents Time Collisions**: Even if operations happen in the same millisecond
2. **Human-Readable**: Still includes timestamp for sorting/debugging
3. **Short**: Only adds 10 characters (dash + 9 random chars)
4. **No Dependencies**: Uses built-in JavaScript functions
5. **Sortable**: IDs still sort chronologically by timestamp prefix

## Testing

To verify the fix:

1. **Rapid Creation Test**:
   - Quickly click "Add Page" multiple times
   - No duplicate key warnings should appear

2. **Duplicate Test**:
   - Create a section
   - Duplicate it rapidly multiple times
   - Each duplicate should have a unique ID

3. **Console Check**:
   - Open browser console (F12)
   - Look for unique key warnings
   - Should be none after this fix

## Alternative Approaches (Not Used)

1. **UUID**: More complex, longer IDs
2. **Counter**: Requires state management
3. **Crypto.randomUUID()**: Not supported in all browsers
4. **Server-generated IDs**: Requires API call

The timestamp + random approach was chosen for:
- Simplicity
- No external dependencies
- Good performance
- Human-readable for debugging

## Impact

✅ **Before**: Duplicate keys when creating items rapidly
✅ **After**: Guaranteed unique keys for all items
✅ **React warnings**: Eliminated
✅ **Rendering**: Proper component identity maintained
