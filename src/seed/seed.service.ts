import { Injectable } from '@nestjs/common';
import { seedData } from 'db/seeeds/data-seed';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner(); //1

    await queryRunner.connect(); //2
    await queryRunner.startTransaction(); //3

    try {
      const manager = queryRunner.manager;
      await seedData(manager);
      await queryRunner.commitTransaction(); //4
    } catch (error) {
      console.log('Error during database seeding:', error);
      await queryRunner.rollbackTransaction(); //5
    } finally {
      await queryRunner.release(); //6
    }
  }
}