/**
 * @description 절대 위치 및 윈도우 크기로 상대 위치 계산
 *
 * @param absoluteXPosition
 * @param absoluteYPosition
 * @param innerWidth
 * @param innerHeight
 * @returns xRatio and yRatio
 */
export const computeRelativePosition = (
  absoluteXPosition: number,
  absoluteYPosition: number,
  innerWidth: number,
  innerHeight: number,
) => {
  return {
    xRatio: absoluteXPosition / innerWidth,
    yRatio: absoluteYPosition / innerHeight,
  }
}
