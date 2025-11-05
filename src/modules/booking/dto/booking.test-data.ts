import { plainToInstance } from 'class-transformer';
import { BookingDto } from './booking.dto';
import { Booking } from '../booking.entity';
import { event } from '../../event/dto/event.test-data';
import { CreateReserveDto } from './create-reserve.dto';

export const booking: Booking = plainToInstance(Booking, {
  id: 'e0509bdc-babe-4110-a579-5ad54c6107e9',
  userId: '022fc0b5-c7f0-4d62-bba9-0a663941f9cc',
  eventId: event.id,
});

export const createReserveDto: CreateReserveDto = {
  eventId: event.id,
  userId: '022fc0b5-c7f0-4d62-bba9-0a663941f9cc',
};

export const booking2: Booking = plainToInstance(Booking, {
  id: 'a92585ca-7e08-4923-82cf-5bd45fda90e1',
  userId: '634f5f69-e04d-46f1-b7af-40930efc3123',
  eventId: event.id,
});

export const bookingDto: BookingDto = booking.toDto();
export const booking2Dto: BookingDto = booking2.toDto();

export const bookingDtos = [bookingDto, booking2Dto];
