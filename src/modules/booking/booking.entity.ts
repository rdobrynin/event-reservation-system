import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { BookingDto } from './dto/booking.dto';
import { UseDto } from '../../common/decorators/use-dto.decorators';
import { AbstractEntity } from '../../common/entites/abstract.entity';
import { Event } from '../event/event.entity';
@Entity({ name: 'bookings' })
@Unique(['userId', 'eventId'])
@UseDto(BookingDto)
export class Booking extends AbstractEntity<BookingDto> {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @OneToOne(() => Event, (event) => event.booking)
  @JoinColumn({ name: 'event_id' }) // Custom foreign key name
  event: Event;
}
