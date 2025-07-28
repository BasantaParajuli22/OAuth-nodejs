import mongoose from "mongoose";

export interface IUser extends mongoose.Document{
    _id: string,    //mongoose auto created primary key
    username: string,
    googleId?: string, // Google's unique ID for the user
    email: string,
}

const UserSchema: mongoose.Schema = new mongoose.Schema<IUser>({
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values, but unique for non-null
      // sparse: true is important if you plan to have users
      // who don't log in via Google (e.g., local authentication)
    },
    username:{
        type: String,
        trim: true,
        default: "default name",
    },
    email:{
        type: String,
        required : true,
        unique: true,
        lowercase: true,
        trim: true,
    }
}, { timestamps: true });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
