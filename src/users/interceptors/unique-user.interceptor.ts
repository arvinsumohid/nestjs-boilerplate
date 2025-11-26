import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { Request } from 'express';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UniqueUserInterceptor implements NestInterceptor {
	constructor(private readonly userService: UserService) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<UserDto>> {
		const request: Request = context.switchToHttp().getRequest();
		const { username, email_address } = request.body as UserDto;
		if (username) {
			const userByUsername: User = await this.userService.findOne(username);
			if (userByUsername) {
				throw new BadRequestException('Username already exists');
			}
		}
		if (email_address) {
			const userByEmail: User = await this.userService.findByUser(email_address);
			if (userByEmail) {
				throw new BadRequestException('Email already exists');
			}
		}

		return next.handle();
	}
}
