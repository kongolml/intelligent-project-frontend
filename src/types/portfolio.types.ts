export enum PortfolioCategorySlugs {
	IDENTITY = "identity",
	WEB = "web",
	PACKAGE = "package",
}

export interface PortfolioCategory {
	id: string;
	name: string;
	slug: PortfolioCategorySlugs;
	description: string;
}

export interface PortfolioItem {
	id: string;
	title: string;
	subtitle?: string;
	client?: string;
	year?: number;
	description?: EditorJSDataBlock[];
	descriptionHTML?: string; // html
	client_goalHTML?: string;
	our_taskHTML?: string;
	conceptHTML?: string;
	categories: {
		name: PortfolioCategory["name"];
		slug: PortfolioCategory["slug"];
	}[];
	main_image: string; // URL to the main image
	mediaFiles: string[]; // urls
	visual_inspiration?: string[]; // resolved URLs
	visual_exploration?: string[]; // resolved URLs
	final_result_gallery?: string[]; // resolved URLs
	slug: string;
	isShowcase?: boolean;
}

export enum EditorJSDataBlockTypesEnum {
	PARAGRAPH = "paragraph",
	HEADER = "header",
	LIST = "list",
	IMAGE = "image",
}

interface EditorJSDataBlockParagraph {
	type: EditorJSDataBlockTypesEnum.PARAGRAPH;
	data: {
		text: string;
	};
}

interface EditorJSDataBlockHeader {
	type: EditorJSDataBlockTypesEnum.HEADER;
	data: {
		text: string;
		level: number;
	};
}

interface EditorJSDataBlockList {
	type: EditorJSDataBlockTypesEnum.LIST;
	data: {
		style: "ordered" | "unordered";
		items: {
			content: string;
		}[]
	};
}

interface EditorJSDataBlockImage {
	type: EditorJSDataBlockTypesEnum.IMAGE;
	data: {
		caption: string;
		file: {
			url: string;
		};
	};
}


export type EditorJSDataBlock = { id?: string } & (EditorJSDataBlockParagraph | EditorJSDataBlockHeader | EditorJSDataBlockList | EditorJSDataBlockImage);
