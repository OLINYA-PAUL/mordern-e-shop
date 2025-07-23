const items = 'search'; // This is just a placeholder, replace it with your actual logic

const styles = {
  input:
    'w-full  py-2 px-5   border-none outline-none bg-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-300 transition duration-200 ease-in-out backdrop-blur-md !rounded-full',
  searchIoncs: `${
    items === 'search' && 'rounded-r-full'
  } text-lg cursor-pointer transition uration-200 ease-in-out hover:text-slate-500 flex items-center justify-center absolute top-0 right-0 bg-blue-400 h-[40px] w-[60px]`,
};

export default styles;
