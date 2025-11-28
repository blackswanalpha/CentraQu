# Quick Start Guide - Assure

Get up and running with the Assure application in minutes.

## 🚀 Installation

```bash
# Navigate to project directory
cd /home/mbugua/Documents/augment-projects/AssureHub/assure

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

## 📱 Available Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Login | `/auth/login` | User authentication |
| 2FA | `/auth/2fa` | Two-factor verification |
| Workspace | `/auth/workspace` | Workspace selection |
| Setup | `/auth/setup` | Onboarding wizard |
| Complete | `/auth/complete` | Setup confirmation |
| Dashboard | `/dashboard` | Main application |

## 🎨 Design System Quick Reference

### Colors (Design System)

```css
/* Primary Blue - Trust & Reliability */
bg-primary          /* #1565C0 - Main brand color */
hover:bg-primary-hover  /* #1E88E5 - Hover state */

/* Accent Orange - Energy & Progress */
bg-accent           /* #FB8C00 - Highlights, alerts */

/* Success Green - Growth & Completion */
bg-success          /* #43A047 - Success states */

/* Error Red - Errors & Alerts */
bg-error            /* #E53935 - Errors, destructive actions */

/* Neutral */
bg-neutral-light    /* #F9FAFB - Light background */
bg-dark             /* #212121 - Dark background */
```

### Typography

```css
/* Headings */
text-heading-1      /* 60px - Page titles */
text-heading-2      /* 48px - Section headers */
text-heading-3      /* 40px - Subsections */
text-heading-4      /* 35px - Card titles */
text-heading-5      /* 28px - Widget titles */
text-heading-6      /* 24px - Small titles */

/* Body */
text-body-2xlg      /* 22px - Large text */
text-base           /* 16px - Standard text */
text-body-sm        /* 14px - Secondary text */
text-body-xs        /* 12px - Labels */
```

### Spacing

```css
p-1                 /* 4px */
p-2                 /* 8px */
p-4                 /* 16px */
p-8                 /* 32px */
```

### Components

```css
.btn-primary        /* Primary button */
.btn-secondary      /* Secondary button */
.btn-accent         /* Accent button */
.card               /* Card container */
.form-field         /* Form field wrapper */
.input-label        /* Input label */
.input-error        /* Error message */
```

## 🧩 Common Code Patterns

### Using useForm Hook

```typescript
import { useForm } from "@/hooks/useForm";

const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: "", password: "" },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    return errors;
  },
  onSubmit: async (values) => {
    // Handle form submission
    console.log("Form submitted:", values);
  },
});
```

### Using Utility Functions

```typescript
import { cn, validateEmail, formatTime } from "@/lib/utils";

// Combine class names
const className = cn("base-class", condition && "conditional-class");

// Validate email
if (validateEmail("user@example.com")) {
  console.log("Valid email");
}

// Format time
const timeString = formatTime(125); // "02:05"
```

### Creating a Form Field

```typescript
<div className="form-field">
  <label className="input-label">Email Address</label>
  <input
    type="email"
    placeholder="you@example.com"
    value={values.email}
    onChange={(e) => handleChange("email", e.target.value)}
    onBlur={() => handleBlur("email")}
  />
  {errors.email && <span className="input-error">{errors.email}</span>}
</div>
```

### Creating a Button

```typescript
<button className="btn-primary" onClick={handleSubmit}>
  Sign In
</button>

<button className="btn-secondary">
  Cancel
</button>

<button className="btn-accent" disabled>
  Disabled
</button>
```

## 📱 Responsive Design

Use Tailwind CSS breakpoints for responsive design:

```css
/* Mobile first */
p-4                 /* All screens */
md:p-6              /* Tablet and up (768px) */
lg:p-8              /* Desktop and up (1024px) */

/* Grid layouts */
grid-cols-1         /* Mobile - 1 column */
md:grid-cols-2      /* Tablet - 2 columns */
lg:grid-cols-3      /* Desktop - 3 columns */

/* Display */
hidden              /* Hidden on all screens */
md:block             /* Visible on tablet and up */
lg:flex              /* Flex on desktop and up */
```

## 🔐 Authentication Flow

```
1. User visits /auth/login
2. Enters email and password
3. Redirects to /auth/2fa
4. Enters 6-digit code
5. Redirects to /auth/workspace
6. Selects workspace (Audit or Consulting)
7. Redirects to /auth/setup
8. Completes 4-step setup wizard
9. Redirects to /auth/complete
10. Auto-redirects to /dashboard
```

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📚 Documentation

- **README.md** - Project overview
- **DESIGN_SYSTEM.md** - Design specifications
- **AUTHENTICATION.md** - Authentication flow
- **COMPONENT_ARCHITECTURE.md** - Component patterns
- **IMPLEMENTATION_SUMMARY.md** - Project completion status

## 🎯 Common Tasks

### Add a New Page

1. Create directory: `src/app/new-page/`
2. Create file: `src/app/new-page/page.tsx`
3. Add content and export default component

### Add a New Component

1. Create file: `src/components/MyComponent.tsx`
2. Define component with TypeScript
3. Export component
4. Import and use in pages

### Add a New Utility Function

1. Add function to `src/lib/utils.ts`
2. Export function
3. Import and use in components

### Add a New Hook

1. Create file: `src/hooks/useMyHook.ts`
2. Define hook logic
3. Export hook
4. Import and use in components

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 📞 Need Help?

1. Check the documentation files
2. Review component examples
3. Check the design system guide
4. Review authentication flow

---

**Version**: 1.0.0  
**Last Updated**: October 22, 2025

