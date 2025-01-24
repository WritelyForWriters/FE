import MemoCard from "../MemoCard/MemoCard";

import classNames from "classnames/bind";
import styles from "./MemoList.module.scss";

const cx = classNames.bind(styles);

interface Props {
  status: "all" | "ing";
}

export default function MemoList({ status }: Props) {
  return (
    <ul className={cx("list")}>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
    </ul>
  );
}
