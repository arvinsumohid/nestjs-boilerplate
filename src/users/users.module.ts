import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, UsersRepository],
	controllers: [UsersController],
	exports: [UserService, UsersRepository],
})
export class UsersModule {}
