import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../configs/axios';

type Seller = {
  id: string;
  name: string;
  email: string;
  imageId: null;
  following: [];
  createdAt: string;
  updatedAt: string;
};

const getSller = async (): Promise<Seller> => {
  const res = await axiosInstance.get('/get-seller');

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
    queryFn: getSller,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, isError, error, seller } as const;
};

export default useSeller;
