import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KAVENEGAR_API } from 'src/common/constant/kavenegar.constant';
import { SmsService } from '../sms.service';

@Injectable()
export class KavenegarService implements SmsService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly otpTemplate: string;
  private readonly sender: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('KAVENEGAR_API_KEY');
    this.baseUrl = this.configService.getOrThrow<string>('KAVENEGAR_BASE_URL');
    this.otpTemplate = this.configService.getOrThrow<string>('KAVENEGAR_OTP_TEMPLATE');
    this.sender = this.configService.getOrThrow<string>('KAVENEGAR_SENDER_NUMBER');
  }

  async sendOtp(to: string, code: string): Promise<void> {
    this._buildUrl(KAVENEGAR_API.ACTIONS.VERIFY.LOOKUP);
  }

  async sendMessage(to: string, message: string): Promise<void> {
    this._buildUrl(KAVENEGAR_API.ACTIONS.SMS.SEND);
  }

  private _buildUrl(actionPath: string): string {
    return `${this.baseUrl}/${this.apiKey}/${actionPath}`;
  }
}
