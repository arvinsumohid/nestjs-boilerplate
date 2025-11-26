import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { UsersRepository } from '../repositories/user.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
	private readonly SALT_ROUNDS = 10;

	constructor(
		@InjectRepository(User)
		private readonly userRepository: UsersRepository,
	) {}

	async findOne(id: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		return user;
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.find({
			select: [
				'id',
				'username',
				'email_address',
				'first_name',
				'middle_name',
				'last_name',
				'birthdate',
				'gender',
				'phone_number',
				'description',
				'profile_image',
				'role',
				'created_at',
				'updated_at',
				'deleted_at',
			],
		});
	}

	async create(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
		const checkUser = await this.userRepository.findOne({
			where: { username: userData.username },
			select: ['id'],
		});

		if (checkUser) {
			throw new BadRequestException('User already exists');
		}

		const checkEmail = await this.userRepository.findOne({
			where: { email_address: userData.email_address },
			select: ['id'],
		});

		if (checkEmail) {
			throw new BadRequestException('Email already exists');
		}

		const hashed = await this.hashPassword(userData.password);
		const [day, month, year] = userData.birthdate.split('/');
		const date = new Date(`${year}-${month}-${day}`);
		const birthdate = date.toISOString().split('T')[0];
		const userEntity = this.userRepository.create({
			...userData,
			password: hashed,
			birthdate,
		});
		const user = await this.userRepository.save(userEntity);
		const userDto = UserDto.fromUser(user);
		return userDto;
	}

	async findByUser(username: string): Promise<User> {
		const user = await this.userRepository.findOne({
			where: [{ email_address: username.toLowerCase() }, { username }],
			select: [
				'birthdate',
				'description',
				'email_address',
				'first_name',
				'gender',
				'id',
				'last_name',
				'middle_name',
				'phone_number',
				'role',
				'username',
				'password',
			],
			loadEagerRelations: false,
		});

		return user;
	}

	async update(id: string, userData: UpdateUserDto): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			throw new BadRequestException('User not found');
		}

		let birthdate: string;
		if (userData.birthdate) {
			const [day, month, year] = userData.birthdate.split('/');
			const date = new Date(`${year}-${month}-${day}`);
			birthdate = date.toISOString().split('T')[0];
		}

		const userEntity = this.userRepository.create({
			...user,
			...userData,
			...(birthdate && { birthdate }),
		});
		const updatedUser = await this.userRepository.save(userEntity);

		return updatedUser;
	}

	async delete(id: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			throw new BadRequestException('User not found');
		}
		return await this.userRepository.remove(user);
	}

	async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, this.SALT_ROUNDS);
	}

	async validatePassword(password: string, hashed: string): Promise<boolean> {
		return await bcrypt.compare(password, hashed);
	}

	async updateProfileImage(id: string, filePath: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			throw new BadRequestException('User not found');
		}

		if (user.profile_image) {
			const oldImagePath = path.join(process.cwd(), user.profile_image);
			if (fs.existsSync(oldImagePath)) {
				fs.unlinkSync(oldImagePath);
			}
		}

		// Update user with new profile image path
		user.profile_image = filePath;
		return await this.userRepository.save(user);
	}

	async deleteProfileImage(id: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			throw new BadRequestException('User not found');
		}

		// Delete profile image file if it exists
		if (user.profile_image) {
			const imagePath = path.join(process.cwd(), user.profile_image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		// Remove profile image reference from database
		user.profile_image = null;
		return await this.userRepository.save(user);
	}
}
