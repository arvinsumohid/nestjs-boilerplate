import { IsEmail, MinLength, IsEnum, IsString, IsOptional, IsNotEmpty, Matches, IsPhoneNumber } from 'class-validator';
import { UserRole, UserGender } from '../enum/user.enum';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty({ example: 'user@example.com', required: true })
	@IsEmail()
	@IsNotEmpty()
	email_address: string;

	@ApiProperty({ example: 'password', required: true })
	@MinLength(6)
	@IsNotEmpty()
	password: string;

	@ApiProperty({ example: 'USER', required: false })
	@IsEnum(UserRole)
	role: UserRole = UserRole.USER;

	@ApiProperty({ example: 'John', required: true })
	@MinLength(2)
	@IsString()
	first_name: string;

	@ApiProperty({ example: 'Doe', required: false })
	@IsString()
	@IsOptional()
	middle_name?: string;

	@ApiProperty({ example: 'Doe', required: true })
	@MinLength(2)
	@IsString()
	last_name: string;

	@ApiProperty({ example: 'john_doe', required: true })
	@MinLength(2)
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({ example: '01/01/2000', required: true })
	@IsString()
	@IsNotEmpty()
	@Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
		message: 'Birthdate must be in DD/MM/YYYY format',
	})
	birthdate: string;

	@ApiProperty({ example: 'MALE', required: true })
	@IsNotEmpty()
	@IsEnum(UserGender)
	gender: UserGender;

	@ApiProperty({ example: '09123456789', required: true })
	@IsPhoneNumber('PH')
	phone_number: string;

	@ApiProperty({ example: 'Description', required: false })
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
	@IsString()
	@IsOptional()
	profile_image?: string;

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
