import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UploadRequestDto {
  @ApiProperty({ example: '2025-01-01T00:00:00Z', description: 'ISO timestamp for unlock date' })
  @IsString()
  @IsNotEmpty()
  lockTime: string; // ISO format or UNIX timestamp
}
