import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../modules/products/schema/product.schema';
import { Tariffs, TariffsDocument } from '../modules/tariffs/schema/tariffs.schema';

@Injectable()
export class PriceCalculationService {
  constructor(
    @InjectModel(Tariffs.name) private readonly _TariffsModel: Model<TariffsDocument>,
    @InjectModel(Product.name) private readonly _productModel: Model<ProductDocument>,
  ) {}

  private findTierForQty(tiers: any[], qty: number) {
    const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);
    return sorted.find((t) => qty >= t.minQuantity && qty <= t.maxQuantity) || null;
  }

  /**
   * Compute price for one product item
   * selectedOptions: Array<{ optionName, valueName }>
   */
  async calculateItemPrice(productId: string, selectedOptions: any[], quantity: number) {
    const product = await this._productModel.findById(productId).lean();
    if (!product) throw new NotFoundException('Product not found');

    if (!product.pricingSchemeId)
      throw new NotFoundException('Product has no pricing scheme assigned');

    const scheme = await this._TariffsModel.findById(product.pricingSchemeId).lean();
    if (!scheme) throw new NotFoundException('Pricing scheme not found');

    const tier = this.findTierForQty(scheme.tiers, quantity);
    if (!tier) throw new NotFoundException('No pricing tier for given quantity');

    const basePrice = tier.pricePerUnit;
    let additionalPerUnit = 0;

    for (const sel of selectedOptions || []) {
      const optDef = (product.configurableOptions || []).find(
        (o) => o.optionName === sel.optionName,
      );
      if (!optDef) continue;
      const val = (optDef.values || []).find((v) => v.valueName === sel.valueName);
      if (val && typeof val.additionalCostPerUnit === 'number')
        additionalPerUnit += val.additionalCostPerUnit;
    }

    const unitPrice = basePrice + additionalPerUnit;
    const totalItemPrice = unitPrice * quantity;

    return {
      unitPrice,
      totalItemPrice,
      breakdown: { basePrice, additionalPerUnit, tier },
      productSnapshot: { id: product._id, name: product.name, slug: product.slug },
      pricingSchemeSnapshot: {
        id: scheme._id,
        schemeName: scheme.schemeName,
        version: scheme.version,
      },
    };
  }
}
