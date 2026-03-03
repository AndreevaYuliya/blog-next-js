import type { FC, ReactNode } from "react";
import NotificationProvider from "@/providers/NotificationProvider";

type Props = { children: ReactNode };

const ExhibitsLayout: FC<Props> = (props) => {
  const { children } = props;

  return <NotificationProvider>{children}</NotificationProvider>;
};

export default ExhibitsLayout;
