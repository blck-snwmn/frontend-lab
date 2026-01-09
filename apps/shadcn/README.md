# shadcn/ui Visual Styles

Demo apps comparing 5 shadcn/ui Visual Styles (Base UI version).

## What are Visual Styles?

Visual Styles in shadcn/ui are presets that define component **shape, size, and density**.
The color palette is a shared neutral grayscale - color customization is left to the user.

## Style Characteristics

| Style    | Concept           | Border Radius          | Height | Text Size |
| -------- | ----------------- | ---------------------- | ------ | --------- |
| **Vega** | Neutral (default) | `rounded-md`           | `h-9`  | `text-sm` |
| **Nova** | Modern            | `rounded-lg`           | `h-8`  | `text-sm` |
| **Maia** | Friendly          | `rounded-4xl` (pill)   | `h-9`  | `text-sm` |
| **Lyra** | Brutalist         | `rounded-none` (sharp) | `h-8`  | `text-xs` |
| **Mira** | Compact           | `rounded-md`           | `h-7`  | `text-xs` |

## Notes

- **Colors are identical across all styles**: CSS Variables in `index.css` (oklch colors) are the same
- **Differences are shape only**: Border radius, height, font size vary between styles
- **Visual differences are subtle**: Hard to notice without side-by-side comparison

## Running

```bash
# Run all apps
bun run dev

# Run individually
bun run dev --filter=@ui-lab/vega
bun run dev --filter=@ui-lab/nova
bun run dev --filter=@ui-lab/maia
bun run dev --filter=@ui-lab/lyra
bun run dev --filter=@ui-lab/mira
```

Note: When running multiple apps simultaneously, Vite auto-assigns available ports starting from 5173.
