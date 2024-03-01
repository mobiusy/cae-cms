import { ApiProperty } from '@nestjs/swagger';

export class FeedbackDto {
  @ApiProperty({
    type: Number,
    description: '响应码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    type: Boolean,
    description: '响应是否成功',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
    description: '响应消息',
  })
  msg: string | string[];

  @ApiProperty({
    type: Object,
    description: '响应数据',
  })
  data?: unknown;

  @ApiProperty({
    type: String,
    description: '响应时间',
  })
  timestamp: string;
}
