import { IsUUID } from 'class-validator';

import { IAbstractEntity } from '../entites/abstract.entity';
import { DateField } from '../decorators/field.decorators';

export class AbstractDto {
  @IsUUID()
  id: string;

  @DateField()
  createdAt: Date;

  constructor(entity: IAbstractEntity<AbstractDto>) {
    if (!entity) {
      return;
    }

    this.id = entity.id;
    this.createdAt = entity.createdAt;
  }
}
