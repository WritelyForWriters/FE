import { PropsWithChildren } from "react";

import styles from "./TabList.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function TabList({ children }: PropsWithChildren) {
  return <div className={cx("list")}>{children}</div>;
}
