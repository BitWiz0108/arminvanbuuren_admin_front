import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  RELEASEDATETIME_FORMAT,
  UPLOAD_TYPE,
} from "@/libs/constants";

import { IPlayList } from "@/interfaces/IPlayList";

const usePlayList = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllPlayList = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/playlist`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const playLists = data as Array<IPlayList>;
      return playLists;
    }

    setIsLoading(false);
    return [];
  };
  const createPlayList = async (title: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/playlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: title, userId: user.id }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };
  const deletePlayList = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/playlist?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const deleteMusicFromPlayList = async (
    playlistId: number | null,
    musicId: number | null
  ) => {
    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/playlist/item?id=${playlistId}&musicId=${musicId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };
  return {
    isLoading,
    createPlayList,
    fetchAllPlayList,
    deletePlayList,
    deleteMusicFromPlayList,
  };
};

export default usePlayList;
