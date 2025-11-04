import { BadRequestException } from '@nestjs/common';

export class EventExceedPlaceException extends BadRequestException {
  constructor() {
    super('error.eventExceedPlace');
  }
}
