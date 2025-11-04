import { Column, Entity, OneToOne } from 'typeorm';
import { UseDto } from '../../common/decorators/use-dto.decorators';
import { AbstractEntity } from '../../common/entites/abstract.entity';
import { EventDto } from './dto/event.dto';
import { Booking } from '../booking/booking.entity';
import type { Nullable } from '../../common/types';
@Entity({ name: 'events' })
@UseDto(EventDto)
export class Event extends AbstractEntity<EventDto> {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  totalSeats: number;

  @OneToOne(() => Booking, (booking) => booking.event)
  booking?: Nullable<Booking>;
}
