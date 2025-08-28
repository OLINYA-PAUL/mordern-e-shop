import { Router } from 'express';
import { getProductCategories } from '../controller/product.controller';

const router: Router = Router();

router.get('/get-product-categories', getProductCategories);

export default router;
