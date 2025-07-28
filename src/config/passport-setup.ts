import passport from "passport";
import passportGoogle, { Profile, VerifyCallback } from "passport-google-oauth20";
import User from "../modules/auth/user.model";
import { MyUserType } from "../types";


const GoogleStrategy = passportGoogle.Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET";


// Takes the full user object and stores only the user ID
//Sessions should be lightweight //later we use this id to get full user when its needed
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id); //serialize id
});


//Reconstructs full user object from session ID
//session id was serialized when logging 
//Taking the stored user id from session
// Queries database to get full User record
// Creates a "safe" user object with only needed fields
// Returns this object for use in routes
//.lean(): Returns plain JavaScript object instead of Mongoose document (faster)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean(); // returns plain JS object
    if (user) {
      const safeUser: MyUserType = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        googleId: user.googleId,
      };
      done(null, safeUser);
    } else {
      done(null, undefined);
    }
  } catch (err) {
    done(err);
  }
});



passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        //check for existing user 
        const user = await User.findOne({ googleId: profile.id }).lean();
        if (user) {
          const safeUser: MyUserType = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            googleId: user.googleId,
          };
          return done(null, safeUser);
        }

        //if no existing user then create new User
        //User.create(...) returns a Mongoose Document, but Passport expects a MyUserType
        const createdUser = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
        });
        //manual change mongoose Document to MyUserType
        const newUser: MyUserType = {
          id: createdUser._id.toString(),
          username: createdUser.username,
          email: createdUser.email,
          googleId: createdUser.googleId,
        };
        return done(null, newUser);


      } catch (err) {
        return done(err as Error);
      }
    }
  )
);