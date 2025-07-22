import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../configs/axios';

type User = {
  id: string;
  name: string;
  email: string;
  imageId: null;
  following: [];
  createdAt: string;
  updatedAt: string;
};

const getUser = async (): Promise<User> => {
  const res = await axiosInstance.get('/get-auth-user');

  console.log('User data:', res.data.user);
  return res.data.user;
};

const useUser = () => {
  const {
    isLoading,
    isError,
    error,
    data: user,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, isError, error, user } as const;
};

export default useUser;
