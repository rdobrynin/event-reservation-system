import { NotFoundException } from '@nestjs/common';

export class EventNotFoundException extends NotFoundException {
  constructor() {
    super('error.eventNotFound');
  }
}
