import Row from "@/app/components/Row/Row";
import { CheckIcon, MoreIcon } from "@/app/components/Icons";
import Text from "@/app/components/Text/Text";
import IconButton from "@/app/components/Buttons/IconButton/IconButton";

import classNames from "classnames/bind";
import styles from "./MemoCard.module.scss";

const cx = classNames.bind(styles);

function MemoCard() {
  return (
    <div className={cx("card")}>
      <Row spaceBetween>
        <Text fontSize="14px" fontWeight={700} color="#000">
          제목
        </Text>
        <Row gap={4}>
          <IconButton>
            <CheckIcon />
          </IconButton>
          <IconButton>
            <MoreIcon />
          </IconButton>
        </Row>
      </Row>
      <Text fontSize="14px" fontWeight={400} color="#000">
        메모 본문입니다.
      </Text>
      <Text fontSize="14px" fontWeight={400} color="#000">
        2024.01.11
      </Text>
    </div>
  );
}

export default MemoCard;
