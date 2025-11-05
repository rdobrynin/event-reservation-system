import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';
import { UUIDParam } from '../../common/decorators/http.decorators';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('/create')
  @ApiOkResponse({
    type: EventDto,
    description: 'create event',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto): Promise<EventDto> {
    return this.eventService.create(createEventDto);
  }

  @Get('/all')
  @ApiOkResponse({
    type: EventDto,
    isArray: true,
    description: 'get All events',
  })
  getAll(): Promise<EventDto[]> {
    return this.eventService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: EventDto,
    description: 'event get by ID',
  })
  getOne(@UUIDParam('id') id: string): Promise<EventDto> {
    return this.eventService.getOne(id);
  }
}
