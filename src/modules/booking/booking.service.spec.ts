import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from './booking.service';
import { EventService } from '../event/event.service';
import { Booking } from './booking.entity';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';
import { booking } from './dto/booking.test-data';
import { event } from '../event/dto/event.test-data';

describe('BookingService', () => {
  let service: BookingService;
  let repo: Repository<Booking>;
  let eventService: EventService;

  const mockBookingRepository = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEventService = {
    getEventForReserve: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    repo = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    eventService = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of booking DTOs', async () => {
      const mockBookings = [booking];
      const queryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getAll();

      expect(result).toEqual([booking.toDto()]);
      expect(mockBookingRepository.createQueryBuilder).toHaveBeenCalledWith(
        'book',
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });

    it('should return empty array when no bookings found', async () => {
      const queryBuilder = {
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockBookingRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a booking DTO when found', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(booking),
      };
      mockBookingRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getOne('1');

      expect(result).toEqual(booking.toDto());
      expect(mockBookingRepository.createQueryBuilder).toHaveBeenCalledWith(
        'booking',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith('booking.id = :id', {
        id: '1',
      });
    });

    it('should throw BookingNotFoundException when booking not found', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockBookingRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service.getOne('nonexistent')).rejects.toThrow(
        BookingNotFoundException,
      );
    });
  });

  describe('reserve', () => {
    const createReserveDto: CreateReserveDto = {
      userId: 'user123',
      eventId: 'event123',
      // Add other required DTO properties
    };

    it('should create and return a booking DTO', async () => {
      mockEventService.getEventForReserve.mockResolvedValue(event);
      mockBookingRepository.create.mockReturnValue(booking);
      mockBookingRepository.save.mockResolvedValue(booking);

      const result = await service.reserve(createReserveDto);

      expect(eventService.getEventForReserve).toHaveBeenCalledWith(
        createReserveDto,
      );
      expect(repo.create).toHaveBeenCalledWith({
        userId: createReserveDto.userId,
        eventId: event.id,
        event: event,
      });
      expect(repo.save).toHaveBeenCalledWith(booking);
      expect(result).toEqual(booking.toDto());
    });

    it('should handle errors from event service', async () => {
      mockEventService.getEventForReserve.mockRejectedValue(
        new Error('Event error'),
      );

      await expect(service.reserve(createReserveDto)).rejects.toThrow(
        'Event error',
      );
      expect(mockEventService.getEventForReserve).toHaveBeenCalledWith(
        createReserveDto,
      );
      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });
});
