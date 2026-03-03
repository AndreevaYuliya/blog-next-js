import { FC, ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import AppProviders from "@/providers/AppProviders";

import "./globals.css";

import ControlBar from "@/components/sections/ControlBar";
import { getCurrentUser } from "@/lib/server/auth";
import PageContainer from "@/components/sections/PageContainer";

type Props = {
  children: ReactNode;
};

const RootLayout: FC<Props> = async (props) => {
  const { children } = props;

  const initialUser = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <AppProviders initialUser={initialUser}>
            <ControlBar />

            <PageContainer>{children}</PageContainer>
          </AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
