import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from 'typeorm';
import { UserRole } from '../enum/user.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	first_name: string;

	@Column()
	middle_name: string;

	@Column()
	last_name: string;

	@Column()
	email_address: string;

	@Column()
	birthdate: Date;

	@Column()
	gender: string;

	@Column()
	phone_number: string;

	@Column()
	description: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	profile_image: string;

	@Column({ type: 'enum', enum: UserRole })
	role: UserRole;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;

	@BeforeInsert()
	private generateId() {
		if (!this.id) {
			this.id = uuidv4();
		}
	}
}
