import { Controller, Get, Body, Put, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { IncPVReqDto } from './dto/inc-pv-req';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindPVReqDto, FindPVResDto } from './dto/find-pv-req';

@ApiTags('数据统计')
@Controller({ path: 'statistic', version: '1' })
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Put('pv')
  @ApiOperation({
    summary: '增加页面访问量',
  })
  @ApiOkResponse({
    type: Number,
  })
  incPV(@Body() req: IncPVReqDto) {
    return this.statisticService.incPV(req);
  }

  @Get('pv')
  @ApiOperation({
    summary: '获取页面访问量',
  })
  @ApiOkResponse({
    type: FindPVResDto,
  })
  find(@Query() query: FindPVReqDto) {
    const { path } = query;
    return this.statisticService.find(path);
  }
}
