import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { environment } from "./environment";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: environment.jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: environment.googleClientId,
      clientSecret: environment.googleClientSecret,
      callbackURL: environment.googleCallbackUrl,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(new Error("Email not provided from Google"), false);
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.name?.givenName || "",
              lastName: profile.name?.familyName || "",
              googleId: profile.id,
              role: "user",
            },
          });
        } else if (!user.googleId) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
