/**
 * Tiện ích xử lý văn bản và tìm kiếm thông minh tiếng Việt (D-04, NFR-08)
 */

/**
 * Loại bỏ dấu tiếng Việt chuẩn Unicode NFD và các ký tự đ/Đ
 * @example
 * removeVietnameseTones("Cửa sổ trượt") => "Cua so truot"
 * removeVietnameseTones("Độ phức tạp") => "Do phuc tap"
 * removeVietnameseTones("Mảng hai con trỏ") => "Mang hai con tro"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

/**
 * So khớp chuỗi target với query tìm kiếm, tự động hỗ trợ cả có dấu lẫn không dấu.
 * Phản hồi tức thì và an toàn với chuỗi rỗng / undefined.
 */
export function matchesSearch(target: string | undefined | null, query: string): boolean {
  if (!target || !query) return false
  const targetLower = target.toLowerCase()
  const queryLower = query.toLowerCase()

  // 1. So khớp trực tiếp (chuẩn xác khi người dùng gõ có dấu)
  if (targetLower.includes(queryLower)) return true

  // 2. So khớp không dấu (khi người dùng gõ không dấu hoặc khác bảng mã gõ)
  const targetClean = removeVietnameseTones(targetLower)
  const queryClean = removeVietnameseTones(queryLower)

  return targetClean.includes(queryClean)
}

/**
 * Kiểm tra xem trong danh sách các chuỗi (keywords, example phrases) có phần tử nào khớp không.
 */
export function matchesAny(targets: string[] | undefined | null, query: string): boolean {
  if (!targets || targets.length === 0 || !query) return false
  return targets.some((t) => matchesSearch(t, query))
}
