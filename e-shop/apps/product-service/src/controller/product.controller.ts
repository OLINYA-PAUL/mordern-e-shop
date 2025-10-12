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

interface DiscountCode {
  discountCodes: string;
  public_name: string;
  discountType: string;
  discountValue: number;
  sellerId?: string;
}

export const createDiscountCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      discountCodes,
      public_name,
      discountType,
      discountValue,
      sellerId,
    } = req.body as DiscountCode;

    // ✅ Validate required fields
    if (
      !discountCodes ||
      !public_name ||
      !discountType ||
      !discountValue ||
      !sellerId
    ) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // ✅ Validate user authorization
    const userId = req.user?.id;
    if (userId !== sellerId) {
      res.status(403).json({ message: 'Unauthorized action' });
      return;
    }

    // // ✅ Validate code length before DB query
    // if (discountCode.length < 10 || discountCode.length > 10) {
    //   res.status(400).json({
    //     message: "Discount code can't be lower or exceeds 10 characters",
    //   });
    //   return;
    // }

    // ✅ Check if discount code already exists
    const existingCode = await prisma.discount_codes.findUnique({
      where: { discountCodes },
    });

    if (existingCode) {
      res.status(409).json({ message: 'Discount code already exists' });
      return;
    }

    // ✅ Create new discount code
    const newDiscountCode = await prisma.discount_codes.create({
      //@ts-ignore
      data: {
        discountCodes,
        public_name,
        discountType,
        discountValue: Number(discountValue),
        sellerId: userId,
      },
    });

    res.status(201).json({
      message: 'Discount code created successfully',
      discountCodes: newDiscountCode,
    });
  } catch (error) {
    console.error('Error creating discount code:', (error as Error).message);
    next(error);
  }
};

export const getDisCountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sellerId = req.user.id;
  try {
    const discountCodes = await prisma.discount_codes.findMany({
      where: {
        sellerId,
      },
    });

    res.status(200).json({
      success: true,
      discountCodes,
    });
  } catch (error) {
    console.error('Error getting discount code:', (error as Error).message);
    next(error);
  }
};

export const deleteDiscountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    console.log(sellerId + id + 'which is diount code data');

    if (!id) {
      res
        .status(400)
        .json({ success: false, message: 'please provide discount code Id' });
    }

    const discountCodes = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCodes)
      res.status(400).json({
        success: false,
        message: 'You are not authorised to delete the discount codes',
      });

    if (discountCodes?.sellerId !== sellerId) {
      res.status(400).json({
        success: false,
        message: 'You are not authorise to perform this operation',
      });
    }

    await prisma.discount_codes.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Discount code deleted successfully',
    });
  } catch (error) {
    console.error('Error Deleting discount code:', (error as Error).message);
    next(error);
  }
};

export const editDiscountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { discountCodes, public_name, discountType, discountValue } =
      req.body as DiscountCode;
    const { id } = req.params;
    const sellerId = req.user.id;

    if (!discountCodes || !public_name || !discountType || !discountValue) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (!id) {
      res
        .status(400)
        .json({ success: false, message: 'Please provide discount code Id' });
      return;
    }

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCode) {
      res.status(404).json({
        success: false,
        message: 'Discount code not found',
      });
      return;
    }

    if (discountCode.sellerId !== sellerId) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this operation',
      });
      return;
    }

    await prisma.discount_codes.update({
      where: { id },
      data: {
        discountCodes,
        discountType,
        discountValue: Number(discountValue),
        public_name,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Discount code updated successfully',
    });
  } catch (error) {
    console.error('Error updating discount code:', (error as Error).message);
    next(error);
  }
};
