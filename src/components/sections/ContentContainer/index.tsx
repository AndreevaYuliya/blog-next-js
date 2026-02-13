import { FC, ReactNode } from "react";

import styles from "./styles.module.css";

type Props = {
  children: ReactNode;
};

const ContentContainer: FC<Props> = (props) => {
  const { children } = props;

  return <div className={styles.contentContainer}>{children}</div>;
};

export default ContentContainer;

