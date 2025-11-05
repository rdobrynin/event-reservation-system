import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BookingDto } from './dto/booking.dto';
import { UseDto } from '../../common/decorators/use-dto.decorators';
import { AbstractEntity } from '../../common/entites/abstract.entity';
import { Event } from '../event/event.entity';
@Entity()
@Unique(['userId', 'eventId'])
@UseDto(BookingDto)
export class Booking extends AbstractEntity<BookingDto> {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.booking, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' }) // Custom foreign key name
  event: Event;
}
