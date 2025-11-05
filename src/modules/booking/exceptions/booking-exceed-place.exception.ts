import { BadRequestException } from '@nestjs/common';

export class BookingExceedPlaceException extends BadRequestException {
  constructor() {
    super('error.bookingExceedPlace');
  }
}
