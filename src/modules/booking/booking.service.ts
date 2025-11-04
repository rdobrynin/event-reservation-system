import { Injectable } from '@nestjs/common';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { EventService } from '../event/event.service';

@Injectable()
export class BookingService {
  constructor(private eventService: EventService) {}

  async reserve(createReserveDto: CreateReserveDto): Promise<void> {
    console.log(createReserveDto);
    await this.eventService.reserve(createReserveDto);
  }
}
