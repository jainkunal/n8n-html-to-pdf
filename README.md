![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-html-to-pdf

This is an n8n community node that converts HTML content to PDF using Puppeteer.

## Installation

1. Install the package in your n8n custom nodes directory:

```bash
cd ~/.n8n/custom
npm install n8n-nodes-html-to-pdf
```

2. Restart n8n

## Usage

The node accepts HTML content as input and outputs a PDF file. You can configure the following options:

- **HTML Content**: The HTML content to convert to PDF
- **PDF Options**:
  - **Format**: Page format (A4 or Letter)
  - **Landscape**: Whether to use landscape orientation
  - **Margin**: Page margins in inches

### Example Workflow

1. Add the "HTML to PDF" node to your workflow
2. Connect it to a node that provides HTML content
3. Configure the PDF options as needed
4. The node will output a binary PDF file that can be saved or processed further

## Development

To develop this node:

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the code:

```bash
pnpm build
```

4. Link the package to your n8n installation:

```bash
cd ~/.n8n/custom
npm link /path/to/n8n-nodes-html-to-pdf
```

## License

[MIT](LICENSE.md)
