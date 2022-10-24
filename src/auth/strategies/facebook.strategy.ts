import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { appConfig, facebookConfig } from 'src/configs/configs.constants';
import { UsersRole } from 'src/modules/users/users.constants';
import { UsersService } from 'src/modules/users/users.service';
import IJwtPayload from '../payloads/jwt-payload';

@Injectable()
export class FacebookStategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: facebookConfig.id,
      clientSecret: facebookConfig.secret,
      callbackURL: `http://localhost:${appConfig.port}/auth/facebook/callback`,
      scope: 'email',
      profileFields: ['emails', 'name', 'displayName', 'photos'],
      auth_type: 'reauthenticate',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const email = profile.emails[0].value;
    const name =
      profile.name.familyName +
      profile.name.givenName +
      profile.name.middleName;
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      await this.usersService.create({
        email,
        password: null,
        name,
        role: UsersRole.USER,
      });
    }

    const payload: IJwtPayload = { email, role: user.role };
    const jwtToken = await this.jwtService.signAsync(payload);

    done(null, { jwtAccessToken: jwtToken });
  }
}
