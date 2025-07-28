import { Request, Response, Router } from 'express';
import { MyUserType } from '../../types/index';

const router = Router();

// Home route
router.get('/', (req: Request, res: Response) => {
  res.send('<h1>Home Page</h1><a href="/auth/login">Login with Google</a>');
});

// Protected profile route
router.get('/profile', (req: Request, res: Response) => {
  // Check if user is authenticated (req.user is set by passport.deserializeUser)
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  // const user = req.user as MyUserType;
  res.send(`<h1>Welcome, ${req.user.username}!</h1><p>Your Google ID: ${req.user.googleId}</p><a href="/auth/logout">Logout</a>`);
});

export default router;