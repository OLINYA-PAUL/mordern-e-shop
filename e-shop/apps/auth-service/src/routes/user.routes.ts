import express, { Router } from 'express';
import {
  loginUser,
  registerUser,
  verifyUserOtp,
  requestPasswordReset,
  resetUserPassword,
  verifyForgetPasswordOtp,
  logOutUser,
} from '../controllers/auth/auth-controller';

const authrouter: Router = express.Router();

authrouter.post('/user-registration', registerUser);
authrouter.post('/veriify-user', verifyUserOtp);
authrouter.post('/login-user', loginUser);
authrouter.post('/request-passwordreset', requestPasswordReset);
authrouter.post('/verify-otp', verifyForgetPasswordOtp);
authrouter.post('/reset-password', resetUserPassword);
authrouter.post('/logout-user', logOutUser);

export default authrouter;
