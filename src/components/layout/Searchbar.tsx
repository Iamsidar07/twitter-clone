"use client";
import React, { ChangeEvent, useCallback, useState } from "react";
import { Loader, Search } from "lucide-react";
import useSearchTwitter from "@/hooks/useSearchTwitter";
import FollowbarItem from "./FollowbarItem";

const Searchbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useSearchTwitter(searchValue);

  const debounce = function (fn: any, delay: any) {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
      console.log({ timer });
    };
  };

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const hello = debounce(() => console.log("hi", searchValue), 300);
    hello();
  }, []);
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-x-3 py-2.5 rounded-full border dark:border-dark bg-white dark:bg-dark2">
        <Search className="w-5 h-5 ml-3 text-gray-400" />
        <input
          value={searchValue}
          onChange={handleChange}
          placeholder="Search Twitter"
          className="outline-none bg-transparent"
        />
      </div>
      <div>
        {users?.length > 0 && searchValue ? (
          <div>
            <h2 className="font-bold text-lg">
              Search &ldquo; {searchValue} &rdquo;
            </h2>
            <div className="bg-gray-100 dark:bg-dark rounded-lg py-2 my-6 border">
              {users?.map((user) => (
                <FollowbarItem
                  userId={user.id}
                  key={user.id}
                  name={user.name}
                  profileImage={user.profileImage!}
                  username={user.username}
                />
              ))}
            </div>
          </div>
        ) : isLoading ? (
          <Loader className="w-5 h-5 animate-spin mx-auto" />
        ) : null}
      </div>
    </div>
  );
};

export default Searchbar;
