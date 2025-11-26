import {
	Controller,
	Get,
	Post,
	Body,
	UseInterceptors,
	UseGuards,
	Param,
	Delete,
	Put,
	Request,
	Patch,
	UploadedFile,
	BadRequestException,
	Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { ApiResponse } from '../../utils/api.util';
import { ApiResponseDto } from '../../app.dto';
import { UniqueUserInterceptor } from '../interceptors/unique-user.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { profileImageUploadInterceptor } from '../utils/profile-image.upload.interceptor';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	async findAll(): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.findAll(), 'Users found', 200);
	}

	@Post()
	@UseInterceptors(UniqueUserInterceptor)
	async create(@Body() userData: CreateUserDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.create(userData), 'User created', 201);
	}

	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.findOne(id), 'User found', 200);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	async delete(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.delete(id), 'User deleted', 200);
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	async update(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.update(id, userData), 'User updated', 200);
	}

	// Profile Image endpoints
	@Patch(':id/profile-image')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(profileImageUploadInterceptor('file'))
	async uploadProfileImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<ApiResponseDto> {
		if (!file) {
			throw new BadRequestException('No file uploaded');
		}

		const path: string = file.path as string;

		// Store relative path from uploads directory
		const filePath = path.replace(/\\/g, '/');
		const user = await this.userService.updateProfileImage(id, filePath);

		return ApiResponse({ profile_image: user.profile_image }, 'Profile image uploaded successfully', 200);
	}

	@Delete(':id/profile-image')
	@UseGuards(AuthGuard('jwt'))
	async deleteProfileImage(@Param('id') id: string): Promise<ApiResponseDto> {
		await this.userService.deleteProfileImage(id);
		return ApiResponse(null, 'Profile image deleted successfully', 200);
	}
}
