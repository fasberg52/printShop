import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validationEnv = <T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T => {
  const validatedConfig = plainToInstance(envVariablesClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map(err => Object.values(err.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Config validation error: ${errorMessages}`);
  }

  return validatedConfig;
};
