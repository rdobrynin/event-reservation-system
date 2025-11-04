import {Column, Entity, JoinColumn, OneToOne, Unique} from 'typeorm';

import { BookingDto } from './dto/booking.dto';
import { UseDto } from '../../common/decorators/use-dto.decorators';
import { AbstractEntity } from '../../common/entites/abstract.entity';
import {Event} from "../event/event.entity";
@Entity({ name: 'bookings' })
@Unique(['userId', 'eventId'])
@UseDto(BookingDto)
export class Booking extends AbstractEntity<BookingDto> {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  eventId: number;

  @OneToOne(() => Event, event => event.booking)
  @JoinColumn({ name: 'eventId' }) // Custom foreign key name
  event: Event;
}
