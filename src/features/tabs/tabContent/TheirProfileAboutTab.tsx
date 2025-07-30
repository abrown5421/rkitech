import React from "react";
import Container from "../../../shared/components/container/Container";
import Text from "../../../shared/components/text/Text";
import Image from "../../../shared/components/image/Image";
import Icon from "../../../shared/components/icon/Icon";
import { format } from "date-fns";
import type { ProfileTab } from "../tabTypes";

export const TheirProfileAboutTab: React.FC<ProfileTab> = ({
  profileUser,
}) => {
  const fullName = `${profileUser.firstName?.charAt(0).toUpperCase() || ""}${
    profileUser.firstName?.slice(1) || ""
  } ${profileUser.lastName?.charAt(0).toUpperCase() || ""}${
    profileUser.lastName?.slice(1) || ""
  }`;

  const initials = `${profileUser.firstName?.[0] || ""}${
    profileUser.lastName?.[0] || ""
  }`.toUpperCase();

  const fullAddress = profileUser.addressLn1 &&
    profileUser.addressCity &&
    profileUser.addressState &&
    profileUser.addressPostCode
    ? `${profileUser.addressLn1} ${profileUser.addressCity}, ${profileUser.addressState} ${profileUser.addressPostCode}`
    : "No address available";

  return (
    <>
      <Container TwClassName="flex-col md:flex-row">
        <Container TwClassName="flex-col flex-2 items-center md:items-start">
          {profileUser?.profileImage ? (
            <Image
              src={profileUser.profileImage}
              alt="User Avatar"
              width={100}
              height={100}
              TwClassName="rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <Container TwClassName="w-[100px] h-[100px] rounded-full bg-black cursor-pointer flex justify-center items-center border-4 border-white shadow-lg">
              <Text
                TwClassName="text-white font-primary text-4xl w-full flex justify-center items-center"
                text={initials}
              />
            </Container>
          )}
        </Container>
        <Container TwClassName="flex-col flex-9 justify-center items-center md:items-start">
          <Text TwClassName="text-black text-xl font-bold" text={fullName} />
          {profileUser.bio && (
            <Text TwClassName="text-black text-md" text={profileUser.bio} />
          )}
          <Text
            text={`Member since: ${format(profileUser.createdAt, "EEEE, MMMM do, yyyy")}`}
            TwClassName="text-xs text-gray-500"
          />
        </Container>
      </Container>

      <Container TwClassName="flex-row mt-5">
        <Container TwClassName="hidden md:block flex-2 gap-5 w-full">
          <Container TwClassName="w-[100px] h-[100px] rounded-full bg-black cursor-pointer flex justify-center items-center border-4 border-white shadow-lg invisible">
            <span></span>
          </Container>
        </Container>
        <Container TwClassName="flex-col flex-9 gap-5 w-full items-center md:items-start">
          <Text TwClassName="text-black text-xl font-bold" text="Contact Info" />
          <Container TwClassName="flex-row gap-3 items-start">
            <Container TwClassName="w-6 flex justify-center">
              <Icon name="Mail" />
            </Container>
            <Text TwClassName="text-black text-md text-left" text={profileUser.email} />
          </Container>
          <Container TwClassName="flex-row gap-3 items-start">
            <Container TwClassName="w-6 flex justify-center">
              <Icon name="Phone" />
            </Container>
            <Text
              TwClassName="text-black text-md text-left"
              text={profileUser.phone || "No phone available"}
            />
          </Container>
          <Container TwClassName="flex-row gap-3 items-start">
            <Container TwClassName="w-6 flex justify-center">
              <Icon name="House" />
            </Container>
            <Text TwClassName="text-black text-md text-left" text={fullAddress} />
          </Container>
        </Container>
      </Container>
    </>
  );
};