import { useState } from "react";

import Row from "@/app/components/Row/Row";
import { CheckIcon, MoreIcon } from "@/app/components/Icons";
import Text from "@/app/components/Text/Text";
import IconButton from "@/app/components/Buttons/IconButton/IconButton";

import classNames from "classnames/bind";
import styles from "./MemoCard.module.scss";

const cx = classNames.bind(styles);

function MemoCard() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={cx("card")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cx("header")}>
        <Text fontSize="14px" fontWeight={700} color="#000">
          제목
        </Text>
        {isHovered && (
          <Row gap={4}>
            <IconButton>
              <CheckIcon />
            </IconButton>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Row>
        )}
      </div>
      <Text fontSize="14px" fontWeight={400} color="#000">
        메모 본문입니다.
      </Text>
      <Text fontSize="12px" fontWeight={400} color="#878787">
        2024.01.11
      </Text>
    </div>
  );
}

export default MemoCard;
