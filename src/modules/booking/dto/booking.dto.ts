import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { IBookingEntity } from '../interfaces/IBookingEntity';

export class BookingDto extends AbstractDto {
  @ApiProperty({ type: 'string' })
  eventId: string;

  @ApiProperty({ type: 'string' })
  userId: string;

  constructor(bookingEntity: IBookingEntity) {
    super(bookingEntity);

    this.eventId = bookingEntity.eventId;

    this.userId = bookingEntity.userId;
  }
}
