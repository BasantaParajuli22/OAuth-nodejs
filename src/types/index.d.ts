
// This is what gets attached to req.user by Passport.
//  It must be a plain object, not a Mongoose Document.
// It should match the shape of the user object that comes from your Mongoose model
export interface MyUserType{
    id: string,    //mongoose auto created primary key
    username: string,
    googleId?: string, 
    email: string,
}

declare global {
  namespace Express {
    interface User extends MyUserType { }
  }
}
