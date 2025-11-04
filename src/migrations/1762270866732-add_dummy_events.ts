import { MigrationInterface, QueryRunner } from 'typeorm';
import { Event } from '../modules/event/event.entity';

export class AddDummyEvents1762270866732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repo = queryRunner.connection.getRepository(Event);

    const events = repo.create([
      { name: 'event_1', totalSeats: 5 },
      { name: 'event_2', totalSeats: 10 },
      { name: 'event_3', totalSeats: 7 },
    ]);

    await repo.save(events);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM events 
            WHERE name IN (
            'event_1', 
            'event_2', 
            'event_3'
            )
        `);
  }
}
