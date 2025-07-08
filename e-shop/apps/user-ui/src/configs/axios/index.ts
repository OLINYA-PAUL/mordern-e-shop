import axios, { AxiosError } from 'axios';

const headers = {};

console.log({ 'api url': process.env.NEXT_PUBLIC_API_BASE_URL });

export const axiosErr = AxiosError;

export const axiosBaseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers,
});
