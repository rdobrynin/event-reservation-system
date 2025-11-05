import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { EventController } from './event.controller';
import { EventService } from './event.service';
import {
  createEventDto,
  event,
  eventDto,
  eventDtos,
} from './dto/event.test-data';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService: Partial<EventService> = {
    create: jest.fn().mockResolvedValue(eventDto),
    getEventForReserve: jest.fn().mockResolvedValue(null),
    getAll: jest.fn().mockResolvedValue(eventDtos),
    getOne: jest.fn().mockResolvedValue(eventDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useValue: mockEventService }],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  describe('create', () => {
    it('should create event', async () => {
      const result = await controller.create(createEventDto);
      //@ts
      expect(service.create).toHaveBeenCalledWith(createEventDto);
      expect(result).toEqual(result);
    });
  });

  describe('getOne', () => {
    it('should return event by ID', async () => {
      const result = await controller.getOne(event.id);
      expect(service.getOne).toHaveBeenCalledWith(event.id);
      expect(result).toEqual(eventDto);
    });
  });

  describe('all', () => {
    it('should return all events', async () => {
      const result = await controller.getAll();
      expect(result).toEqual(eventDtos);
    });
  });
});
