"use strict";
import passport from "passport";
import User from "../entity/usuario.entity.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { correo_usuario: jwt_payload.correo_usuario },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export function passportJwtSetup() {
  passport.initialize();
}
