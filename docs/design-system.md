# Bloom & Stem Design System

The Botanical Elegance theme is defined in `app/globals.css`. Use semantic tokens instead of raw colors so light and dark themes remain consistent.

## Typography

- `font-serif text-display-lg`: editorial display headings
- `font-serif text-headline-lg`: page and section headings
- `font-serif text-headline-md`: card headings
- `font-sans text-body-lg` / `text-body-md`: body copy
- `font-sans text-label-md` / `text-label-sm`: controls and metadata

## Surfaces and color

- `bg-surface`: page background
- `bg-surface-container-lowest`: cards and overlays
- `bg-surface-container`: chips and muted controls
- `text-on-surface`: primary text
- `text-on-surface-variant`: secondary text
- `bg-primary text-on-primary`: primary actions
- `bg-secondary-container text-on-secondary-container`: promotional surfaces
- `bg-error-container text-on-error-container`: errors

## Primitives

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

<Button>Shop now</Button>
<Button variant="outline">Learn more</Button>
<Input aria-invalid={hasError} placeholder="Email address" />
<Badge variant="sale">Sale</Badge>
<Card><CardHeader><CardTitle>Seasonal flowers</CardTitle></CardHeader><CardContent>...</CardContent></Card>
```

Buttons and inputs are 48px tall by default. Icon-only actions use `IconButton`, which guarantees a 44px touch target.

## Shared components

- `IconButton`: accessible icon-only action
- `Price`: regular and sale pricing
- `RatingStars`: read-only or interactive rating
- `StatusBadge`: semantic order status
- `EmptyState`: empty and error presentations
- `PageHeader`: eyebrow, title, description, and action layout
- `ProductCard`: storefront product presentation
- `QuantityStepper`: stock-aware quantity selection

Animations include reduced-motion fallbacks. Do not add scale, shimmer, or layout animation without a `motion-reduce` alternative.
