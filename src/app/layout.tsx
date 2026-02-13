import { FC, ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import AppProviders from "@/providers/AppProviders";

import "./globals.css";

type Props = {
  children: ReactNode;
};

const RootLayout: FC<Props> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <AppProviders>{children}</AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;

