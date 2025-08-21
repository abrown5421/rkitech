import React, { useEffect } from "react";
import Container from "../../../../shared/components/container/Container";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Text from "../../../../shared/components/text/Text";
import Button from "../../../../shared/components/button/Button";
import Loader from "../../../../shared/components/loader/Loader";
import { openModal, preCloseModal } from "../../../../shared/features/modal/modalSlice";
import { openAlert } from "../../../../shared/features/alert/alertSlice";
import { updateDataInCollection } from "../../../../services/database/updateData";
import Cookies from "js-cookie";
import { clearClientAuthUser } from "../../auth/clientAuthUserSlice";
import { useNavigationHook } from "../../../../hooks/useNavigationHook";
import { deleteAuthenticatedAccount } from "../../../../services/auth/updateAuthProfile";
import { setLoading } from "../../../../app/globalSlices/loading/loadingSlice";

const ProfileSettingsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const { loading, id } = useAppSelector((state) => state.loading);
  const homePageId = useAppSelector((state) => state.homePageId);
  const modalAction = useAppSelector((state) => state.modal.modalActionFire);
  const authUser = useAppSelector((state) => state.authUser.user);

  const isAccountDisabling = loading && id === "profileDisable";
  const isAccountDeleting = loading && id === "profileDelete";

  const showAlert = (message: string, severity: "success" | "error") => {
    dispatch(openAlert({
      alertOpen: true,
      alertSeverity: severity,
      alertMessage: message,
      alertAnimation: {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: true,
      },
    }));
  };

  const handleAction = async (
    action: "disable" | "delete", 
    password?: string
  ) => {
    if (!authUser) return;

    try {
      if (action === "disable") {
        await updateDataInCollection('Users', authUser.userId, { userRole: 'Disabled' });
        showAlert('Account disabled successfully!', 'success');
      } else {
        await deleteAuthenticatedAccount(password || '', authUser.userId);
        showAlert('Account deleted successfully!', 'success');
      }
      clientNavigation(homePageId.homePageObj?.pagePath ?? '', 'Home', homePageId.id)();
      Cookies.remove('authUser');
      dispatch(clearClientAuthUser());
    } catch (error) {
      showAlert(`There was a problem ${action === "disable" ? "disabling" : "deleting"} your account.`, 'error');
    } finally {
      dispatch(preCloseModal());
    }
  };

  useEffect(() => {
    if (!modalAction.modalActionFire) return;

    switch (modalAction.modalActionId) {
      case 'deleteUser':
        handleAction('delete', modalAction.password);
        break;
      case 'disableUser':
        handleAction('disable');
        break;
    }
  }, [modalAction]);

  const openConfirmationModal = (title: string, message: string, actionId: string) => {
    dispatch(openModal({
      title,
      modalType: "confirmOrDeny",
      modalMessage: message,
      modalProps: { actionId, requiresAuth: actionId === "deleteUser" }
    }));
  };

  const handleAccountDelete = () => {
    dispatch(setLoading({ loading: true, id: "profileDelete" }));
    openConfirmationModal(
      "Delete Your Account?",
      "Are you sure you want to delete your account? This cannot be undone and all of your data will be lost.",
      "deleteUser"
    );
  };

  const handleAccountDisable = () => {
    dispatch(setLoading({ loading: true, id: "profileDisable" }));
    openConfirmationModal(
      "Disable Your Account?",
      "Are you sure you want to disable your account? This can be undone.",
      "disableUser"
    );
  };

  return (
    <Container TwClassName="flex-col gap-5 mt-5 justify-end border-1 border-error bg-error-faded ring-error rounded-xl pt-4 pr-2 pb-4 pl-2">
      {[
        {
          title: 'Disable Account:',
          description: 'This will prevent anyone from being able to utilize your account however, all of your account data and information will persist and your account can be reactivated by support.',
          buttonText: 'Disable Account',
          handler: handleAccountDisable,
          loading: isAccountDisabling
        },
        {
          title: 'Delete Account:',
          description: 'A complete wipe of your account and all of its associated data. This cannot be undone!',
          buttonText: 'Delete Account',
          handler: handleAccountDelete,
          loading: isAccountDeleting
        }
      ].map((section, idx) => (
        <React.Fragment key={section.title}>
          <Container TwClassName="flex-row">
            <Container TwClassName="flex-col flex-8">
              <Text text={section.title} TwClassName="font-bold text-error text-md" />
              <Text text={section.description} />
            </Container>
            <Container TwClassName="flex-col flex-2 items-center justify-center">
              <Button
                TwClassName="p-2 bg-error rounded-xl text-gray-50 border-1 min-w-[150px] border-error hover:bg-transparent hover:text-error"
                onClick={section.handler}
                disabled={section.loading}
              >
                {section.loading ? <Loader variant="spinner" color="bg-gray-50" /> : section.buttonText}
              </Button>
            </Container>
          </Container>
          {idx === 0 && <hr style={{ border: "none", borderTop: "1px solid rgba(0, 0, 0, 0.1)"}} />}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default ProfileSettingsTab;
