import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { TariffsService } from '../tariffs.service';
import { Tariffs } from '../schema/tariffs.schema';

@ApiTags('Tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Public()
  @Get(':name')
  @ApiOperation({
    summary: 'دریافت اطلاعات یک تعرفه فعال بر اساس نام',
    description:
      'کاربران می‌توانند با استفاده از نام تعرفه (مثلاً print-prices) اطلاعات آن را دریافت کنند.',
  })
  @ApiResponse({ status: 200, description: 'موفق', type: Tariffs })
  @ApiResponse({ status: 404, description: 'تعرفه یافت نشد' })
  findActiveByName(@Param('name') name: string) {
    return this.tariffsService.findActiveByName(name);
  }
}
