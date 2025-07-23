import { NavItmesTypes } from './global.d.types';
import * as yup from 'yup';

export const navItems: NavItmesTypes[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'Shops',
    href: '/shops',
  },
  {
    title: 'Offers',
    href: '/offers',
  },
  {
    title: 'Become a Seller',
    href: '/Become-a-Seller',
  },
];

export const SingUpSchema = yup
  .object({
    name: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().required(),
  })
  .required();

export const LoginSchema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
    rememberMe: yup.boolean().optional(),
  })
  .required();

export const RequestOtp = yup
  .object({
    email: yup.string().required(),
  })
  .required();

export const VerifyOtp = yup
  .object({
    email: yup.string().required(),
    otp: yup.number().required(),
  })
  .required();

export const ResetNewPassword = yup
  .object({
    email: yup.string().required(),
    newpassword: yup.string().required(),
  })
  .required();
