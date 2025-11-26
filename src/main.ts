import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional';
import AppDataSource from './data-source';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	initializeTransactionalContext();
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
	}

	addTransactionalDataSource(AppDataSource);
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useStaticAssets(join(__dirname, '..', 'uploads'), {
		prefix: '/uploads/',
	});

	app.enableCors({
		origin: process.env.FRONTEND_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		allowedHeaders: 'Content-Type, Accept, Authorization',
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
		}),
	);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
	console.error(err);
	process.exit(1);
});
