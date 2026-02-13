import { FC, ReactNode } from "react";

import styles from "./styles.module.css";

type Props = {
  children: ReactNode;
};

const PageContainer: FC<Props> = (props) => {
  const { children } = props;

  return <div className={styles.pageContainer}>{children}</div>;
};

export default PageContainer;

