import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateReserveDto } from '../booking/dto/create-reserve.dto';
import { EventExceedPlaceException } from './exceptions/event-exceed-place.exception';
import { EventNotFoundException } from './exceptions/event-not-found.exception';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  runOnTransactionCommit: jest.fn(),
  runOnTransactionRollback: jest.fn(),
  runOnTransactionComplete: jest.fn(),
}));

describe('EventService', () => {
  let service: EventService;
  let repo: Repository<Event>;
  let configService: ConfigService;
  let logger: Logger;

  const mockEvent = {
    id: '56544e61-3c42-4ff5-9a63-de5f5544aee1',
    name: 'test_event',
    totalSeats: 10,
    booking: [],
    toDto: jest.fn().mockReturnValue({
      id: '56544e61-3c42-4ff5-9a63-de5f5544aee1',
      name: 'test_event',
      totalSeats: 10,
    }),
  };

  const mockEventWithBookings = {
    id: 'c635982c-297a-4ac1-8b6f-94ccae45465c',
    name: 'test_event_2',
    totalSeats: 10,
    booking: [
      { id: '1943b2b1-5b9a-4570-8bfb-d0303856eed5' },
      { id: 'f33e0cc3-e6f5-457e-84b7-c3c9845b5128' },
    ],
    toDto: jest.fn().mockReturnValue({
      id: 'c635982c-297a-4ac1-8b6f-94ccae45465c',
      name: 'test_event_2',
      totalSeats: 10,
    }),
  };

  const mockRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createEventDto: CreateEventDto = {
      name: 'new_event',
      totalSeats: 2,
    };

    it('should create an event successfully when seats are within limit', async () => {
      // Arrange
      mockConfigService.get.mockReturnValue(100); // EVENT_MAX_SEATS = 100
      mockRepository.save.mockResolvedValue(mockEvent);

      // Act
      const result = await service.create(createEventDto);

      // Assert
      expect(result).toEqual(mockEvent.toDto());
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createEventDto),
      );
      expect(mockConfigService.get).toHaveBeenCalledWith('EVENT_MAX_SEATS');
      // await expect(service.create(createEventDto)).rejects.toThrow(
      //     EventExceedPlaceException,
      // );
    });

    it('should use default max seats when env variable is not set', async () => {
      // Arrange
      mockConfigService.get.mockReturnValue(undefined); // No env variable
      mockRepository.save.mockResolvedValue(mockEvent);

      // Act
      await service.create(createEventDto);

      // Assert
      expect(mockConfigService.get).toHaveBeenCalledWith('EVENT_MAX_SEATS');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw EventExceedPlaceException when seats exceed limit', async () => {
      // Arrange
      mockConfigService.get.mockReturnValue(50); // EVENT_MAX_SEATS = 50
      const largeEventDto: CreateEventDto = {
        name: 'large_event',
        totalSeats: 100, // Exceeds limit
      };

      // Act & Assert
      await expect(service.create(largeEventDto)).rejects.toThrow(
        EventExceedPlaceException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getEventForReserve', () => {
    const createReserveDto: CreateReserveDto = {
      eventId: '2096c01b-6e4d-4df0-a48a-d4633f05c1f2',
      userId: 'd89059c3-641a-496b-9196-cb7c55e384b5',
    };

    it('should throw EventExceedPlaceException when no seats available', async () => {
      // Arrange
      const eventWithFullBookings = {
        ...mockEventWithBookings,
        booking: Array(100).fill({ id: 'booking' }), // 100 bookings
      };

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(eventWithFullBookings),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);
      mockConfigService.get.mockReturnValue(100); // Max seats = 100, bookings = 100

      // Act & Assert
      await expect(
        service.getEventForReserve(createReserveDto),
      ).rejects.toThrow(EventExceedPlaceException);
    });

    it('should not check availability when event has no bookings', async () => {
      // Arrange
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockEvent), // Event with empty booking array
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      // Act
      const result = await service.getEventForReserve(createReserveDto);

      // Assert
      expect(result).toEqual(mockEvent);
      // Should not call configService.get for max places since there are no bookings
    });
  });

  describe('getAll', () => {
    it('should return array of event DTOs', async () => {
      // Arrange
      const events = [mockEvent, mockEventWithBookings];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(events),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockEvent.toDto());
      expect(result[1]).toEqual(mockEventWithBookings.toDto());
    });

    it('should return empty array when no events found', async () => {
      // Arrange
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should return event DTO when found', async () => {
      // Arrange
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockEvent),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      // Act
      const result = await service.getOne('1');

      // Assert
      expect(result).toEqual(mockEvent.toDto());
      expect(queryBuilder.where).toHaveBeenCalledWith('event.id = :id', {
        id: '1',
      });
    });

    it('should throw EventNotFoundException when event not found', async () => {
      // Arrange
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      // Act & Assert
      await expect(service.getOne('999')).rejects.toThrow(
        EventNotFoundException,
      );
    });
  });
});
