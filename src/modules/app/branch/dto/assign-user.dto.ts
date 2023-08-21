import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignUser {
  @ApiProperty({ type: Array<{ userId: number; assign: boolean }> })
  @IsNotEmpty()
  @IsArray()
  userIds: Array<{ userId: number }>;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  branchId: number;
}
