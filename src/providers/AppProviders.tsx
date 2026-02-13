"use client";

import { FC, ReactNode } from "react";
import { Provider } from "react-redux";

import { useRequest } from "ahooks";

import NotificationProvider from "@/providers/NotificationProvider";
import { AlertProvider } from "@/contexts/AlertContext";
import store, { useAppDispatch } from "@/stores/store";
import { setUser } from "@/stores/slices/userSlice";
import { getUser } from "@/features/auth/services/userActions";

type Props = {
  children: ReactNode;
};

const BootstrapUser = () => {
  const dispatch = useAppDispatch();

  useRequest(getUser, {
    onSuccess: (user) => {
      if (user) dispatch(setUser({ id: user.id, username: user.username }));
    },
    onError: () => {},
  });

  return null;
};

const AppProviders: FC<Props> = (props) => {
  const { children } = props;

  return (
    <Provider store={store}>
      <AlertProvider>
        <NotificationProvider>
          <BootstrapUser />
          {children}
        </NotificationProvider>
      </AlertProvider>
    </Provider>
  );
};

export default AppProviders;

