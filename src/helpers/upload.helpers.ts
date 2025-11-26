import path from 'path';
import fs from 'fs';

const updateFilePath = (targetDir: string, file: Express.Multer.File): Express.Multer.File => {
	if (!file) {
		return null;
	}

	const filename = file.filename as string;
	const filePath = file.path as string;

	if (!filename || !filePath) {
		throw new Error('File is missing required properties (filename or path)');
	}

	const targetPath = path.join(targetDir, filename);

	// Ensure directory exists
	fs.mkdirSync(targetDir, { recursive: true });

	// Move the file from tmp to target directory
	fs.renameSync(filePath, targetPath);

	// Return a new object with updated path instead of mutating the original
	return {
		...file,
		path: targetPath,
	};
};

export function toPublicUrl(filePath: string): string {
	const baseUrl = process.env.BACKEND_URL;

	const relativePath = path.relative('./uploads', filePath).replace(/\\/g, '/');

	return `${baseUrl}/uploads/${relativePath}`;
}

export default { updateFilePath, toPublicUrl };
