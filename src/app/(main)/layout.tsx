import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const MainLayout: FC<Props> = (props) => {
  const { children } = props;

  return <>{children}</>;
};

export default MainLayout;

