
export interface BreakpointInterface {
  at: number;
  singleSided: number;
  doubleSided: number;
  singleSidedGlossy?: number;
  doubleSidedGlossy?: number;
}

export interface PrintOptionInterface {
  singleSided: number;
  doubleSided: number;
  singleSidedGlossy?: number;
  doubleSidedGlossy?: number;
  breakpoints?: BreakpointInterface[];
}

export interface PrintSizeInterface {
  fullColor?: PrintOptionInterface;
  normalColor?: PrintOptionInterface;
  blackAndWhite?: PrintOptionInterface;
}

export interface PrintTariffInterface {
  a3?: PrintSizeInterface;
  a4?: PrintSizeInterface;
  a5?: PrintSizeInterface;
}

export interface BindingSizePriceInterface {
  a3: number;
  a4: number;
  a5: number;
}

export interface BindingTariffInterface {
  springNormal?: BindingSizePriceInterface;
  springPapco?: BindingSizePriceInterface;
  stapler?: number;
}


export interface TariffConfigurationInterface {
  print?: PrintTariffInterface;
  binding?: BindingTariffInterface;
}
