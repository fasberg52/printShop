import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { RequestInfoDto } from 'src/dto/request-info.dto';
import { generateNumericOtp } from 'src/utils/generator-code.utils';
import { OtpActionEnum } from '../otp/enum/otp.enum';
import { Otp, OtpDocument } from '../otp/schema/otp.schema';
import { SmsService } from '../sms/sms.service';
import { UserDocument } from '../users/schema/user.schema';
import { UsersService } from '../users/users.service';
import { CheckPhoneDto } from './dto/check-phone.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { CheckPhoneResponseDto } from './dto/response-dto/check-phone.response.dto';
import { AccessTokenResponseDto } from './dto/response-dto/token-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _smsService: SmsService,
    @InjectModel(Otp.name) private _otpModel: Model<OtpDocument>,
  ) {}

  async checkPhone(dto: CheckPhoneDto): Promise<CheckPhoneResponseDto> {
    const user = await this._usersService.findByPhone(dto.phone);
    return plainToInstance(CheckPhoneResponseDto, { userExists: !!user });
  }

  async requestOtp(dto: RequestOtpDto, reqInfo: RequestInfoDto): Promise<{ message: string }> {
    const { phone, action } = dto;
    await this._sendOtp(phone, action, reqInfo.ip, reqInfo.userAgent);
    return { message: 'کد تایید با موفقیت ارسال شد.' };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this._usersService.create({
      ...registerDto,
      passwordHash: hashedPassword,
    });

    const token = this._generateToken(newUser);
    return plainToInstance(AccessTokenResponseDto, token);
  }

  async verifyRegistrationOtp(dto: VerifyOtpDto): Promise<AccessTokenResponseDto> {
    const existingUser = await this._usersService.findByPhone(dto.phone);
    if (existingUser) {
      throw new UnauthorizedException('این شماره تلفن قبلا ثبت نام شده است.');
    }
    await this._validateOtp(dto.phone, dto.code, OtpActionEnum.REGISTER);
    const payload = { phone: dto.phone, purpose: 'complete-registration' };
    const registrationToken = this._jwtService.sign(payload, { expiresIn: '10m' });
    return plainToInstance(AccessTokenResponseDto, { accessToken: registrationToken });
  }

  async loginWithPassword(loginDto: LoginDto): Promise<AccessTokenResponseDto> {
    const user = await this._validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this._generateToken(user);
    return plainToInstance(AccessTokenResponseDto, token);
  }

  async verifyLoginOtp(dto: VerifyOtpDto): Promise<AccessTokenResponseDto> {
    const { phone, code } = dto;
    const user = await this._usersService.findByPhone(phone);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    await this._validateOtp(phone, code, OtpActionEnum.LOGIN);

    const token = this._generateToken(user);
    return plainToInstance(AccessTokenResponseDto, token);
  }

  private async _validateUser(phone: string, pass: string): Promise<UserDocument | null> {
    const user = await this._usersService.findByPhone(phone);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  private async _validateOtp(phone: string, code: string, action: OtpActionEnum): Promise<void> {
    const otpDocument = await this._otpModel.findOne({ phone, action });

    if (!otpDocument) {
      throw new NotFoundException('کد تاییدی برای این شماره یافت نشد.');
    }

    if (new Date() > otpDocument.expiresAt) {
      await this._otpModel.deleteOne({ _id: otpDocument._id });
      throw new UnauthorizedException('کد تایید منقضی شده است.');
    }

    await this._otpModel.deleteOne({ _id: otpDocument._id });
  }

  private async _sendOtp(
    phone: string,
    action: OtpActionEnum,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const otpCode = generateNumericOtp(5);
    console.log(`otpCode for ${phone} is: ${otpCode}`);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this._otpModel.findOneAndUpdate(
      { phone, action },
      { code: otpCode, expiresAt, ip, userAgent },
      { upsert: true, new: true },
    );

    await this._smsService.sendOtp(phone, otpCode);
  }

  private _generateToken(user: UserDocument) {
    const payload = { phone: user.phone, sub: user._id, roles: user.roles };
    const accessToken = this._jwtService.sign(payload);

    return {
      accessToken: accessToken,
    };
  }
}
