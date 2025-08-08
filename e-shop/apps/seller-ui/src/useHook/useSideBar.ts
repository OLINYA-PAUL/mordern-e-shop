import { useAtom } from 'jotai';
import { activeSideBarItem } from '../configs/constants/constants';
const UseSidebar = () => {
  const [activeSidebar, setActiveSidebar] = useAtom(activeSideBarItem);

  return { activeSidebar, setActiveSidebar };
};

export default UseSidebar;
