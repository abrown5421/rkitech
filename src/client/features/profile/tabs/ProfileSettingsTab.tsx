import React from "react";
import Container from "../../../../shared/components/container/Container";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Text from "../../../../shared/components/text/Text";
import Button from "../../../../shared/components/button/Button";
import Loader from "../../../../shared/components/loader/Loader";
import { setLoading } from "../../../../app/globalSlices/loading/loadingSlice";
import { openModal } from "../../../../shared/features/modal/modalSlice";

const ProfileSettingsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const isAccountDisabling = loading && id === "profileDisable";
  const isAccountDeleting = loading && id === "profileDelete";

  const handleAccountDelete = () => {
    dispatch(setLoading({ loading: true, id: "profileDelete" }));
    dispatch(openModal({
        title: "",
        modalType: "deleteAccount",
    }));
  };
  
  const handleAccountDisable = async () => {
    dispatch(setLoading({ loading: true, id: "profileDisable" }));
    dispatch(openModal({
        title: "",
        modalType: "disableAccount",
    }));
  }

  return (
    <Container TwClassName="flex-col gap-5 mt-5 justify-end border-1 border-error bg-error-faded ring-error rounded-xl pt-4 pr-2 pb-4 pl-2">
        <Container TwClassName="flex-row">
            <Container TwClassName="flex-col flex-8">
                <Text text='Disable Account:' TwClassName="font-bold text-error text-md" />
                <Text text='This will prevent anyone from being able to utilize your account however, all of your account data and information will persist and your account can be reactivated by support.' />
            </Container>
            <Container TwClassName="flex-col flex-2 items-center justify-center">
                <Button
                    TwClassName="p-2 bg-error rounded-xl text-white border-1 min-w-[150px] border-error hover:bg-transparent hover:text-error"
                    onClick={handleAccountDisable}
                    disabled={isAccountDisabling}
                >
                    {isAccountDisabling ? <Loader variant="spinner" color="bg-primary" /> : "Disable Account"}
                </Button>
            </Container>
        </Container>
        <hr style={{ border: "none", borderTop: "1px solid rgba(0, 0, 0, 0.1)"}} />
        <Container TwClassName="flex-row">
            <Container TwClassName="flex-col flex-8">
                <Text text='Delete Account:' TwClassName="font-bold text-error text-md" />
                <Text text='A complete wipe of your account and all of its associated data. This cannot be undone!' />
            </Container>
            <Container TwClassName="flex-col flex-2 items-center justify-center">
                <Button
                    TwClassName="p-2 bg-error rounded-xl text-white border-1 min-w-[150px] border-error hover:bg-transparent hover:text-error"
                    onClick={handleAccountDelete}
                    disabled={isAccountDeleting}
                >
                    {isAccountDeleting ? <Loader variant="spinner" color="bg-primary" /> : "Delete Account"}
                </Button>
            </Container>
        </Container>
    </Container>
  );
};

export default ProfileSettingsTab;