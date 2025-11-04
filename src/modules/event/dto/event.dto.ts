import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {IEventEntity} from "../interfaces/IEventEntity";

export class EventDto extends AbstractDto {
  @ApiProperty({ type: "string" })
  name: string;

  @ApiProperty({ type: "number" })
  totalSeats: number;

  constructor(entity: IEventEntity) {
    super(entity);

    this.name = entity.name;

    this.totalSeats = entity.totalSeats;
  }
}
