import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/check-role.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { CreateTariffDto } from '../dto/create-tariff.dto';
import { Tariffs } from '../schema/tariffs.schema';
import { TariffsService } from '../tariffs.service';
import { UpdateTariffDto } from '../dto/update-tariff.dto';

@ApiTags('Admin-Tariffs')
@ApiBearerAuth()
@Controller('admin/tariffs')
export class AdminTariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'ایجاد یک تعرفه جدید (فقط ادمین)' })
  @ApiResponse({ status: 201, description: 'تعرفه با موفقیت ایجاد شد', type: Tariffs })
  @ApiResponse({ status: 400, description: 'داده‌های ورودی نامعتبر است' })
  create(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffsService.create(createTariffDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'دریافت لیست تمام تعرفه‌ها (فقط ادمین)' })
  @ApiResponse({ status: 200, description: 'موفق', type: [Tariffs] })
  findAll() {
    return this.tariffsService.findAll();
  }

  @Put(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'به‌روزرسانی یک تعرفه (فقط ادمین)' })
  @ApiResponse({ status: 200, description: 'تعرفه با موفقیت به‌روز شد', type: Tariffs })
  @ApiResponse({ status: 404, description: 'تعرفه یافت نشد' })
  update(@Param('id') id: string, @Body() updateTariffDto: UpdateTariffDto) {
    return this.tariffsService.update(id, updateTariffDto);
  }
}
