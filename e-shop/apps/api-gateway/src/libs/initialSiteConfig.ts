import { PrismaClient } from '@prisma/client';

 const prisma = new PrismaClient();

 export const initialSiteConfig = async () => {
  try {
    const exsitingConfig = await prisma.site_Configs.findFirst();

    if (!exsitingConfig) {
      await prisma.site_Configs.create({
        data: {
          categories: [
            'Shoes',
            'Knifes',
            'Yam',
            'Clothing',
            'Electronics',
            'Furniture',
            'Books',
            'Groceries',
            'Beauty',
            'Sports',
          ],
          subCategories: {
            Shoes: ['Sneakers', 'Sandals', 'Boots', 'Formal'],
            Knifes: ['Kitchen Knives', 'Hunting Knives', 'Pocket Knives'],
            Yam: ['White Yam', 'Yellow Yam', 'Pounded Yam Flour'],
            Clothing: ['Men', 'Women', 'Kids', 'Accessories'],
            Electronics: ['Phones', 'Laptops', 'TVs', 'Stoves'],
            Furniture: ['Living Room', 'Bedroom', 'Office', 'Outdoor'],
            Books: ['Fiction', 'Non-Fiction', 'Educational', 'Comics'],
            Groceries: ['Fruits', 'Vegetables', 'Snacks', 'Beverages'],
            Beauty: ['Makeup', 'Skincare', 'Haircare', 'Fragrance'],
            Sports: ['Football', 'Basketball', 'Gym Equipment', 'Cycling'],
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};


