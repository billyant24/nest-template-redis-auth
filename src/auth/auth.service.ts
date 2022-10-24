import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import IJwtPayload from './payloads/jwt-payload';
import { AuthMessage } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Sign in an user.
   * @param authCredentialsDto AuthCredentialsDto.
   */
  async signIn(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.getByEmail(email);

    // If user with email exist and the password is valid.
    if (user && (await user.validatePassword(password))) {
      const payload: IJwtPayload = { email, role: user.role };
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      await this.redisService.hsetAsync(email, jwtAccessToken, jwtAccessToken);
      return { jwtAccessToken, user };
    }
    // Else return an error.
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
  }

  async externalSignIn(req: Request): Promise<Express.User> {
    return req.user;
  }

  async signOut(email: string, token: string) {
    const result = await this.redisService.hdelAsync(email, token);
    if (result !== 1) {
      throw new InternalServerErrorException();
    }
    return {
      message: AuthMessage.SIGN_OUT_SUCCESS,
    };
  }
}
