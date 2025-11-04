import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {BookingService} from "./booking.service";
import {CreateReserveDto} from "./dto/create-reserve.dto";

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
    constructor(private bookingService: BookingService) {}

    @Post('/reserve')
    @HttpCode(HttpStatus.CREATED)
    reserve(@Body() createUserDto: CreateReserveDto): Promise<void> {
        return this.bookingService.reserve(createUserDto);
    }
}
