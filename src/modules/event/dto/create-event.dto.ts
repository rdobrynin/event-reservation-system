import {
    NumberField, StringField,
} from '../../../common/decorators/field.decorators';
import {IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateEventDto {
    @StringField()
    name: string;

    @NumberField()
    totalSeats: number;
}
