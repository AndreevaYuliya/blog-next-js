"use client";

import { FC, useEffect, useRef } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import io from "socket.io-client";

import { NotificationProviderProps, NotificationT } from "@/types/Notification";

import { useAlertContext } from "@/contexts/AlertContext";
import { useAppSelector } from "@/stores/store";

const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
const SOCKET_SERVER_URL = baseUrl ? `${baseUrl}` : "http://localhost:3000";

const NotificationProvider: FC<NotificationProviderProps> = (props) => {
  const { children } = props;

  const { showAlert } = useAlertContext();

  const isAuthenticated = Boolean(useAppSelector((s) => s.user.user));

  const router = useRouter();

  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageRef = useRef(page);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socket.on("newPost", (data: NotificationT) => {
      if (pageRef.current === 1) {
        router.refresh();
      }

      showAlert(`${data.user} created a new post: ${data.message}`, "info");
    });

    return () => {
      socket.disconnect();
    };
  }, [router, showAlert, isAuthenticated]);

  return <>{children}</>;
};

export default NotificationProvider;
