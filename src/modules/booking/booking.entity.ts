import { Column, Entity } from 'typeorm';

import { BookingDto } from './dto/booking.dto';
import { UseDto } from '../../common/decorators/use-dto.decorators';
import { AbstractEntity } from '../../common/entites/abstract.entity';
@Entity()
@UseDto(BookingDto)
export class Booking extends AbstractEntity<BookingDto> {
  @Column()
  userId: string;

  @Column()
  eventId: string;
}
