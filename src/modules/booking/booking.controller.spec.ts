import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import {
  booking,
  bookingDto,
  bookingDtos,
  createReserveDto,
} from './dto/booking.test-data';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  const mockService: Partial<BookingService> = {
    reserve: jest.fn().mockResolvedValue(bookingDto),
    getAll: jest.fn().mockResolvedValue(bookingDtos),
    getOne: jest.fn().mockResolvedValue(bookingDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [{ provide: BookingService, useValue: mockService }],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  describe('create', () => {
    it('should reserve to specific event', async () => {
      const result = await controller.reserve(createReserveDto);
      expect(service.reserve).toHaveBeenCalledWith(createReserveDto);
      expect(result).toEqual(result);
    });
  });

  describe('getOne', () => {
    it('should return event by ID', async () => {
      const result = await controller.getOne(booking.id);
      expect(service.getOne).toHaveBeenCalledWith(booking.id);
      expect(result).toEqual(bookingDto);
    });
  });

  describe('all', () => {
    it('should return all events', async () => {
      const result = await controller.getAll();
      expect(result).toEqual(bookingDtos);
    });
  });
});
