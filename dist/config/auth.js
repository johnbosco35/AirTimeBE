"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const userModel_1 = __importDefault(require("../model/userModel"));
const crypto_1 = __importDefault(require("crypto"));
const environmentsVariables_1 = require("../environment/environmentsVariables");
const generateReferralCode = () => {
    return crypto_1.default.randomBytes(4).toString("hex");
};
const createReferralLink = (code) => {
    const baseUrl = "https://subsum.com";
    return `${baseUrl}/referral/${code}`;
};
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: environmentsVariables_1.environmentVariables.CLIENT_URI || "",
    clientSecret: environmentsVariables_1.environmentVariables.CLIENT_SECRET || "",
    callbackURL: "http://localhost:1212/google/callback",
    passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let referral_code;
        let isUnique = false;
        while (!isUnique) {
            referral_code = generateReferralCode();
            const existingCode = yield userModel_1.default.findOne({ referral_code });
            if (!existingCode) {
                isUnique = true;
            }
        }
        const referral_link = createReferralLink(referral_code);
        let user = yield userModel_1.default.findOne({ googleId: profile.id });
        if (user) {
            done(null, user);
        }
        else {
            user = yield userModel_1.default.create({
                googleId: profile.id,
                name: profile.displayName,
                email: ((_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value) || "",
                referral_link,
                referral_code,
            });
            done(null, user);
        }
    }
    catch (error) {
        console.log(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, undefined);
    }
}));
