import { IAbstractEntity } from '../../../common/entites/abstract.entity';
import { EventDto } from '../dto/event.dto';
import { Booking } from '../../booking/booking.entity';
import { Nullable } from '../../../common/types';

export interface IEventEntity extends IAbstractEntity<EventDto> {
  name: string;

  totalSeats: number;

  booking: Nullable<Booking[]>;
}
