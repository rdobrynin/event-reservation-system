
import { IAbstractEntity } from '../../../common/entites/abstract.entity';
import {EventDto} from "../dto/event.dto";

export interface IEventEntity extends IAbstractEntity<EventDto> {
  name: string;

  totalSeats: number;
}
