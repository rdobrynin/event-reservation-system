import { Injectable } from '@nestjs/common';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { EventService } from '../event/event.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../event/event.entity';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingDto } from './dto/booking.dto';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private repo: Repository<Booking>,
    private eventService: EventService,
  ) {}

  async getAll(): Promise<BookingDto[]> {
    const entities = await this.repo.createQueryBuilder('book').getMany();

    if (entities.length === 0) {
      return [];
    }

    const dtos: BookingDto[] = [];

    for (const entity of entities) {
      dtos.push(entity.toDto());
    }

    // didn't add pagination class due to no requirements in test assignment
    return dtos;
  }

  async getOne(id: string): Promise<BookingDto> {
    const entity = await this.repo
      .createQueryBuilder('booking')
      .where('booking.id = :id', {
        id,
      })
      .getOne();

    if (!entity) {
      throw new BookingNotFoundException();
    }

    return entity.toDto();
  }

  async reserve(createReserveDto: CreateReserveDto): Promise<BookingDto> {
    console.log(createReserveDto);
    // await this.repo.findOneBy({userId: createReserveDto.userId})
    // const t = await this.eventService.reserve(createReserveDto);
    const event: Event =
      await this.eventService.getEventForReserve(createReserveDto);

    const book = this.repo.create({
      userId: createReserveDto.userId,
      eventId: event.id,
      event: event,
    });

    return (await this.repo.save(book)).toDto();
  }
}
