import { PropsWithChildren } from "react";

import classNames from "classnames/bind";
import styles from "./PanelContainer.module.scss";

const cx = classNames.bind(styles);

export default function PanelContainer({ children }: PropsWithChildren) {
  return <div className={cx("container")}>{children}</div>;
}

