# Webflow Code Components

A collection of interactive React components designed for import into Webflow Designer. These components feature visual effects like particle systems, animated grids, and interactive UI elements—all running in isolated Shadow DOM environments.

## Live Demo

**[View and test all components →](https://webflow-code-components.webflow.io/)**

Experience the components in action on our live demo site. Interact with each component to see how they work before integrating them into your Webflow projects.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager
- Webflow Freelance or Agency workspace (required for code components)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zehfred/webflow-code-components.git
cd webflow-code-components
```

2. Install dependencies:
```bash
npm install
```

3. Set up Webflow authentication:
   - **Recommended**: Use interactive CLI authentication when running `npx webflow library share` (CLI will open your browser)
   - **Alternative**: Create a `.env` file in the project root and add your Webflow API token: `WEBFLOW_WORKSPACE_API_TOKEN=your_token_here`

### Local Development

Start the development server to preview all components in an interactive showcase:

```bash
npm start
```

This opens a local gallery at `http://localhost:3000` where you can test components with live prop controls.

### Build

Create a production bundle:

```bash
npm run build
```

### Testing

Run the test suite:

```bash
npm test
```

## Available Components

This library includes the following components. Click each link to view detailed documentation:

### Interactive Visual Effects

- **[DotGrid](src/components/DotGrid/README.md)** - Physics-based dot grid with mouse interaction using Canvas and GSAP
- **[GridMotion](src/components/GridMotion/README.md)** - Animated grid with gradient effects powered by GSAP
- **[MagnetLines](src/components/MagnetLines/README.md)** - Magnetic line grid that responds to mouse movement
- **[Particles](src/components/Particles/README.md)** - 3D particle system with WebGL rendering using OGL

### UI Components

- **[FAQ](src/components/FAQ/README.md)** - Accessible accordion component with Collection List support and full keyboard navigation
- **[Modal](src/components/Modal/README.md)** - Centered modal dialog with trigger-based opening, backdrop overlay, and full accessibility support

## AI-Powered Development with Claude Code

**Most of the code in this repository was created using [Claude Code](https://claude.ai/code)**, an AI-powered development assistant. This project includes both a custom Claude skill and Webflow MCP server configuration to enable Claude to understand and work with Webflow efficiently.

### Webflow MCP Server

This repository includes an `.mcp.json` configuration file that connects Claude Code directly to Webflow's APIs through the Model Context Protocol (MCP). The MCP server enables Claude to:

- **Designer API**: Create and modify elements, styles, components, and variables directly on the Webflow canvas with live preview
- **Data API**: Manage CMS collections and items, localization, custom code, pages, and SEO settings
- **Developer Documentation**: Query Webflow's official documentation without leaving your AI environment

**Learn more**: [Webflow MCP Server Documentation](https://developers.webflow.com/data/docs/ai-tools)

### Using the Claude Skill

This project also includes a comprehensive Claude skill at `.claude/skills/webflow-code-components/` with detailed documentation about:
- Webflow component architecture patterns
- Prop types and configuration guides
- Shadow DOM styling strategies
- Component communication patterns
- CLI reference and troubleshooting

To use these tools with Claude Code:
1. Open this project in Claude Code
2. The MCP server will connect automatically (requires authentication on first use)
3. The skill will be available when working on Webflow components
4. Reference `CLAUDE.md` for project conventions and patterns

This setup dramatically speeds up component development by giving Claude deep context about Webflow's requirements, best practices, and the ability to directly interact with your Webflow projects.

## Publishing to Webflow

### Authentication

You have two options for authenticating with Webflow:

1. **Interactive (Recommended)**: Run `npx webflow library share` and the CLI will open your browser for authentication
2. **Manual**: Set `WEBFLOW_WORKSPACE_API_TOKEN` in your `.env` file (requires Workspace Admin permissions)

### Share Components

Publish components to your Webflow workspace:

```bash
npx webflow library share
```

Components will appear in your Webflow Designer under "Code Components" in the Add panel.

## Component Structure

Each component in this library follows a consistent structure:

```
src/components/ComponentName/
├── ComponentName.tsx           # Main React component implementation
├── ComponentName.webflow.tsx   # Webflow declaration & prop mapping
├── ComponentName.css           # Component styles (Shadow DOM isolated)
└── README.md                   # Component documentation
```

**Key files:**
- **`.tsx`** - Pure React implementation for local development
- **`.webflow.tsx`** - Webflow wrapper that declares props using `@webflow/data-types`
- **`.css`** - Isolated styles (site classes don't apply in Shadow DOM)
- **`README.md`** - Documentation for Webflow users

## Contributing

Contributions are welcome! When adding new components:

1. Follow the existing component structure
2. Use the Claude skill for guidance on Webflow patterns
3. Convert Tailwind CSS to standard CSS (components must work in Shadow DOM)
4. Include comprehensive README documentation
5. Add component to `src/App.js` for local testing
6. Test in both local showcase and Webflow Designer

## License

MIT
