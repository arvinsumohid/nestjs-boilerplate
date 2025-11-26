import { DataSource } from 'typeorm';

export function createCustomRepositoryProvider<Entity, Repo>(entity: new () => Entity, repoClass: new (...args: any[]) => Repo) {
	return {
		provide: repoClass,
		useFactory: (dataSource: DataSource): Repo => {
			const baseRepo = dataSource.getRepository(entity);
			return new repoClass(baseRepo.target, baseRepo.manager, baseRepo.queryRunner);
		},
		inject: [DataSource],
	};
}
