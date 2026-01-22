# Carbon Design System to shadcn/ui Migration Plan

## Executive Summary

This document outlines the strategy for gradually migrating from Carbon Design System to shadcn/ui. The migration allows existing Carbon components to remain functional while new features are built with shadcn, enabling a phased transition without disrupting the existing application.

---

## Current State Analysis

### Carbon Packages in Use

| Package | Version | Files Affected |
|---------|---------|----------------|
| `@carbon/react` | 1.39.0 | 184 files |
| `@carbon/icons-react` | 11.28.0 | 94 files |
| `@carbon/styles` | 1.39.0 | 1 file (global import) |
| `@carbon/charts-react` | 1.13.6 | 3 files |
| `@carbon/pictograms-react` | 11.49.0 | Minimal |

### Carbon Components Currently Used

#### High Usage
- Button, IconButton
- TextInput, NumberInput
- Tooltip
- Link
- Accordion, AccordionItem
- Table, TableBody, TableCell, TableHead, TableHeader, TableRow

#### Medium Usage
- Modal (ComposedModal, ModalBody, ModalHeader, ModalFooter)
- Dropdown, Select, SelectItem
- MultiSelect, FilterableMultiSelect
- Form, FormLabel
- Checkbox
- RadioButton, RadioButtonGroup
- Tabs (Tab, TabList, TabPanel)

#### Lower Usage
- Toggle
- Tag
- Popover, PopoverContent
- DatePicker, DatePickerInput
- FileUploader
- Search
- SideNav (SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem)
- Breadcrumb

#### Specialized Components
- CopyButton
- OverflowMenu, OverflowMenuItem
- ActionableNotification, InlineNotification
- InlineLoading, SkeletonText
- Toggletip, ToggletipContent, ToggletipButton
- PaginationNav

### Current Styling Architecture

- **Primary Styling**: styled-components (v6.0.7)
- **Pattern**: Carbon components wrapped with `styled()` for customization
- **CSS Variables**: Mix of Carbon tokens (`--cds-*`) and custom variables (`--primary-*`)
- **Global CSS**: Carbon styles imported in `src/core/root.tsx`
- **Tailwind CSS**: Not currently installed

---

## Why Gradual Migration is Feasible

### Technical Compatibility

1. **CSS Isolation**: Carbon uses `cds--*` class prefixes while Tailwind uses utility classes - no conflicts
2. **Component Independence**: Carbon components are individually imported, allowing piece-by-piece replacement
3. **Existing Abstraction Pattern**: The codebase already wraps Carbon components (e.g., `~/@/common/modal`)
4. **Decoupled State Management**: Effector is UI-library agnostic

### Benefits of Gradual Migration

- Zero downtime during migration
- Reduced risk - issues isolated to specific components
- Team can learn shadcn incrementally
- New features immediately benefit from shadcn
- Existing features remain stable

---

## Migration Strategy

### Guiding Principles

1. **New features use shadcn** - All new development uses shadcn components
2. **Existing features stay Carbon** - Until explicitly migrated
3. **Component abstraction** - Create internal UI library that can swap implementations
4. **Parallel systems** - Both design systems coexist during transition
5. **Progressive enhancement** - Migrate by feature area, not randomly

---

## Phase 0: Foundation Setup

### Objectives
- Install and configure Tailwind CSS
- Initialize shadcn/ui
- Establish component directory structure
- Configure theme compatibility

### Tasks

#### 1. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2. Configure Tailwind

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: "", // No prefix to keep shadcn components clean
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### 3. Install shadcn Dependencies

```bash
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
```

#### 4. Create shadcn Configuration

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "~/ui/components",
    "utils": "~/lib/utils",
    "ui": "~/ui/components/shadcn",
    "lib": "~/lib",
    "hooks": "~/lib/hooks"
  }
}
```

#### 5. Create Utility Functions

Create `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### 6. Add Tailwind Directives

Create `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 13%; /* #222222 */

    --card: 0 0% 100%;
    --card-foreground: 0 0% 13%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 13%;

    --primary: 217 100% 58%; /* #277AFF */
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 22%; /* #393939 */
    --secondary-foreground: 0 0% 100%;

    --muted: 0 0% 95%; /* #F2F2F2 */
    --muted-foreground: 0 0% 44%; /* #6F6F6F */

    --accent: 0 0% 95%;
    --accent-foreground: 0 0% 13%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 85%;
    --input: 0 0% 85%;
    --ring: 217 100% 58%;

    --radius: 0.5rem;

    /* Status colors from existing design */
    --success: 145 100% 32%; /* #00A651 */
    --warning: 39 95% 54%; /* #FAA61A */
    --error: 357 87% 52%; /* #ED1C24 */
  }

  .dark {
    --background: 0 0% 13%;
    --foreground: 0 0% 95%;
    /* ... dark mode variables */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

#### 7. Update Webpack Configuration

Modify `webpack/postcss.ts` to include Tailwind:

```ts
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export const postcssOptions = {
  plugins: [
    tailwindcss,
    autoprefixer,
    // ... existing plugins
  ],
};
```

#### 8. Directory Structure

```
src/
├── ui/
│   ├── components/
│   │   ├── shadcn/           # Raw shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── index.ts          # Public exports
│   └── index.ts
├── lib/
│   └── utils.ts              # cn() helper
├── styles/
│   └── globals.css           # Tailwind directives + CSS variables
```

---

## Phase 1: Foundation Components

### Components to Migrate

| Carbon Component | shadcn Equivalent | Priority |
|------------------|-------------------|----------|
| Button | Button | High |
| IconButton | Button (with icon) | High |
| TextInput | Input | High |
| Link | Custom + cn() | High |
| Tooltip | Tooltip | High |
| Tag | Badge | Medium |

### Migration Pattern

For each component:

1. Install shadcn component: `npx shadcn@latest add button`
2. Create adapter if Carbon API compatibility needed
3. Use in new features
4. Document usage in team wiki

### Example: Button Migration

```tsx
// src/ui/components/shadcn/button.tsx
// Install: npx shadcn@latest add button

// src/ui/components/button.tsx (adapter for Carbon API compatibility)
import { Button as ShadcnButton, ButtonProps } from "./shadcn/button"
import { cn } from "~/lib/utils"

type CarbonButtonKind = "primary" | "secondary" | "tertiary" | "ghost" | "danger"

interface AdapterButtonProps extends Omit<ButtonProps, "variant"> {
  kind?: CarbonButtonKind
}

const kindToVariant: Record<CarbonButtonKind, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  ghost: "ghost",
  danger: "destructive",
}

export const Button = ({ kind = "primary", className, ...props }: AdapterButtonProps) => {
  return (
    <ShadcnButton
      variant={kindToVariant[kind]}
      className={cn(className)}
      {...props}
    />
  )
}
```

---

## Phase 2: Form Components

### Components to Migrate

| Carbon Component | shadcn Equivalent |
|------------------|-------------------|
| Select, SelectItem | Select |
| Dropdown | Select or Combobox |
| Checkbox | Checkbox |
| RadioButton, RadioButtonGroup | RadioGroup |
| Toggle | Switch |
| Form, FormLabel | Form (react-hook-form) |
| DatePicker | DatePicker (with date-fns) |
| MultiSelect | Custom with Popover + Command |
| FilterableMultiSelect | Combobox (multi) |
| NumberInput | Input (type="number") |
| Search | Input with search icon |
| FileUploader | Custom or third-party |

### Special Considerations

#### MultiSelect / FilterableMultiSelect

Carbon's MultiSelect is feature-rich. shadcn approach:

```tsx
// Use Combobox pattern with multi-select capability
// Requires: npx shadcn@latest add popover command
```

#### DatePicker

shadcn uses `react-day-picker` with `date-fns`:

```bash
npx shadcn@latest add calendar
npx shadcn@latest add popover
# Combine into DatePicker
```

---

## Phase 3: Complex Components

### Components to Migrate

| Carbon Component | shadcn Equivalent |
|------------------|-------------------|
| ComposedModal | Dialog |
| Table, DataTable | Table + TanStack Table |
| Accordion | Accordion |
| Tabs | Tabs |
| Popover | Popover |
| OverflowMenu | DropdownMenu |
| Notification | Toast (sonner) |
| InlineNotification | Alert |

### DataTable Strategy

Carbon's DataTable has built-in sorting, filtering, pagination. Recommended approach:

1. Use shadcn Table for basic tables
2. Use TanStack Table (@tanstack/react-table) for advanced features
3. Create wrapper components for common patterns

```bash
npm install @tanstack/react-table
npx shadcn@latest add table
```

### Modal/Dialog Migration

```tsx
// Current Carbon usage:
import { ComposedModal, ModalBody, ModalHeader } from "@carbon/react"

// shadcn equivalent:
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/ui/components/shadcn/dialog"
```

---

## Phase 4: Navigation & Layout

### Components to Migrate

| Carbon Component | shadcn Equivalent |
|------------------|-------------------|
| SideNav | Sidebar (custom or shadcn) |
| SideNavLink | NavigationMenu or custom |
| Breadcrumb | Breadcrumb |
| Loading | Skeleton |
| InlineLoading | Spinner (custom) |
| SkeletonText | Skeleton |

### SideNav Strategy

The admin panel uses Carbon's SideNav extensively. Options:

1. **Keep Carbon SideNav** - It works well, low priority to replace
2. **Use shadcn Sidebar** - Install and adapt
3. **Custom implementation** - Build with shadcn primitives

---

## Phase 5: Icons Migration

### Current State

94 files use `@carbon/icons-react`

### Options

#### Option A: Keep Carbon Icons (Recommended Initially)

Carbon icons work independently and don't conflict with shadcn. Keep using them during initial migration phases.

#### Option B: Migrate to Lucide Icons

shadcn uses Lucide icons by default. For consistency, eventually migrate:

```tsx
// Before (Carbon)
import { Edit, TrashCan, View } from '@carbon/icons-react'

// After (Lucide)
import { Pencil, Trash2, Eye } from 'lucide-react'
```

Create icon mapping file for systematic replacement:

```ts
// src/lib/icon-mapping.ts
export const iconMap = {
  Edit: "Pencil",
  TrashCan: "Trash2",
  View: "Eye",
  // ... etc
}
```

---

## Phase 6: Cleanup

### Tasks

1. **Remove Carbon dependencies** from `package.json`:
   - `@carbon/react`
   - `@carbon/styles`
   - `@carbon/icons-react` (if migrated)
   - `@carbon/pictograms-react`

2. **Remove Carbon CSS import** from `src/core/root.tsx`:
   ```tsx
   // Remove this line
   import '@carbon/styles/css/styles.css';
   ```

3. **Clean up styled-components wrappers** that were wrapping Carbon components

4. **Remove Carbon-specific CSS variables** (`--cds-*`) that are no longer used

5. **Update TypeScript types** - Remove Carbon type imports

6. **Bundle optimization** - Verify bundle size reduction

---

## Component Mapping Reference

| Carbon | shadcn | Notes |
|--------|--------|-------|
| `Button` | `Button` | Map `kind` to `variant` |
| `IconButton` | `Button` + icon | Use `size="icon"` variant |
| `TextInput` | `Input` | Direct replacement |
| `NumberInput` | `Input` | Add type="number" |
| `Select` | `Select` | Similar API |
| `Dropdown` | `Select` | - |
| `MultiSelect` | `Combobox` (custom) | Requires composition |
| `Checkbox` | `Checkbox` | Direct replacement |
| `RadioButton` | `RadioGroup` | Different structure |
| `Toggle` | `Switch` | Direct replacement |
| `Tooltip` | `Tooltip` | Similar API |
| `Modal` | `Dialog` | Different structure |
| `Table` | `Table` | For complex: TanStack |
| `Accordion` | `Accordion` | Direct replacement |
| `Tabs` | `Tabs` | Similar API |
| `Tag` | `Badge` | Direct replacement |
| `Popover` | `Popover` | Similar API |
| `OverflowMenu` | `DropdownMenu` | - |
| `Notification` | `Toast` | Use sonner |
| `InlineNotification` | `Alert` | - |
| `Breadcrumb` | `Breadcrumb` | Direct replacement |
| `Search` | `Input` + icon | Custom composition |
| `DatePicker` | `Calendar` + `Popover` | Composition needed |
| `FileUploader` | Custom | Use react-dropzone |
| `Loading` | `Skeleton` | - |
| `Link` | Native `a` + `cn()` | Or custom component |

---

## Best Practices

### For New Features

1. Always use shadcn components
2. Follow shadcn patterns and conventions
3. Use Tailwind for styling (avoid styled-components for new code)
4. Leverage CSS variables for theming

### For Existing Features

1. Don't refactor unless explicitly planned
2. If touching a file significantly, consider migrating its components
3. Document any Carbon-specific code that must remain

### Code Organization

```tsx
// Preferred import pattern for new code
import { Button } from "~/ui/components/button"
import { Input } from "~/ui/components/input"
import { cn } from "~/lib/utils"

// Avoid direct Carbon imports in new code
// ❌ import { Button } from "@carbon/react"
```

### Styling Guidelines

```tsx
// New code: Use Tailwind classes
<div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
  <Button>Click me</Button>
</div>

// Avoid: styled-components for new layouts
// ❌ const Container = styled.div`...`
```

---

## Testing Strategy

### Unit Tests

- Update component imports in test files as components are migrated
- Ensure test coverage for adapter components
- Mock shadcn components similarly to Carbon

### Visual Regression

- Consider adding visual regression tests before migration
- Compare screenshots before/after component migration
- Use Storybook or Chromatic if available

### Integration Testing

- Test full user flows after each phase
- Pay attention to form submissions
- Verify modal/dialog behaviors

---

## Rollback Plan

If issues arise with a migrated component:

1. The adapter pattern allows quick rollback to Carbon
2. Keep Carbon dependencies until full migration complete
3. Use feature flags for gradual rollout if needed

```tsx
// Emergency rollback pattern
const USE_SHADCN_BUTTON = true // Toggle this

export const Button = USE_SHADCN_BUTTON 
  ? ShadcnButton 
  : CarbonButton
```

---

## Notes on @carbon/charts-react

The charting library is only used in 3 files and is independent of the component system. 

**Recommendation**: Keep `@carbon/charts-react` as-is. It's specialized, well-functioning, and not worth the effort to replace unless you have specific requirements.

Alternative charting libraries if needed later:
- Recharts
- Chart.js with react-chartjs-2
- Nivo
- Tremor (Tailwind-based)

---

## Checklist Summary

### Phase 0: Setup
- [ ] Install Tailwind CSS
- [ ] Configure Tailwind
- [ ] Install shadcn dependencies
- [ ] Create `components.json`
- [ ] Create utility functions (`cn`)
- [ ] Add Tailwind directives CSS file
- [ ] Update webpack/postcss configuration
- [ ] Create directory structure
- [ ] Import globals.css in app entry

### Phase 1: Foundation
- [ ] Button
- [ ] Input
- [ ] Tooltip  
- [ ] Link
- [ ] Badge

### Phase 2: Forms
- [ ] Select
- [ ] Checkbox
- [ ] RadioGroup
- [ ] Switch
- [ ] Form components
- [ ] DatePicker
- [ ] MultiSelect (custom)

### Phase 3: Complex
- [ ] Dialog (Modal)
- [ ] Table
- [ ] Accordion
- [ ] Tabs
- [ ] Popover
- [ ] DropdownMenu
- [ ] Toast
- [ ] Alert

### Phase 4: Navigation
- [ ] Sidebar
- [ ] Breadcrumb
- [ ] Skeleton

### Phase 5: Icons
- [ ] Create icon mapping
- [ ] Replace icons (optional)

### Phase 6: Cleanup
- [ ] Remove Carbon dependencies
- [ ] Remove Carbon CSS import
- [ ] Clean styled-components wrappers
- [ ] Remove unused CSS variables
- [ ] Verify bundle size

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [TanStack Table](https://tanstack.com/table/latest)
- [Lucide Icons](https://lucide.dev/icons/)
