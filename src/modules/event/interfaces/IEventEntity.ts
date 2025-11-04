import { IAbstractEntity } from '../../../common/entites/abstract.entity';
import { EventDto } from '../dto/event.dto';
import { Booking } from '../../booking/booking.entity';

export interface IEventEntity extends IAbstractEntity<EventDto> {
  name: string;

  totalSeats: number;

  booking: Booking;
}
