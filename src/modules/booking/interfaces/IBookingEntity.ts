import { IAbstractEntity } from '../../../common/entites/abstract.entity';
import { BookingDto } from '../dto/booking.dto';

export interface IBookingEntity extends IAbstractEntity<BookingDto> {
  eventId: string;

  userId: string;
}
