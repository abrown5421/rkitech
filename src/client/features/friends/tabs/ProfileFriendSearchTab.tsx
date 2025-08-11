import React, { useEffect, useState } from "react";
import Container from "../../../../shared/components/container/Container";
import Input from "../../../../shared/components/input/Input";
import Icon from "../../../../shared/components/icon/Icon";
import type { ClientAuthUser } from '../../auth/ClientAuthUserTypes';
import { searchUsers } from "../../../../services/database/readData";
import Image from "../../../../shared/components/image/Image";
import Text from "../../../../shared/components/text/Text";
import { useNavigationHook } from "../../../../hooks/useNavigationHook";

const ProfileFriendSearchTab: React.FC = () => {
  const clientNavigation = useNavigationHook();
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<ClientAuthUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Container TwClassName="flex-col space-y-4">
      <Input
        label="Search friends"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        endAdornment={
          <Icon color="text-gray-900"
            name="Search"
            TwClassName="text-gray-500 hover:text-gray-700"
            onClick={() => searchUsers(searchValue).then(setResults)}
          />
        }
      />

      {isSearching && <p className="text-gray-400">Searching...</p>}

      <Container TwClassName="flex flex-col space-y-2 cursor-pointer">
        {results.map((user) => (
          <Container
            key={user.userId}
            TwClassName="flex-row items-start gap-3 border-b border-gray-300 m-0 pt-2 pb-2 hover:bg-gray-100"
            onClick={() => clientNavigation(`/profile/${user.userId}`, 'Profile', '')()}
          >
            <Container TwClassName="flex-col justify-center">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  TwClassName="-ml-1.5 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
                />
              ) : (
                <Container
                  TwClassName="-ml-1.5 rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center border-3 border-white"
                >
                  <Text
                    TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                    text={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()}
                  />
                </Container>
              )}
            </Container>
            <Container TwClassName="flex-col justify-center">
              <Text
                text={`${capitalize(user.firstName)} ${capitalize(user.lastName)}`}
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
    </Container>
  );
};

export default ProfileFriendSearchTab;





