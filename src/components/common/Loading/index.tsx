import { FC } from "react";

import styles from "./styles.module.css";

type Props = {
  label?: string;
};

const Loading: FC<Props> = (props) => {
  const { label = "Loading..." } = props;

  return (
    <div className={styles.loading} aria-busy="true" aria-live="polite">
      {label}
    </div>
  );
};

export default Loading;

