import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { BookingDto } from './dto/booking.dto';
import { UUIDParam } from '../../common/decorators/http.decorators';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get('/all')
  @ApiOkResponse({
    type: BookingDto,
    isArray: true,
    description: 'get All bookings',
  })
  getAll(): Promise<BookingDto[]> {
    return this.bookingService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: BookingDto,
    description: 'book get by ID',
  })
  getOne(@UUIDParam('id') id: string): Promise<BookingDto> {
    return this.bookingService.getOne(id);
  }

  @Post('/reserve')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BookingDto,
    description: 'Reserve place in event by ID',
  })
  reserve(@Body() createUserDto: CreateReserveDto): Promise<BookingDto> {
    return this.bookingService.reserve(createUserDto);
  }
}
