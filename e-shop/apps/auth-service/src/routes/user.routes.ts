import express, { Router } from 'express';
import {
  loginUser,
  verifyUserOtp,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  verifyForgetPasswordOtp,
  logOutUser,
  refressUserToken,
  getUser,
  registerSeller,
  verifySellerOtp,
  createSellerShop,
} from '../controllers/auth/auth-controller';
import { isAuthenticated } from '../../../../packages/middleware/isAuthenticated';

const authrouter: Router = express.Router();

authrouter.post('/user-registration', registerUser);
authrouter.post('/verify-user', verifyUserOtp);
authrouter.post('/login-user', loginUser);
authrouter.post('/refress_token', refressUserToken);
authrouter.post('/request-passwordreset', requestPasswordReset);
authrouter.post('/verify-otp', verifyForgetPasswordOtp);
authrouter.post('/reset-password', resetUserPassword);
authrouter.post('/logout-user', logOutUser);
authrouter.get('/get-auth-user', isAuthenticated, getUser);
authrouter.get('/auth-user', isAuthenticated);

// seller registration

authrouter.post('/seller-registration', registerSeller);
authrouter.post('/verify-seller', verifySellerOtp);
authrouter.post('/create-shop', createSellerShop);

export default authrouter;
