import 'dotenv/config';
import express, { Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import dns from 'dns';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import './config/passport-setup';
import connectToDB from './config/mongoose.config';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS 

const app = express();
const PORT = process.env.PORT || 5000;

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use auth routes
app.use('/auth', authRoutes);
app.use('', userRoutes);


async function startServer() {
  try {
      await connectToDB(); //connect to mongo db

      app.listen (PORT, ()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
      } );
  } catch (error) {
      console.error(' Failed to start server: ', error);
      process.exit(1);
  }
}

startServer();