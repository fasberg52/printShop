import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { RequestInfo } from 'src/common/decorators/request-info.decorator';
import { RequestInfoDto } from 'src/dto/request-info.dto';
import { AuthService } from './auth.service';
import { CheckPhoneDto } from './dto/check-phone.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { CheckPhoneResponseDto } from './dto/response-dto/check-phone.response.dto';
import { AccessTokenResponseDto } from './dto/response-dto/token-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('check-phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'بررسی وجود شماره تلفن' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'شماره تلفن بررسی شد',
    type: CheckPhoneResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'شماره تلفن نامعتبر است' })
  checkPhone(@Body() phone: CheckPhoneDto): Promise<CheckPhoneResponseDto> {
    return this.authService.checkPhone(phone);
  }

  @Public()
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ارسال کد تایید (OTP) برای ثبت نام' })
  @ApiResponse({ status: HttpStatus.OK, description: 'پیامک کد تایید با موفقیت ارسال شد' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'شماره تلفن نامعتبر است' })
  requestRegisterOtp(@Body() dto: RequestOtpDto, @RequestInfo() reqInfo: RequestInfoDto) {
    return this.authService.requestOtp(dto, reqInfo);
  }

  @Public()
  @Post('register/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'مرحله ۲ ثبت نام: تایید کد و دریافت توکن موقت' })
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiResponse({ status: 401, description: 'کد نامعتبر یا منقضی' })
  verifyRegistrationOtp(@Body() dto: VerifyOtpDto): Promise<AccessTokenResponseDto> {
    return this.authService.verifyRegistrationOtp(dto);
  }

  @Public()
  @Post('login/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ورود نهایی با استفاده از کد OTP' })
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiResponse({ status: 401, description: 'کد نامعتبر یا منقضی' })
  verifyLoginOtp(@Body() dto: VerifyOtpDto): Promise<AccessTokenResponseDto> {
    return this.authService.verifyLoginOtp(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ورود کاربر با شماره تلفن و رمز عبور' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ورود موفقیت آمیز بود',
    type: AccessTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'شماره تماس یا رمز عبور نامعتبر است',
  })
  login(@Body() dto: LoginDto): Promise<AccessTokenResponseDto> {
    return this.authService.loginWithPassword(dto);
  }
}
