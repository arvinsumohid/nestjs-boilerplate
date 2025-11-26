import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/logger.middleware';
import { TerminusModule } from '@nestjs/terminus';
import AppDataSource from './data-source';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			...AppDataSource.options,
			logging: false,
			synchronize: false,
		}),
		TerminusModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL }); // applies to all routes
	}
}
