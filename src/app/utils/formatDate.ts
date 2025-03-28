/**
 * 날짜 데이터를 특정 형식으로 변환하는 함수
 * @param dateString
 * @returns yyyy.mm.dd 날짜 형식
 */

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}.${month}.${day}`
}
