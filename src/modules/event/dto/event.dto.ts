import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { IEventEntity } from '../interfaces/IEventEntity';
import {
  ObjectPropertyOptional,
} from '../../../common/decorators/property.decorators';
import { Booking } from '../../booking/booking.entity';

export class EventDto extends AbstractDto {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'number' })
  totalSeats: number;

  @ObjectPropertyOptional(() => Booking)
  booking?: Booking;

  constructor(entity: IEventEntity) {
    super(entity);

    this.name = entity.name;

    this.totalSeats = entity.totalSeats;

    this.booking = entity.booking;
  }
}
