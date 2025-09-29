import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schema/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a JWT token and returns it along with the user data.
   * @param user - The user document.
   * @returns An object containing the access token and user information.
   */
  private _createToken(user: UserDocument) {
    const payload = { phone: user.phone, sub: user._id, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByPhone(registerDto.phone);
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.create({
      ...registerDto,
      passwordHash: hashedPassword,
    });

    return this._createToken(newUser);
  }

  async validateUser(phone: string, pass: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByPhone(phone);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this._createToken(user);
  }
}
