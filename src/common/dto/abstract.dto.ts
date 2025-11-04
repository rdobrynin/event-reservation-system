import { IsDate, IsUUID } from 'class-validator';

import { IAbstractEntity } from '../entites/abstract.entity';

export class AbstractDto {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  constructor(entity: IAbstractEntity<AbstractDto>) {
    if (!entity) {
      return;
    }

    this.id = entity.id;
    this.createdAt = entity.createdAt;
  }
}
