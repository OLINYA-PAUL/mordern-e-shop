import { Router } from 'express';
import {
  createDiscountCode,
  deleteDiscountCodes,
  getDisCountCodes,
  getProductCategories,
  editDiscountCodes,
  uploadProductImage,
  deleteProductImage,
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

productRouter.put(
  '/edit-discount-codes/:id',
  isAuthenticated,
  authorizeRoles('seller'),
  editDiscountCodes
);

productRouter.post(
  '/upload-image',
  isAuthenticated,
  authorizeRoles('seller'),
  uploadProductImage
);

productRouter.delete(
  '/delete-image-file',
  isAuthenticated,
  authorizeRoles('seller'),
  deleteProductImage
);

export default productRouter;
