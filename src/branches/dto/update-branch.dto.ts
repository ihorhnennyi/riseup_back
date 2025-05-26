import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty({ 
    example: true,
    description: 'Чи активна філія',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 