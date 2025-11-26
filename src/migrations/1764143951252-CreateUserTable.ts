import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1764143951252 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE users (
                id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
                role VARCHAR(50) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                middle_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                username VARCHAR(100) NOT NULL UNIQUE,
                email_address VARCHAR(100) NOT NULL UNIQUE,
                birthdate DATE NOT NULL,
                gender VARCHAR(50) NOT NULL,
                phone_number VARCHAR(50) NOT NULL,
                description TEXT,
                profile_image VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME
            );
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE users`);
	}
}
