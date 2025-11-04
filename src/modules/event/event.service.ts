import { Injectable } from '@nestjs/common';
import {CreateEventDto} from "./dto/create-event.dto";
import {CreateReserveDto} from "../booking/dto/create-reserve.dto";

@Injectable()
export class EventService {
    constructor(
    ) {}

    async create(createEventDto: CreateEventDto): Promise<void> {
    console.log(createEventDto)
    }

    async reserve(createReserveDto: CreateReserveDto): Promise<void> {
        console.log(createReserveDto)
    }
}
