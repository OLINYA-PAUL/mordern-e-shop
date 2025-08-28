import { NextFunction, Request, Response } from 'express';
import prisma from '@packages/prisma';

export const getProductCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.site_Configs.findFirst({
      select: {
        categories: true,
        subCategories: true,
      },
    });

    if (!config || !config.categories?.length || !config.subCategories) {
      return res.status(404).json({
        message: 'No product categories found in the database',
      });
    }

    return res.json({
      message: 'Product categories retrieved successfully',
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error: any) {
    console.error('Error fetching product categories:', error.message);
    return next(error);
  }
};
