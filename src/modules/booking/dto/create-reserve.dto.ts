import { UUIDField } from '../../../common/decorators/field.decorators';

export class CreateReserveDto {
  @UUIDField()
  eventId: string;

  @UUIDField()
  userId: string;
}
