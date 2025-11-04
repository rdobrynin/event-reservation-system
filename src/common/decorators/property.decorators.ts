import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

export function UUIDProperty(
    options: Omit<ApiPropertyOptions, 'type' | 'format'> &
        Partial<{ each: boolean }> = {},
): PropertyDecorator {
    // @ts-ignore
    return ApiProperty({
        type: options?.each ? [String] : String,
        format: 'uuid',
        isArray: options?.each,
        ...options,
    });
}
