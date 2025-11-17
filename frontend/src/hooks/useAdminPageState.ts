import { useLocation } from "react-router-dom";
import { useNavigation } from "./useNavigate";
import { useAppSelector } from "../store/hooks";
import type { IPage } from "../features/page/pageTypes";

export const useAdminPageState = () => {
  const location = useLocation();
  const navigate = useNavigation();
  const activePage = useAppSelector((state) => state.activePage);

  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get('id');
  const action = searchParams.get('action');

  const isCreating = action === 'new';
  const isEditing = !!(itemId && !isCreating);
  const isListView = !isCreating && !isEditing;

  const navigateToPath = (path: string) => {
    if (!activePage.activePageObj) return;
    navigate({
      ...activePage.activePageObj,
      pagePath: path,
    } as IPage, true);
  };

  const navigateToEdit = (id: string) => {
    navigateToPath(`${activePage.activePageObj?.pagePath}?id=${id}`);
  };

  const navigateToCreate = () => {
    navigateToPath(`${activePage.activePageObj?.pagePath}?action=new`);
  };

  const navigateToList = () => {
    navigateToPath(`${activePage.activePageObj?.pagePath}`);
  };

  const navigateToPage = (page: IPage) => {
    navigate(page);
  };

  return {
    itemId,
    action,
    isCreating,
    isEditing,
    isListView,
    navigateToPath,
    navigateToEdit,
    navigateToCreate,
    navigateToList,
    navigateToPage,
    activePage,
  };
};