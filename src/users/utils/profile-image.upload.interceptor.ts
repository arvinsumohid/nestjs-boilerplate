import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import * as fs from 'fs';

/**
 * Returns a FileInterceptor for profile image uploads with dynamic destination based on user id.
 * @param fieldName - The name of the file field (typically 'file')
 */
export function profileImageUploadInterceptor(fieldName: string) {
	return FileInterceptor(fieldName, {
		storage: diskStorage({
			destination: (req: Request, file, cb) => {
				const { id } = req.params;
				const dest = `./uploads/users/${id}/profile`;

				fs.mkdirSync(dest, { recursive: true });
				cb(null, dest);
			},
			filename: (req, file, cb) => {
				const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
				const ext = extname(file.originalname);
				cb(null, `profile-${uniqueSuffix}${ext}`);
			},
		}),
		fileFilter: (req, file, cb) => {
			// Only accept image files
			const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
			if (allowedMimeTypes.includes(file.mimetype)) {
				cb(null, true);
			} else {
				cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed'), false);
			}
		},
		limits: {
			fileSize: 5 * 1024 * 1024, // 5MB limit
		},
	});
}
