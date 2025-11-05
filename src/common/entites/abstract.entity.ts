import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

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

  private dtoClass: Constructor<DTO>;

  toDto(options?: O): DTO {
    const dtoClass = Object.getPrototypeOf(this).dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}

export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  id: string;
  createdAt: Date;

  /**
   * @param {GetConstructorArgs<>[1] | } options
   * @returns {}
   */
  toDto<T>(options?: O | GetConstructorArgs<T>[1]): DTO;
}
