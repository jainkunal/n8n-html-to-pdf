import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import puppeteer from 'puppeteer';

export class HtmlToPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML to PDF',
		name: 'htmlToPdf',
		icon: 'file:htmlToPdf.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Convert HTML to PDF',
		defaults: {
			name: 'HTML to PDF',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				default: '',
				required: true,
				description: 'The HTML content to convert to PDF',
				typeOptions: {
					rows: 5,
				},
			},
			{
				displayName: 'PDF Options',
				name: 'pdfOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'A4',
								value: 'A4',
							},
							{
								name: 'Letter',
								value: 'Letter',
							},
						],
						default: 'A4',
					},
					{
						displayName: 'Landscape',
						name: 'landscape',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Margin',
						name: 'margin',
						type: 'string',
						default: '0.4in',
						description: 'PDF margin in inches (e.g., "0.4in")',
					},
				],
			},
			{
				displayName: 'Wait Options',
				name: 'waitOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Wait for Network Idle',
						name: 'waitForNetworkIdle',
						type: 'boolean',
						default: true,
						description: 'Whether to wait for the network to be idle before creating the PDF',
					},
					{
						displayName: 'Additional Delay (ms)',
						name: 'additionalDelay',
						type: 'number',
						default: 0,
						description: 'Additional time to wait after page load (in milliseconds)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const htmlContent = this.getNodeParameter('htmlContent', i) as string;
				const pdfOptions = this.getNodeParameter('pdfOptions', i) as {
					format?: string;
					landscape?: boolean;
					margin?: string;
				};
				const waitOptions = this.getNodeParameter('waitOptions', i) as {
					waitForNetworkIdle?: boolean;
					additionalDelay?: number;
				};

				const browser = await puppeteer.launch({
					headless: 'new',
				});
				const page = await browser.newPage();
				await page.setContent(htmlContent);

				// Wait for network to be idle if enabled
				if (waitOptions.waitForNetworkIdle) {
					await page.waitForNetworkIdle();
				}

				// Wait for any additional delay specified
				if (waitOptions.additionalDelay && waitOptions.additionalDelay > 0) {
					await new Promise((resolve) =>
						setTimeout(resolve, waitOptions.additionalDelay as number),
					);
				}

				const pdfBuffer = await page.pdf({
					format: pdfOptions.format || 'A4',
					landscape: pdfOptions.landscape || false,
					margin: pdfOptions.margin
						? {
								top: pdfOptions.margin,
								right: pdfOptions.margin,
								bottom: pdfOptions.margin,
								left: pdfOptions.margin,
						  }
						: undefined,
				});

				await browser.close();

				returnData.push({
					json: {},
					binary: {
						pdf: await this.helpers.prepareBinaryData(pdfBuffer, 'output.pdf', 'application/pdf'),
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
