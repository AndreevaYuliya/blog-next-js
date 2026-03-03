"use client";

import { FC, ReactNode, useState } from "react";
import { Provider } from "react-redux";

import { AlertProvider } from "@/contexts/AlertContext";
import { AppStore, makeStore } from "@/stores/store";

import { User } from "@/types/User";

type Props = {
  children: ReactNode;
  initialUser: User | null;
};

const AppProviders: FC<Props> = (props) => {
  const { children, initialUser } = props;

  const [store] = useState<AppStore>(() =>
    makeStore({
      user: {
        user: initialUser,
        error: null,
      },
    }),
  );

  return (
    <Provider store={store}>
      <AlertProvider>{children}</AlertProvider>
    </Provider>
  );
};

export default AppProviders;
