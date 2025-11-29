# Phase 3: Form Builder & Advanced Features

## Objective
Implement the Form Builder logic to render actual form inputs in sections, and enhance image/section management.

## Tasks

### 1. Form Element Rendering
- [ ] Create `FormElementRenderer` component to render inputs based on `FormElementType`.
- [ ] Update `DraggableSection` to use `FormElementRenderer` instead of listing items.
- [ ] Implement drag-and-drop sorting of form elements *within* a section.
- [ ] Integrate `SectionEditor` (Rich Text) into `DraggableSection` for editing `template_content`.
- [ ] Implement Item Deletion and Duplication (within Section or via RightPanel).
- [ ] Implement Item Selection in `DraggableSection` to allow editing properties in `RightPanel`.

### 2. Form Element Properties
- [ ] Enhance `RightPanel` to edit specific properties for each form element type (e.g., validation, placeholder, options).

### 3. Image Enhancements
- [ ] Add image cropping functionality.
- [ ] Add image filters (brightness, contrast).
- [ ] Add "Replace Image" functionality.

### 4. Layer Management
- [ ] Create `LayersPanel` in `LeftPanel`.
- [ ] Implement reordering of layers (z-index).
- [ ] Implement visibility toggle for layers.

### 5. Undo/Redo
- [ ] Implement a history stack for canvas actions.
