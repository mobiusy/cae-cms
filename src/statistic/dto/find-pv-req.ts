import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindPVReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '页面路径',
  })
  path: string;
}

export class FindPVResDto {
  @ApiProperty({
    type: Number,
    description: '页面访问量',
  })
  pv: number;
}
