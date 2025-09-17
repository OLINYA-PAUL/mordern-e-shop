import { Router } from 'express';
import { getProductCategories } from '../controller/product.controller';

const productRouter: Router = Router();

productRouter.get('/get-product-categories', getProductCategories);

export default productRouter;
