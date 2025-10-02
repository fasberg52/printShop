export abstract class SmsService {
  abstract sendOtp(to: string, code: string): Promise<void>;

  abstract sendMessage(to: string, message: string): Promise<void>;
}
