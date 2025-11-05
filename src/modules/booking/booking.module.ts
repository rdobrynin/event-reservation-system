import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { EventModule } from '../event/event.module';
import { Booking } from './booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), forwardRef(() => EventModule)],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
