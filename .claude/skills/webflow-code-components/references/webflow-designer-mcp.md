# Webflow Designer MCP Integration

Guide to using Webflow Designer MCP (Model Context Protocol) tools to manage your Webflow website directly through Claude Code.

## Overview

The Webflow Designer MCP provides tools for accessing and managing your Webflow site's content, pages, elements, and CMS collections. This is particularly useful for:

- Adding descriptive content to component showcase pages
- Updating page content programmatically
- Managing CMS collections
- Editing elements without manual Designer work
- Publishing site changes

**Important:** These tools are separate from the Webflow CLI used for importing code components. The MCP tools interact with your live Webflow Designer, while the CLI imports React components.

## Prerequisites

### Tool Availability Check

**Always verify MCP tools are available before using them:**

```typescript
// Check if Webflow MCP tools exist
const hasWebflowMCP = typeof mcp__webflow__sites_list === 'function';

if (!hasWebflowMCP) {
  console.log('Webflow Designer MCP tools not available');
  return; // Fallback to alternative approach
}
```

Not all Claude Code environments may have Webflow MCP installed. Always check availability and provide graceful degradation.

### Connection Requirements

1. **User must have a Webflow account** with Designer access
2. **User must click the Designer connection link** provided by Claude
3. **User must have the target site open** in Webflow Designer

## Getting Started

### 1. Activate Designer Connection

The user must click a special link to connect Claude Code to their Webflow Designer:

```
https://[site-short-name].design.webflow.com?app=[app-id]
```

**Workflow:**
1. Use `mcp__webflow__sites_list` to get available sites
2. Extract the `shortName` from the site you want to work with
3. Generate the Designer connection URL
4. Ask user to click the link and confirm when connected

**Example:**
```markdown
Please click this link to connect to Webflow Designer:

[Launch Webflow Designer App](https://webflow-code-components.design.webflow.com?app=dc8209c65e3ec02254d15275ca056539c89f6d15741893a0adf29ad6f381eb99)

Let me know once the Designer has loaded and shows "connected".
```

### 2. Verify Connection

```typescript
// Test connection with a simple page list
const pages = await mcp__webflow__pages_list({ site_id: siteId });
if (pages.error) {
  console.log('Connection failed - ask user to click link again');
}
```

## Common Workflows

### Listing Sites and Pages

**Get all accessible sites:**
```typescript
const { sites } = await mcp__webflow__sites_list();

// Find specific site
const targetSite = sites.find(s => s.displayName === 'My Site');
const siteId = targetSite.id;
```

**List pages in a site:**
```typescript
const { pages } = await mcp__webflow__pages_list({ site_id: siteId });

// Find component pages in a folder
const componentPages = pages.filter(p =>
  p.parentId === componentFolderId
);
```

### Navigating to Pages

**Switch to a specific page:**
```typescript
await mcp__webflow__de_page_tool({
  siteId: siteId,
  actions: [{ switch_page: { page_id: pageId } }]
});
```

**Get current page:**
```typescript
const result = await mcp__webflow__de_page_tool({
  siteId: siteId,
  actions: [{ get_current_page: true }]
});
```

### Working with Elements

#### Critical: User Must Select Elements

For certain operations, **the user must manually select the target element** in Webflow Designer first.

**Workflow:**
1. Switch to the target page
2. Ask user to select the specific element (e.g., "section with class `section-inner--about`")
3. Wait for user confirmation
4. Proceed with element operations

**Example prompt to user:**
```markdown
I've switched to the [Page Name] page.

Please select the `section-inner--about` section on this page in the Webflow Designer, then let me know when you've selected it.
```

#### Getting Selected Element

```typescript
const result = await mcp__webflow__element_tool({
  siteId: siteId,
  actions: [{ get_selected_element: true }]
});

const elementId = result[0].data.id;
// elementId structure: { component: "...", element: "..." }
```

#### Creating Elements

Use `element_builder` to add new elements to a page:

```typescript
await mcp__webflow__element_builder({
  siteId: siteId,
  actions: [{
    parent_element_id: elementId,
    creation_position: "append", // or "prepend"
    element_schema: {
      type: "Heading",
      set_heading_level: { heading_level: 2 },
      set_text: { text: "About This Component" }
    }
  }]
});
```

**Available element types:**
- `Heading` (requires `set_heading_level`)
- `Paragraph`
- `TextBlock`
- `DivBlock`
- `Section`
- `Container`
- `Image`
- `Button`
- `TextLink`
- `LinkBlock`

**Common element operations:**
- `set_text` - Set text content
- `set_heading_level` - Set h1-h6 level (1-6)
- `set_style` - Apply class names
- `set_link` - Set link URL
- `set_image_asset` - Set image source

#### Creating Multiple Elements

Create several elements in sequence by calling `element_builder` multiple times:

```typescript
// Add heading
await mcp__webflow__element_builder({
  siteId: siteId,
  actions: [{
    parent_element_id: sectionId,
    creation_position: "append",
    element_schema: {
      type: "Heading",
      set_heading_level: { heading_level: 2 },
      set_text: { text: "Main Title" }
    }
  }]
});

// Add paragraph
await mcp__webflow__element_builder({
  siteId: siteId,
  actions: [{
    parent_element_id: sectionId,
    creation_position: "append",
    element_schema: {
      type: "Paragraph",
      set_text: { text: "Description text here..." }
    }
  }]
});
```

### Publishing Changes

```typescript
await mcp__webflow__sites_publish({
  site_id: siteId,
  publishToWebflowSubdomain: true,
  customDomains: [] // or array of domain strings
});
```

## Real-World Example

Here's a complete workflow for adding content to multiple component pages:

```typescript
// 1. Get site ID
const { sites } = await mcp__webflow__sites_list();
const site = sites.find(s => s.shortName === 'my-components-site');

// 2. Generate connection link
console.log(`
Please click this link:
https://${site.shortName}.design.webflow.com?app=${appId}
`);

// Wait for user to connect...

// 3. Get component pages
const { pages } = await mcp__webflow__pages_list({ site_id: site.id });
const componentPages = pages.filter(p => p.title.includes('Component'));

// 4. For each page:
for (const page of componentPages) {
  // Switch to page
  await mcp__webflow__de_page_tool({
    siteId: site.id,
    actions: [{ switch_page: { page_id: page.id } }]
  });

  // Ask user to select target section
  console.log(`
    Now on ${page.title} page.
    Please select the 'section-inner--about' section.
  `);

  // Wait for user confirmation...

  // Get selected element
  const result = await mcp__webflow__element_tool({
    siteId: site.id,
    actions: [{ get_selected_element: true }]
  });

  const sectionId = result[0].data.id;

  // Add content elements
  await mcp__webflow__element_builder({
    siteId: site.id,
    actions: [{
      parent_element_id: sectionId,
      creation_position: "append",
      element_schema: {
        type: "Heading",
        set_heading_level: { heading_level: 2 },
        set_text: { text: "About This Component" }
      }
    }]
  });

  // Add more elements as needed...
}
```

## Connection Issues

### Connection Dropped

The Designer connection can drop during long operations. Symptoms:

```
Error: Stream closed
Error: Tool permission stream closed before response received
```

**Solution:**
1. Ask user to refresh or click the connection link again
2. Wait for "connected" confirmation
3. Resume from where you left off

### Element Not Found

If you get "Element not found" errors:

1. Verify page is loaded
2. Check element ID structure is correct: `{ component: "...", element: "..." }`
3. Ensure element actually exists on the page
4. Ask user to select the element again

### Tool Unavailable Errors

If Designer tools return errors about connection:

```typescript
{
  status: false,
  error: "Unable to connect to Webflow Designer..."
}
```

**Solution:**
1. Generate fresh connection link with site shortName
2. Ask user to click it
3. Wait for explicit confirmation

## Best Practices

### 1. Always Check Tool Availability

```typescript
if (typeof mcp__webflow__sites_list !== 'function') {
  // MCP tools not available
  // Provide alternative instructions to user
  return;
}
```

### 2. User Communication

Be explicit about what the user needs to do:

✅ **Good:**
```markdown
I've switched to the Dot Grid Component page.

Please select the section with class `section-inner--about`
in the Webflow Designer, then reply "go" when ready.
```

❌ **Bad:**
```markdown
Select the section please.
```

### 3. Batch Operations Carefully

Don't create too many elements in rapid succession. Split into logical chunks:

```typescript
// Create main heading and intro paragraph
await createElements(sectionId, [heading, introParagraph]);

// Create customization section
await createElements(sectionId, [subheading, ...bulletPoints]);

// Create closing paragraph
await createElements(sectionId, [closingParagraph]);
```

### 4. Handle Failures Gracefully

```typescript
try {
  const result = await mcp__webflow__element_builder({...});
  if (result[0].status === 'error') {
    console.log('Element creation failed:', result[0].message);
    // Provide guidance to user
  }
} catch (error) {
  console.log('Connection lost - please reconnect');
}
```

### 5. Track Progress

When working on multiple pages, keep the user informed:

```markdown
✅ Dot Grid Component - Description added
✅ Magnetic Lines Component - Description added
⏳ Particles Component - In progress...
⏸️ FAQ Component - Pending
⏸️ Modal Component - Pending
```

## Limitations

### What You Cannot Do

- **Access elements without user selection** - Some operations require manual selection
- **Work offline** - Designer must be open and connected
- **Modify elements in bulk efficiently** - Each element operation is separate
- **Access the Visual Editor directly** - Changes are code-driven, not visual

### Performance Considerations

- Each MCP tool call has network latency
- Creating many elements takes time (sequential operations)
- Connection can timeout with very long operations
- Large page element trees may be slow to query

## MCP Tools Reference

### Site Management
- `mcp__webflow__sites_list` - Get all sites
- `mcp__webflow__sites_get` - Get site details
- `mcp__webflow__sites_publish` - Publish site

### Page Management
- `mcp__webflow__pages_list` - List pages
- `mcp__webflow__pages_get_metadata` - Get page meta
- `mcp__webflow__pages_update_page_settings` - Update page
- `mcp__webflow__de_page_tool` - Switch pages, create pages

### Element Management
- `mcp__webflow__element_tool` - Get/select elements
- `mcp__webflow__element_builder` - Create elements
- `mcp__webflow__style_tool` - Manage styles

### CMS Management
- `mcp__webflow__collections_list` - List collections
- `mcp__webflow__collections_items_list_items` - List items
- `mcp__webflow__collections_items_create_item_live` - Create items
- `mcp__webflow__collections_items_update_items_live` - Update items

### Asset Management
- `mcp__webflow__asset_tool` - Manage assets and folders

## Related Documentation

- [Webflow Designer API](https://developers.webflow.com/designer/reference/introduction) - Official Designer API docs
- [Webflow Data API](https://developers.webflow.com/data/reference/introduction) - REST API for programmatic access
- [CLI Reference](./cli-reference.md) - For importing code components

## Summary

The Webflow Designer MCP tools allow you to:
- ✅ Access and navigate Webflow sites and pages
- ✅ Create and modify page elements
- ✅ Manage CMS content
- ✅ Publish changes
- ⚠️ Requires active Designer connection (user must click link)
- ⚠️ Requires manual element selection for certain operations
- ⚠️ Always check tool availability before use

Use these tools alongside the Webflow CLI for a complete component development and site management workflow.
