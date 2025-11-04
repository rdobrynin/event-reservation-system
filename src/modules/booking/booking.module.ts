import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingDto]),
    forwardRef(() => EventModule),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
