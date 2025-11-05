import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDummyDataEventTable1762337178485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "event" ("name", "total_seats")
            VALUES 
            ('event_1', 5),
            ('event_2', 10),
            ('event_3', 7);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "event"
            WHERE name IN (
            'event_1', 
            'event_2', 
            'event_3'
            )
        `);
  }
}
