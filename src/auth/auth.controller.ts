import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import { Request } from 'express';

import { authConstant, AuthSummary } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';
import { GetUser } from 'src/modules/users/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AuthSummary.SIGN_IN_SUMMARY })
  async signIn(
    @Body() authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/facebook')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('facebook'))
  facebookSignIn(): Promise<void> {
    return;
  }

  @Get('/facebook/callback')
  @ApiOperation({ summary: 'Redirect site after facebook login has succeeded' })
  @UseGuards(AuthGuard('facebook'))
  async facebookSignInCallback(@Req() req: Request): Promise<Express.User> {
    return this.authService.externalSignIn(req);
  }

  @Get('/google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  googleSignIn(): Promise<void> {
    return;
  }

  @Get('/google/callback')
  @ApiOperation({ summary: 'Redirect site after facebook login has succeeded' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request): Promise<Express.User> {
    return this.authService.externalSignIn(req);
  }

  @Post('/signout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: AuthSummary.SIGN_OUT })
  async signOut(
    @GetUser('email') email: string,
    @GetUser(authConstant.jwtAccessToken) token: string,
  ) {
    return this.authService.signOut(email, token);
  }
}
