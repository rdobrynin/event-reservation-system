import {
  NumberField,
  StringField,
} from '../../../common/decorators/field.decorators';

export class CreateEventDto {
  @StringField()
  name: string;

  @NumberField({ min: 1 })
  totalSeats: number;
}
