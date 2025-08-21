import React from "react";
import Container from "../../../../shared/components/container/Container";
import Text from "../../../../shared/components/text/Text";
import Icon from "../../../../shared/components/icon/Icon";
import type { ProfileTab } from "../../../../shared/features/tabs/tabTypes";

export const TheirProfileAboutTab: React.FC<ProfileTab> = ({
  profileUser,
}) => {

  const fullAddress = profileUser.addressLn1 &&
    profileUser.addressCity &&
    profileUser.addressState &&
    profileUser.addressPostCode
    ? `${profileUser.addressLn1} ${profileUser.addressCity}, ${profileUser.addressState} ${profileUser.addressPostCode}`
    : "No address available";

  return (
      <Container TwClassName="flex-row">
        <Container TwClassName="flex-col flex-9 gap-5 w-full">
          <Text TwClassName="text-gray-900 text-xl font-bold" text="Contact Info" />
          <Container TwClassName="flex-row gap-3 items-start">
            <Container TwClassName="w-6 flex justify-center">
              <Icon color="text-gray-900" name="Mail" />
            </Container>
            <Text TwClassName="text-gray-900 text-md text-left" text={profileUser.email} />
          </Container>
          <Container TwClassName="flex-row gap-3 items-start">
            <Container TwClassName="w-6 flex justify-center">
              <Icon color="text-gray-900" name="Phone" />
            </Container>
            <Text
              TwClassName="text-gray-900 text-md text-left"
              text={profileUser.phone || "No phone available"}
            />
          </Container>
          <Container TwClassName="flex-row gap-3 items-start">
            <Container TwClassName="w-6 flex justify-center">
              <Icon color="text-gray-900" name="House" />
            </Container>
            <Text TwClassName="text-gray-900 text-md text-left" text={fullAddress} />
          </Container>
        </Container>
      </Container>
  );
};