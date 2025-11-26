import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import { User } from '../../users/entities/user.entity';
import { ValidateUser } from '../dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(username: string, password: string): Promise<User> {
		const user = await this.usersService.findByUser(username);
		if (user && (await this.usersService.validatePassword(password, user.password))) {
			const validateUser = ValidateUser.fromUser(user);
			return validateUser;
		}
		throw new UnauthorizedException('Invalid credentials');
	}

	async login(user: LoginDto) {
		if (user.password) {
			const payload = await this.validateUser(user.username, user.password);
			if (payload) {
				return {
					access_token: this.jwtService.sign(payload, {
						secret: process.env.JWT_SECRET,
					}),
					user: payload,
				};
			}

			throw new UnauthorizedException('Invalid credentials');
		}
		throw new BadRequestException('Invalid credentials');
	}
}
