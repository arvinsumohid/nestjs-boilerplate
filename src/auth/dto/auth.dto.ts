import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@MinLength(6)
	@IsNotEmpty()
	@IsString()
	password: string;
}

export class ValidateUser {
	public static fromUser(user: User): User {
		return {
			id: user.id,
			username: user.username,
			first_name: user.first_name,
			middle_name: user.middle_name,
			last_name: user.last_name,
			email_address: user.email_address,
			birthdate: user.birthdate,
			gender: user.gender,
			phone_number: user.phone_number,
			description: user.description,
			role: user.role,
		} as User;
	}
}
