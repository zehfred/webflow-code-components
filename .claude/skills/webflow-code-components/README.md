# Webflow Code Components Developer Skill

Expert guidance for developing React code components that integrate with Webflow Designer.

## About This Skill

This skill transforms Claude into a specialized Webflow code component development expert. It provides comprehensive knowledge about:

- Component architecture and Shadow DOM isolation
- Prop configuration with Webflow data types
- Styling within Shadow DOM constraints
- Component communication patterns
- Data fetching and API integration
- CLI workflows and troubleshooting
- Performance optimization and best practices

## When to Use

This skill triggers when users are:

- Setting up Webflow code component projects
- Creating or declaring React components for Webflow
- Styling components with Shadow DOM limitations
- Implementing component communication
- Troubleshooting import or rendering issues
- Working with wrapper components for complex props
- Using Webflow-specific hooks

## Skill Contents

### SKILL.md

The main skill file providing:

- Quick reference guides and tables
- Core concepts and constraints
- Common patterns and workflows
- Implementation guidance
- Troubleshooting quick reference

### references/

Comprehensive documentation loaded as needed:

- **getting-started.md** - Setup, installation, first component
- **component-declaration.md** - Complete `declareComponent` API reference
- **prop-types.md** - All prop types with full configuration options
- **wrapper-components.md** - Transform complex prop types
- **hooks.md** - `useWebflowContext` patterns and examples
- **architecture.md** - Shadow DOM, React roots, SSR details
- **styling.md** - CSS strategies, Shadow DOM, site variables
- **component-communication.md** - State sharing patterns
- **data-fetching.md** - API integration, caching, requests
- **cli-reference.md** - All CLI commands and options
- **best-practices.md** - Comprehensive recommendations
- **troubleshooting.md** - Common issues and solutions

## Progressive Disclosure Design

This skill uses a three-level loading system:

1. **Metadata** - Always in context (~100 words)
2. **SKILL.md** - Loaded when skill triggers (~5k words)
3. **Reference files** - Loaded by Claude as needed for specific questions

This approach keeps context efficient while providing comprehensive guidance when required.

## Usage Pattern

When helping users:

1. Start with SKILL.md for quick reference
2. Load specific reference files only when needed
3. Provide code examples with best practices
4. Reference official documentation when appropriate

## Installation

To use this skill with Claude:

1. Upload the skill zip file to Claude
2. Enable the skill in your conversation
3. Claude will automatically reference it for Webflow component development questions

## License

See LICENSE.txt for complete terms.
