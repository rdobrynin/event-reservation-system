import { CreateEventDto } from './create-event.dto';
import { plainToInstance } from 'class-transformer';
import { Event } from '../event.entity';
import { EventDto } from './event.dto';

export const createEventDto: CreateEventDto = {
  name: 'test_event_id',
  totalSeats: 4,
};

export const event: Event = plainToInstance(Event, {
  id: '79bbf54e-ef0a-4b6a-981b-ad271de6e3f9',
  name: 'test_event_id',
  totalSeats: 4,
});

export const event_2: Event = plainToInstance(Event, {
  id: '7a8583da-6244-4075-83fa-0806c15f634d',
  name: 'test_event_2_id',
  totalSeats: 2,
});

export const eventDto: EventDto = event.toDto();

export const eventDtos: EventDto[] = [event.toDto(), event_2.toDto()];
