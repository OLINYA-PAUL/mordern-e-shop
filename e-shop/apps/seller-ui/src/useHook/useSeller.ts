import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../configs/axios';

export interface IShop {
  id: string;
  name: string;
  bio: string;
  categories: string[];
  coverBanner: string | null;
  address: string;
  opening_hours: string;
  website: string;
  ratings: number;
  sellerId: string;
  social_links: any[]; // You might want to create a specific interface for social links
  createdAt: string; // or Date if you prefer Date objects
  updatedAt: string; // or Date if you prefer Date objects
}

type Seller = {
  account_number: string;
  bank_code: string;
  bank_name: string;
  country: string;
  createdAt: string;
  email: string;
  id: string;
  imageId: string;
  name: string;
  password: string;
  phone_number: string;
  shopId: string;
  stripeId: string;
  sub_account: string;
  updatedAt: string;
  shops: IShop[];
};

const getSeller = async (): Promise<Seller> => {
  const res = await axiosInstance.get<{ seller: Seller }>('/get-seller');
  console.log('seller data:', res.data.seller);
  return res.data.seller;
};

const useSeller = () => {
  const {
    isLoading,
    isError,
    error,
    data: seller,
  } = useQuery({
    queryKey: ['seller'],
    queryFn: getSeller,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, isError, error, seller } as const;
};

export default useSeller;
