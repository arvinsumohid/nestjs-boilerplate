import { IsEmail, MinLength, IsEnum, IsString, IsOptional, IsNotEmpty, Matches, IsPhoneNumber } from 'class-validator';
import { UserRole, UserGender } from '../enum/user.enum';
import { User } from '../entities/user.entity';

export class UserDto {
	@IsEmail()
	@IsNotEmpty()
	email_address: string;

	@MinLength(6)
	@IsNotEmpty()
	password: string;

	@IsEnum(UserRole)
	role: UserRole = UserRole.PATIENT;

	@MinLength(2)
	@IsString()
	first_name: string;

	@IsString()
	@IsOptional()
	middle_name?: string;

	@MinLength(2)
	@IsString()
	last_name: string;

	@MinLength(2)
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
		message: 'Birthdate must be in DD/MM/YYYY format',
	})
	birthdate: string;

	@IsNotEmpty()
	@IsEnum(UserGender)
	gender: UserGender;

	@IsPhoneNumber('PH')
	phone_number: string;

	@IsString()
	@IsOptional()
	description?: string;

	static fields(): string[] {
		return [
			'email_address',
			'password',
			'role',
			'first_name',
			'middle_name',
			'last_name',
			'username',
			'birthdate',
			'gender',
			'phone_number',
			'description',
		];
	}

	public static fromUser(user: User): User {
		return {
			email_address: user.email_address,
			role: user.role,
			first_name: user.first_name,
			middle_name: user.middle_name,
			last_name: user.last_name,
			username: user.username,
			birthdate: user.birthdate,
			gender: user.gender,
			phone_number: user.phone_number,
			description: user.description,
		} as User;
	}
}

export class CreateUserDto extends UserDto {}

export class UpdateUserDto {
	@IsEmail()
	@IsOptional()
	email_address?: string;

	@MinLength(6)
	@IsOptional()
	password?: string;

	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole;

	@MinLength(2)
	@IsOptional()
	@IsString()
	first_name?: string;

	@MinLength(2)
	@IsOptional()
	@IsString()
	last_name?: string;

	@MinLength(2)
	@IsString()
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	middle_name?: string;

	@IsString()
	@IsOptional()
	@Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
		message: 'Birthdate must be in DD/MM/YYYY format',
	})
	birthdate?: string;

	@IsOptional()
	@IsEnum(UserGender)
	gender?: UserGender;

	@IsPhoneNumber('PH')
	@IsOptional()
	phone_number?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	profile_image?: string;
}
