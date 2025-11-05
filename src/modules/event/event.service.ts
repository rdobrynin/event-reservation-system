import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateReserveDto } from '../booking/dto/create-reserve.dto';
import { ConfigService } from '@nestjs/config';
import { EventExceedPlaceException } from './exceptions/event-exceed-place.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventDto } from './dto/event.dto';
import { plainToInstance } from 'class-transformer';
import { EventNotFoundException } from './exceptions/event-not-found.exception';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private repo: Repository<Event>,
    private readonly configService: ConfigService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<void> {
    //  for some logic if max_seats not set in ENV, default value is 100
    const maxPlaces = this.configService.get<number>('EVENT_MAX_SEATS') || 100;

    if (createEventDto.totalSeats > maxPlaces) {
      throw new EventExceedPlaceException();
    }

    const event = plainToInstance(Event, {
      ...createEventDto,
    });

    await this.repo.save(event);
  }

  async reserve(createReserveDto: CreateReserveDto): Promise<void> {
    console.log(createReserveDto);
    await Promise.resolve();
  }

  async getAll(): Promise<EventDto[]> {
    const entities = await this.repo.createQueryBuilder().getMany();

    if (entities.length === 0) {
      return [];
    }

    const eventDtos: EventDto[] = [];

    for (const entity of entities) {
      const dto: EventDto = {
        ...entity,
        name: entity.name,
        totalSeats: entity.totalSeats,
      };
      eventDtos.push(dto);
    }

    // didn't add pagination class due to no requirements in test assignment
    return eventDtos;
  }

  async getOne(id: string): Promise<EventDto> {
    const entity = await this.repo.findOneBy({ id: id });

    if (!entity) {
      throw new EventNotFoundException();
    }
    return {
      ...entity,
      name: entity.name,
      totalSeats: entity.totalSeats,
    };
  }
}
