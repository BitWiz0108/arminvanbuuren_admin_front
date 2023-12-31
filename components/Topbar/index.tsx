import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import ShieldLock from "@/components/Icons/ShieldLock";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import Logout from "@/components/Icons/Logout";

import { useAuthValues } from "@/contexts/contextAuth";

import useOutsideClick from "@/hooks/useOutsideClick";

import { DEFAULT_AVATAR_IMAGE, IMAGE_SM_BLUR_DATA_URL } from "@/libs/constants";

type Props = {
  visible: boolean;
  setVisible: Function;
};

const Topbar = ({ visible, setVisible }: Props) => {
  const menuRef = useRef(null);
  const router = useRouter();
  const { isSignedIn, user, signOut } = useAuthValues();

  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState<boolean>(false);

  useOutsideClick(menuRef, () => {
    setIsMenuVisible(false);
  });

  useEffect(() => {
    if (isSignedIn) {
      setVisible(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return visible && isSignedIn ? (
    <div
      className={twMerge(
        "fixed top-2 right-1 flex-col justify-center items-center z-30 rounded-t-md transition-all duration-300",
        isMenuVisible
          ? "rounded-t-md border-t border-l border-r border-transparent"
          : "border border-transparent rounded-md"
      )}
      ref={menuRef}
    >
      <div
        className={twMerge(
          "p-2 flex justify-center items-center space-x-2 bg-third cursor-pointer",
          isMenuVisible
            ? "rounded-t-md border-t border-l border-r border-gray-700"
            : "border border-gray-700 rounded-md"
        )}
        onClick={() => setIsMenuVisible(!isMenuVisible)}
      >
        <Image
          className="w-7 h-7 rounded-md overflow-hidden object-cover"
          src={user.avatarImage ?? DEFAULT_AVATAR_IMAGE}
          width={60}
          height={60}
          alt=""
          placeholder="blur"
          blurDataURL={IMAGE_SM_BLUR_DATA_URL}
        />
        <span className="hidden md:inline-flex w-28 text-white text-left text-base font-medium select-none truncate">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : `${user.username ? user.username : "anonymous"}`}
        </span>
        {isMenuVisible ? <ArrowUp /> : <ArrowDown />}
      </div>

      <AnimatePresence>
        {isMenuVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full flex flex-col md:flex-row justify-start items-center bg-third rounded-b-md border-b border-l border-r border-gray-700 overflow-hidden"
          >
            <div
              className="w-full p-2 flex justify-center md:justify-start items-center space-x-0 md:space-x-2 text-primary text-sm hover:bg-blueSecondary transition-all duration-300 cursor-pointer select-none"
              onClick={() => setIsChangePasswordModalVisible(true)}
            >
              <div className="hidden md:flex">
                <ShieldLock width={16} height={16} />
              </div>
              <span>Password</span>
            </div>
            <div
              className="w-full p-2 flex justify-center md:justify-start items-center space-x-0 md:space-x-2 text-primary text-sm hover:bg-blueSecondary transition-all duration-300 cursor-pointer select-none"
              onClick={() => {
                signOut();
                router.push("/");
                setIsMenuVisible(false);
              }}
            >
              <div className="hidden md:flex">
                <Logout />
              </div>
              <span>Logout</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isChangePasswordModalVisible && (
        <ChangePasswordModal
          visible={isChangePasswordModalVisible}
          setVisible={setIsChangePasswordModalVisible}
        />
      )}
    </div>
  ) : null;
};

export default Topbar;
