import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Constructor } from '../boilerplate.polyfill';
import type { AbstractDto } from '../dto/abstract.dto';

type GetConstructorArgs<T> = T extends new (...args: infer U) => any
  ? U
  : never;

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  private dtoClass: Constructor<DTO>;

  toDto<T>(options?: O | GetConstructorArgs<T>[1]): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new this.dtoClass(this, options);
  }
}

export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * @param {GetConstructorArgs<>[1] | } options
   * @returns {}
   */
  toDto<T>(options?: O | GetConstructorArgs<T>[1]): DTO;
}
