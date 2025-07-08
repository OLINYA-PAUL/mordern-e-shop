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

export const userSchema = yup
  .object({
    name: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().required(),
  })
  .required();
