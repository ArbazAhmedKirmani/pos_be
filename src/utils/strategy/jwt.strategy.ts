import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { CacheService } from 'src/modules/cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.JWT.SECRET_KEY,
    });
  }

  validate(payload: any) {
    // const request = this.context.switchToHttp().getRequest();
    // const jwtToken: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req));

    const user = this.cacheService.Get(`${payload}-${payload.sub}`);
    return user;
  }
}
