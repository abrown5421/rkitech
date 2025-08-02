import React, { useEffect, useState } from "react";
import Container from "../../../shared/components/container/Container";
import Input from "../../../shared/components/input/Input";
import Icon from "../../../shared/components/icon/Icon";
import { useAppSelector } from "../../../app/hooks";
import { useParams } from "react-router-dom";
import type { AuthUser } from "../../auth/authUserTypes";
import { searchUsers } from "../../../services/database/readData";
import Image from "../../../shared/components/image/Image";
import Text from "../../../shared/components/text/Text";

const ProfileFriendTab: React.FC = () => {
  const authUser = useAppSelector((state) => state.authUser.user);
  const { userIdFromUrl } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [ownedProfile, setOwnedProfile] = useState(true);
  const [results, setResults] = useState<AuthUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setOwnedProfile(authUser?.userId === userIdFromUrl);
  }, [userIdFromUrl, authUser?.userId]);

  // Debounced live search
  useEffect(() => {
    if (!searchValue.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const foundUsers = await searchUsers(searchValue);
      setResults(foundUsers);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <Container TwClassName="flex-col space-y-4">
      {ownedProfile && (
        <>
          <Input
            label="Search friends"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            endAdornment={
              <Icon
                name="Search"
                cursor="pointer"
                TwClassName="text-gray-500 hover:text-gray-700"
                onClick={() => searchUsers(searchValue).then(setResults)}
              />
            }
          />

          {isSearching && <p className="text-gray-400">Searching...</p>}

          <Container TwClassName="flex flex-col space-y-2">
            {results.map((user) => (
              <Container
                key={user.userId}
                TwClassName="flex items-center gap-3 border-b pb-2"
              >
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="User Avatar"
                    width={28}
                    height={28}
                    TwClassName="-ml-1.5 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
                  />
                ) : (
                  <Container
                    TwClassName="-ml-1.5 rounded-full w-7 h-7 bg-black cursor-pointer flex justify-center items-center border-3 border-white"
                  >
                    <Text
                      TwClassName="text-white w-full text-xs font-semibold leading-[2.5rem] text-center"
                      text={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()}
                    />
                  </Container>
                )}

                <Container>
                  <Text
                    text={`${user.firstName} ${user.lastName}`}
                    TwClassName="font-semibold"
                  />
                  <Text
                    TwClassName="text-sm text-gray-500"
                    text={user.email}
                  />
                </Container>
              </Container>
            ))}
          </Container>
        </>
      )}
    </Container>
  );
};

export default ProfileFriendTab;





