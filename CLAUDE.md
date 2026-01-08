# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Development (single app)
bun run dev --filter=@ui-lab/vega
bun run dev --filter=@ui-lab/react-bits

# Build
bun run build                        # all workspaces
bun run build --filter=@ui-lab/lyra  # single app

# Linting (oxlint only - ESLint is forbidden)
bun run lint                # all workspaces
bun run lint -- --fix       # auto-fix

# Formatting (oxfmt only - Prettier is forbidden)
bun run fmt                 # format all
bun run fmt:check           # check only

# Type checking
bun run typecheck
```

## Architecture

**Monorepo**: Turborepo + Bun workspaces

```
apps/
├── shadcn/          # shadcn/ui Visual Styles demos (Base UI)
│   ├── vega/        # Neutral (default) - rounded-md, h-9
│   ├── nova/        # Modern - rounded-lg, h-8
│   ├── maia/        # Friendly - pill shapes (rounded-4xl)
│   ├── lyra/        # Brutalist - sharp corners (rounded-none)
│   └── mira/        # Compact - smaller (h-7, text-xs)
└── react-bits/      # Animated components (Motion, OGL)
```

**Tech stack per app**: React 19 + Vite + Tailwind CSS 4

## Linter/Formatter Rules

| Tool     | Status    |
|----------|-----------|
| oxlint   | Required  |
| oxfmt    | Required  |
| eslint   | FORBIDDEN |
| prettier | FORBIDDEN |

Linting runs with `--type-aware --type-check --deny-warnings` (all warnings are errors).

## Verification Checklist

Before committing, ensure:
1. `bun run build` passes
2. `bun run lint` passes
3. `bun run fmt:check` passes
4. Dev server works in browser
