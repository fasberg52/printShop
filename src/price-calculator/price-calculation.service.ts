import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PrintOptionInterface,
  PrintTariffInterface,
} from 'src/modules/tariffs/interface/tariffs.interface';
import { Tariffs, TariffsDocument } from '../modules/tariffs/schema/tariffs.schema';
import { PriceCalculatorDto } from './dto/price-calculator.dto';

@Injectable()
export class PriceCalculationService {
  constructor(@InjectModel(Tariffs.name) private readonly _tariffsModel: Model<TariffsDocument>) {}

  async calculateTotalPrice(dto: PriceCalculatorDto): Promise<{ amount: number }> {
    const printTariffDoc = await this._tariffsModel
      .findOne({ name: 'print-prices-fall-2025', isActive: true })
      .lean();
    if (!printTariffDoc) throw new NotFoundException('تعرفه چاپ یافت نشد.');

     if (!printTariffDoc.configuration.print) {
       throw new BadRequestException('پیکربندی چاپ در تعرفه یافت نشد.');
     }
    // --- محاسبه هزینه چاپ ---
    const pagePrice = this._findPrintPrice(printTariffDoc.configuration.print, dto);
    const totalPrintPrice = pagePrice * dto.countOfPages * dto.countOfCopies;

    // --- محاسبه هزینه صحافی (در صورت وجود) ---
    let totalBindingPrice = 0;
    if (dto.binding) {
      const bindingTariffDoc = await this._tariffsModel
        .findOne({ name: 'binding-prices', isActive: true })
        .lean();
      if (!bindingTariffDoc) throw new NotFoundException('تعرفه صحافی یافت نشد.');

      // 👇 فقط مقادیر مورد نیاز را به متد پاس می‌دهیم
      const bindingPrice = this._findBindingPrice(
        bindingTariffDoc.configuration.binding,
        dto.binding,
        dto.size,
      );
      totalBindingPrice = bindingPrice * dto.countOfCopies;
    }

    const finalAmount = totalPrintPrice + totalBindingPrice;
    return { amount: Math.round(finalAmount) };
  }

  private _findPrintPrice(printTariff: PrintTariffInterface, dto: PriceCalculatorDto): number {
    const { size, color, side, countOfPages } = dto;

    const priceTier: PrintOptionInterface | undefined = printTariff?.[size]?.[color];
    if (!priceTier) {
      throw new BadRequestException('ترکیب گزینه‌های چاپ انتخاب شده در تعرفه موجود نیست.');
    }

    const propertyName = side === 'double_sided' ? 'doubleSided' : 'singleSided';

    // 👇 شرط برای بررسی وجود breakpoints اضافه شد
    if (priceTier.breakpoints && priceTier.breakpoints.length > 0) {
      const sortedBreakpoints = [...priceTier.breakpoints].sort((a, b) => b.at - a.at);
      for (const breakpoint of sortedBreakpoints) {
        if (countOfPages >= breakpoint.at) {
          if (breakpoint[propertyName]) return breakpoint[propertyName];
        }
      }
    }

    if (priceTier[propertyName]) return priceTier[propertyName];

    throw new BadRequestException(`قیمتی برای گزینه‌های انتخابی '${propertyName}' یافت نشد.`);
  }

  // 👇 امضای متد برای دریافت ورودی‌های مشخص تغییر کرد
  private _findBindingPrice(bindingTariff: any, binding: { type: string }, size: string): number {
    const bindingType = binding.type.replace('_', '');

    if (!bindingTariff?.[bindingType]) {
      throw new BadRequestException(`نوع صحافی '${binding.type}' یافت نشد.`);
    }

    if (typeof bindingTariff[bindingType] === 'number') {
      return bindingTariff[bindingType];
    }

    if (bindingTariff[bindingType][size]) {
      return bindingTariff[bindingType][size];
    }

    throw new BadRequestException(
      `قیمتی برای صحافی '${binding.type}' با اندازه '${size}' یافت نشد.`,
    );
  }
}
