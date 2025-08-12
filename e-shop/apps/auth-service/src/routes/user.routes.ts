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
  connectStripe,
  loginSeller,
  createPayStackSubAccount,
  getSeller,
} from '../controllers/auth/auth-controller';
import {
  isAuthenticated,
  authorizeRoles,
} from '../../../../packages/middleware/isAuthenticated';

const authrouter: Router = express.Router();

authrouter.post('/user-registration', registerUser);
authrouter.post('/verify-user', verifyUserOtp);
authrouter.post('/login-user', loginUser);
// authrouter.post('/refress_token', refressUserToken);
authrouter.post('/request-passwordreset', requestPasswordReset);
authrouter.post('/verify-otp', verifyForgetPasswordOtp);
authrouter.post('/reset-password', resetUserPassword);
authrouter.post('/logout-user', logOutUser);
authrouter.get(
  '/get-auth-user',
  isAuthenticated,
  authorizeRoles('user'),
  refressUserToken,
  getUser
);
authrouter.get('/auth-user', isAuthenticated);

// seller registration

authrouter.post('/seller-registration', registerSeller);
authrouter.post('/verify-seller', verifySellerOtp);
authrouter.post('/create-shop', createSellerShop);
authrouter.post('/create-payment-method', connectStripe);
authrouter.post('/create-paystack-subaccount', createPayStackSubAccount);
authrouter.post('/login-seller', loginSeller);
authrouter.get(
  '/get-seller',
  isAuthenticated,
  authorizeRoles('seller'),
  refressUserToken,
  getSeller
);

export default authrouter;
