// // const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');

// // The above utility import will not work if you are using Next.js' --turbo.
// // Instead you will have to manually add the dependent paths to be included.
// // For example
// // ../libs/buttons/**/*.{ts,tsx,js,jsx,html}',                 <--- Adding a shared lib
// // !../libs/buttons/**/*.{stories,spec}.{ts,tsx,js,jsx,html}', <--- Skip adding spec/stories files from shared lib

// // If you are **not** using `--turbo` you can uncomment both lines 1 & 19.
// // A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
//     '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
//     //     ...createGlobPatternsForDependencies(__dirname)
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');

// The above utility import will not work if you are using Next.js' --turbo.
// Instead you will have to manually add the dependent paths to be included.
// For example
// ../libs/buttons/**/*.{ts,tsx,js,jsx,html}',                 <--- Adding a shared lib
// !../libs/buttons/**/*.{stories,spec}.{ts,tsx,js,jsx,html}', <--- Skip adding spec/stories files from shared lib

// If you are **not** using `--turbo` you can uncomment both lines 1 & 19.
// A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [
  //   './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
  //   './app/**/*.{ts,tsx,js,jsx,html}',
  //   '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  //   //     ...createGlobPatternsForDependencies(__dirname)
  // ],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    // './shared/**/*.{js,ts,jsx,tsx}', // ✅ include shared components outside the app
    '!./**/*.{spec,stories}.{js,ts,jsx,tsx}', // ignore tests/stories
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
