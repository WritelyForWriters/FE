import { ReactNode } from "react";
import { useTabContext } from "../TabContext";

import styles from "./TabPanel.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface TabPanelProps {
  value: string;
  children: ReactNode;
}

export default function TabPanel({ value, children }: TabPanelProps) {
  const { activeTab } = useTabContext();

  return  activeTab === value ? (
    <div className={cx("panel")} role="tabpanel">
      {children}
    </div>
  ) : null;
}
