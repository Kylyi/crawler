# Project Documentation (`docs/`)

Welcome to the central documentation directory for the `crawler` project.

This directory serves as the single source of truth for architectural decisions, research findings, implementation plans, data schemas, and developer guides.

## Structure

```
docs/
├── README.md               # Overview of the docs directory (this file)
├── goals.md                # Application goals and success criteria
├── database.md             # Database decision and D1 setup
├── schema.md               # Tables, relations, and example queries
├── zakazky-gov-api.md      # Zakázky GOV internal API (discovered)
├── tender-sources.md       # Comprehensive guide to Czech public tender data sources
└── ...                     # Future ADRs, schemas, and plans
```

## Documentation Guidelines

1. **Centralized Hub**: All long-term documentation, research notes, and architectural decisions should be stored here in Markdown format.
2. **Updating Documents**: When changing system architecture, data models, or crawler behavior, update the corresponding documentation file in `docs/`.
3. **Naming Convention**: Use kebab-case for documentation filenames (e.g., `tender-sources.md`, `architecture-overview.md`).
