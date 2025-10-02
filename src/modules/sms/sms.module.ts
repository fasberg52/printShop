import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsProviderEnum } from './enum/sms-provider';
import { KavenegarService } from './providers/kavenegar.service';
import { SmsService } from './sms.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    {
      provide: SmsService,
      useFactory: (configService: ConfigService, httpService: HttpService) => {
        const provider = configService.getOrThrow('SMS_PROVIDER');
        if (provider === SmsProviderEnum.KAVENEGAR)
          return new KavenegarService(configService, httpService);
      },
      inject: [ConfigService, HttpService],
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
