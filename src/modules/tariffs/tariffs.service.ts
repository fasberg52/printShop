import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Tariffs, TariffsDocument } from './schema/tariffs.schema';

@Injectable()
export class TariffsService {
  constructor(
    @InjectModel(Tariffs.name)
    private readonly tariffsModel: Model<TariffsDocument>,
  ) {}

  async create(createTariffDto: CreateTariffDto): Promise<TariffsDocument> {
    const newTariff = await this.tariffsModel.create(createTariffDto);
    return newTariff.toObject() as TariffsDocument;
  }

  async update(id: string, updateTariffDto: UpdateTariffDto): Promise<TariffsDocument> {
    const tariff = await this.tariffsModel.findByIdAndUpdate(id, updateTariffDto, { new: true });
    if (!tariff) {
      throw new NotFoundException(`تعرفه‌ای با شناسه ${id} یافت نشد.`);
    }
    return tariff.toObject() as TariffsDocument;
  }

  async findAll(): Promise<TariffsDocument[]> {
    return this.tariffsModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActiveByName(name: string): Promise<TariffsDocument> {
    const tariff = await this.tariffsModel.findOne({ name, isActive: true }).exec();
    if (!tariff) {
      throw new NotFoundException(`تعرفه فعالی با نام '${name}' یافت نشد.`);
    }
    return tariff;
  }
}
