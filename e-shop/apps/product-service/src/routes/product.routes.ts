import { Router } from 'express';
import {
  createDiscountCode,
  deleteDiscountCodes,
  getDisCountCodes,
  getProductCategories,
} from '../controller/product.controller';
import {
  authorizeRoles,
  isAuthenticated,
} from '@packages/middleware/isAuthenticated';

const productRouter: Router = Router();

productRouter.get(
  '/get-product-categories',
  isAuthenticated,
  authorizeRoles('seller'),
  getProductCategories
);

productRouter.post(
  '/create-discount-codes',
  isAuthenticated,
  authorizeRoles('seller'),
  createDiscountCode
);
productRouter.get(
  '/get-discount-codes',
  isAuthenticated,
  authorizeRoles('seller'),
  getDisCountCodes
);
productRouter.delete(
  '/delete-discount-codes/:id',
  isAuthenticated,
  authorizeRoles('seller'),
  deleteDiscountCodes
);

export default productRouter;
