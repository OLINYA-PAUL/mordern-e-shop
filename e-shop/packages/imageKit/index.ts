import ImageKit from 'imagekit';

const imageKit = new ImageKit({
  publicKey:
    (process.env.IMAGEKIT_PUBLIC_KEY! as string) ??
    'public_rDohZ1IiIQ6G0tNio/ckQqQOOlo=',
  privateKey:
    (process.env.IMAGEKIT_PRIVATE_KEY! as string) ??
    'private_0Lfy5Ko/V4MGdn4b/mdChmZIoLo=',
  urlEndpoint:
    (process.env.IMAGEKIT_URL_ENDPOINT! as string) ??
    'https://ik.imagekit.io/dkomigvf8',
});

console.log('ImageKit initialized with URL endpoint:', {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY! as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY! as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT! as string,
});
export default imageKit;
