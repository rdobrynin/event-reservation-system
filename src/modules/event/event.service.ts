import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateReserveDto } from '../booking/dto/create-reserve.dto';
import { ConfigService } from '@nestjs/config';
import { EventExceedPlaceException } from './exceptions/event-exceed-place.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventDto } from './dto/event.dto';
import { Logger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import { EventNotFoundException } from './exceptions/event-not-found.exception';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private repo: Repository<Event>,
    private readonly configService: ConfigService,
    private logger: Logger,
  ) {}

  @Transactional()
  async create(createEventDto: CreateEventDto): Promise<EventDto> {
    //  for some logic if max_seats not set in ENV, default value is 100
    const maxPlaces = this.configService.get<number>('EVENT_MAX_SEATS') || 100;

    if (createEventDto.totalSeats > maxPlaces) {
      throw new EventExceedPlaceException();
    }

    const event = plainToInstance(Event, {
      ...createEventDto,
    });

    return (await this.repo.save(event)).toDto();
  }

  async getEventForReserve(createReserveDto: CreateReserveDto): Promise<Event> {
    const entity = await this.repo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.booking', 'booking')
      .where('event.id = :id', { id: createReserveDto.eventId })
      .getOne();

    if (!entity) {
      this.logger.error(createReserveDto.eventId, 'Event not found by ID');
      throw new EventNotFoundException();
    }

    const booking = entity.booking;

    if (booking) {
      const maxPlaces = this.configService.get<number>('EVENT_MAX_SEATS')!;
      this.logger.log(`Max places in event: ${entity.id}: ${maxPlaces}`);
      if (maxPlaces === booking.length) {
        throw new EventExceedPlaceException();
      }
    }

    return entity;
  }

  async getAll(): Promise<EventDto[]> {
    const entities = await this.repo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.booking', 'booking')
      .getMany();

    if (entities.length === 0) {
      return [];
    }

    const eventDtos: EventDto[] = [];

    for (const entity of entities) {
      eventDtos.push(entity.toDto());
    }

    // didn't add pagination class due to no requirements in test assignment
    return eventDtos;
  }

  async getOne(id: string): Promise<EventDto> {
    const entity = await this.repo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.booking', 'booking')
      .where('event.id = :id', {
        id,
      })
      .getOne();

    if (!entity) {
      throw new EventNotFoundException();
    }

    return entity.toDto();
  }
}
