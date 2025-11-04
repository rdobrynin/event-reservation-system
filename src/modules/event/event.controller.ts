import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  reserve(@Body() createEventDto: CreateEventDto): Promise<void> {
    return this.eventService.create(createEventDto);
  }
}
