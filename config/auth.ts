import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import userModel from "../model/userModel";
import crypto from "crypto";

const generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex");
};

const createReferralLink: any = (code: string) => {
  const baseUrl = "https://subsum.com";
  return `${baseUrl}/referral/${code}`;
};

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "294897360609-n4p28mh2bmvqch6nuriqhpr6ssmp20ai.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:1212/google/callback",
      passReqToCallback: true,
    },
    async (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) => {
      try {
        let referral_code;
        let isUnique = false;
        while (!isUnique) {
          referral_code = generateReferralCode();
          const existingCode = await userModel.findOne({ referral_code });
          if (!existingCode) {
            isUnique = true;
          }
        }

        const referral_link = createReferralLink(referral_code);

        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await userModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value || "",
            referral_link,
            referral_code,
          });
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
});
