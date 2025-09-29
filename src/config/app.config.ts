import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class EnvironmentVariablesValidator {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'DEFAULT_SECRET_KEY_CHANGE_IN_PRODUCTION';

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '1d';

  @IsString()
  @IsOptional()
  SWAGGER_USER: string;

  @IsString()
  @IsOptional()
  SWAGGER_PASSWORD: string;
}
