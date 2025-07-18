// import * as React from 'react';

// const GoogleIcon = (props: any) => (
//   <svg
//     id="Layer_1"
//     xmlns="http://www.w3.org/2000/svg"
//     xmlnsXlink="http://www.w3.org/1999/xlink"
//     x="0px"
//     y="0px"
//     viewBox="0 0 512 512"
//     style={{
//       enableBackground: 'new 0 0 512 512',
//     }}
//     xmlSpace="preserve"
//     {...props}
//   >
//     <path
//       style={{
//         fill: '#167EE6',
//       }}
//       d="M492.668,211.489l-208.84-0.01c-9.222,0-16.697,7.474-16.697,16.696v66.715 c0,9.22,7.475,16.696,16.696,16.696h117.606c-12.878,33.421-36.914,61.41-67.58,79.194L384,477.589 c80.442-46.523,128-128.152,128-219.53c0-13.011-0.959-22.312-2.877-32.785C507.665,217.317,500.757,211.489,492.668,211.489z"
//     />
//     <path
//       style={{
//         fill: '#12B347',
//       }}
//       d="M256,411.826c-57.554,0-107.798-31.446-134.783-77.979l-86.806,50.034 C78.586,460.443,161.34,512,256,512c46.437,0,90.254-12.503,128-34.292v-0.119l-50.147-86.81 C310.915,404.083,284.371,411.826,256,411.826z"
//     />
//     <path
//       style={{
//         fill: '#0F993E',
//       }}
//       d="M384,477.708v-0.119l-50.147-86.81c-22.938,13.303-49.48,21.047-77.853,21.047V512 C302.437,512,346.256,499.497,384,477.708z"
//     />
//     <path
//       style={{
//         fill: '#FFD500',
//       }}
//       d="M100.174,256c0-28.369,7.742-54.910,21.043-77.847l-86.806-50.034C12.502,165.746,0,209.444,0,256 s12.502,90.254,34.411,127.881l86.806-50.034C107.916,310.91,100.174,284.369,100.174,256z"
//     />
//     <path
//       style={{
//         fill: '#FF4B26',
//       }}
//       d="M256,100.174c37.531,0,72.005,13.336,98.932,35.519c6.643,5.472,16.298,5.077,22.383-1.008 l47.27-47.27c6.904-6.904,6.412-18.205-0.963-24.603C378.507,23.673,319.807,0,256,0C161.34,0,78.586,51.557,34.411,128.119 l86.806,50.034C148.202,131.62,198.446,100.174,256,100.174z"
//     />
//     <path
//       style={{
//         fill: '#D93F21',
//       }}
//       d="M354.932,135.693c6.643,5.472,16.299,5.077,22.383-1.008l47.27-47.27 c6.903-6.904,6.411-18.205-0.963-24.603C378.507,23.672,319.807,0,256,0v100.174C293.53,100.174,328.005,113.51,354.932,135.693z"
//     />
//   </svg>
// );

// interface GoogleSignInButtonProps {
//   onClick?: () => void;
//   disabled?: boolean;
//   className?: string;
// }

// const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
//   onClick,
//   disabled = false,
//   className = '',
// }) => {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       className={`
//         flex items-center justify-center gap-3 w-auto md:max-w-[250px] max-w-sm mx-auto
//        py-2  px-4 rounded-full
//         !bg-[#f3f3ec]
//         text-gray-600 font-medium text-base
//         transition-all duration-200 ease-in-out
//         shadow-sm
//         disabled:opacity-50 disabled:cursor-not-allowed
//         focus:outline-none mt-3
//         ${className}
//       `}
//     >
//       <GoogleIcon className="w-4 h-4" />
//       <span>Sign in with Google</span>
//     </button>
//   );
// };

// export default GoogleSignInButton;

import * as React from 'react';

const GoogleIcon = (props: any) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    style={{
      enableBackground: 'new 0 0 512 512',
    }}
    xmlSpace="preserve"
    {...props}
  >
    <path
      style={{
        fill: '#167EE6',
      }}
      d="M492.668,211.489l-208.84-0.01c-9.222,0-16.697,7.474-16.697,16.696v66.715 c0,9.22,7.475,16.696,16.696,16.696h117.606c-12.878,33.421-36.914,61.41-67.58,79.194L384,477.589 c80.442-46.523,128-128.152,128-219.53c0-13.011-0.959-22.312-2.877-32.785C507.665,217.317,500.757,211.489,492.668,211.489z"
    />
    <path
      style={{
        fill: '#12B347',
      }}
      d="M256,411.826c-57.554,0-107.798-31.446-134.783-77.979l-86.806,50.034 C78.586,460.443,161.34,512,256,512c46.437,0,90.254-12.503,128-34.292v-0.119l-50.147-86.81 C310.915,404.083,284.371,411.826,256,411.826z"
    />
    <path
      style={{
        fill: '#0F993E',
      }}
      d="M384,477.708v-0.119l-50.147-86.81c-22.938,13.303-49.48,21.047-77.853,21.047V512 C302.437,512,346.256,499.497,384,477.708z"
    />
    <path
      style={{
        fill: '#FFD500',
      }}
      d="M100.174,256c0-28.369,7.742-54.910,21.043-77.847l-86.806-50.034C12.502,165.746,0,209.444,0,256 s12.502,90.254,34.411,127.881l86.806-50.034C107.916,310.91,100.174,284.369,100.174,256z"
    />
    <path
      style={{
        fill: '#FF4B26',
      }}
      d="M256,100.174c37.531,0,72.005,13.336,98.932,35.519c6.643,5.472,16.298,5.077,22.383-1.008 l47.27-47.27c6.904-6.904,6.412-18.205-0.963-24.603C378.507,23.673,319.807,0,256,0C161.34,0,78.586,51.557,34.411,128.119 l86.806,50.034C148.202,131.62,198.446,100.174,256,100.174z"
    />
    <path
      style={{
        fill: '#D93F21',
      }}
      d="M354.932,135.693c6.643,5.472,16.299,5.077,22.383-1.008l47.27-47.27 c6.903-6.904,6.411-18.205-0.963-24.603C378.507,23.672,319.807,0,256,0v100.174C293.53,100.174,328.005,113.51,354.932,135.693z"
    />
  </svg>
);

interface GoogleSignInButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-3 w-auto md:max-w-[250px] max-w-sm mx-auto
        py-[5px] px-3  rounded-md
        !bg-[#f3f3ec]
        text-gray-600 font-medium text-base
        transition-all duration-200 ease-in-out
        shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none mt-3
        ${className}
      `}
    >
      <GoogleIcon className="w-4 h-4" />
      <span className="text-xs">Sign in with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
