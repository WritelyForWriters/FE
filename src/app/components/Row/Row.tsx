import { PropsWithChildren } from "react";

import styles from "./Row.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  spaceBetween?: boolean;
}

export default function Row({
  children,
  spaceBetween,
}: PropsWithChildren<Props>) {
  return (
    <div className={cx("row", { "space-between": spaceBetween })}>
      {children}
    </div>
  );
}
