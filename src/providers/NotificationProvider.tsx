"use client";

import { FC, useEffect, useState, createContext, useRef } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import io from "socket.io-client";

import { NotificationProviderProps, NotificationT } from "@/types/Notification";

import { useAlertContext } from "@/contexts/AlertContext";

const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
const SOCKET_SERVER_URL = baseUrl ? `${baseUrl}` : "http://localhost:3000";

const NotificationContext = createContext<NotificationT>({
  message: "",
  user: "",
});

const NotificationProvider: FC<NotificationProviderProps> = (props) => {
  const { children } = props;

  const { showAlert } = useAlertContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const [notifications, setNotifications] = useState<NotificationT>({
    message: "",
    user: "",
  });

  const page = parseInt(searchParams.get("page") || "1");
  const pageRef = useRef(page);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      //   auth: {
      //     token: localStorage.getItem("token"),
      //   },
    });

    socket.on("newPost", (data: NotificationT) => {
      setNotifications(data);

      if (pageRef.current === 1) {
        router.refresh();
      }

      showAlert(`${data.user} created a new post: ${data.message}`, "info");
    });

    return () => {
      socket.disconnect();
    };
  }, [router, showAlert]);

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

