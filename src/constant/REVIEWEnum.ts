/**
 * 图片类型定义
 */
const REVIEW_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const REVIEW_ENUM_MAP: Record<number, string> = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

export const REVIEW_ENUM_OPTIONS = Object.keys(REVIEW_ENUM_MAP).map(key => {
  const numKey = Number(key);
  return {
    label: REVIEW_ENUM_MAP[numKey],
    value: numKey,
  }
})

export default REVIEW_ENUM