import { describe, it, expect } from 'vitest'
import { removeVietnameseTones, matchesSearch, matchesAny } from './textUtils'

describe('textUtils & Vietnamese Smart Search (D-04, NFR-08)', () => {
  describe('removeVietnameseTones', () => {
    it('loại bỏ dấu chuẩn xác cho các nguyên âm tiếng Việt', () => {
      expect(removeVietnameseTones('Cửa sổ trượt')).toBe('Cua so truot')
      expect(removeVietnameseTones('Hai con trỏ')).toBe('Hai con tro')
      expect(removeVietnameseTones('Ngăn xếp đơn điệu')).toBe('Ngan xep don dieu')
      expect(removeVietnameseTones('Tìm kiếm nhị phân')).toBe('Tim kiem nhi phan')
      expect(removeVietnameseTones('Mảng & Bảng băm')).toBe('Mang & Bang bam')
    })

    it('loại bỏ ký tự đ và Đ thành d và D', () => {
      expect(removeVietnameseTones('Độ phức tạp thuật toán')).toBe('Do phuc tap thuat toan')
      expect(removeVietnameseTones('đoạn con liên tiếp')).toBe('doan con lien tiep')
    })

    it('xử lý chuỗi rỗng an toàn', () => {
      expect(removeVietnameseTones('')).toBe('')
    })
  })

  describe('matchesSearch', () => {
    it('khớp khi người dùng gõ tiếng Việt có dấu chuẩn', () => {
      expect(matchesSearch('Hai con trỏ đối xứng', 'con trỏ')).toBe(true)
      expect(matchesSearch('Cửa sổ trượt kích thước cố định', 'cửa sổ')).toBe(true)
    })

    it('khớp khi người dùng gõ tiếng Việt KHÔNG dấu', () => {
      expect(matchesSearch('Hai con trỏ đối xứng', 'hai con tro')).toBe(true)
      expect(matchesSearch('Cửa sổ trượt kích thước cố định', 'cua so truot')).toBe(true)
      expect(matchesSearch('Độ phức tạp thời gian', 'do phuc tap')).toBe(true)
      expect(matchesSearch('Mảng đã sắp xếp', 'sap xep')).toBe(true)
    })

    it('khớp khi target là tiếng Anh và query là tiếng Anh không phân biệt hoa thường', () => {
      expect(matchesSearch('Two Pointers Opposite Ends', 'two pointers')).toBe(true)
      expect(matchesSearch('Valid Palindrome', 'valid')).toBe(true)
      expect(matchesSearch('Sliding Window', 'window')).toBe(true)
    })

    it('trả về false khi không có sự trùng khớp', () => {
      expect(matchesSearch('Two Pointers', 'binary search')).toBe(false)
      expect(matchesSearch('Ngăn xếp', 'do thi')).toBe(false)
    })
  })

  describe('matchesAny', () => {
    it('khớp nếu bất kỳ từ khóa nào trong danh sách keywords thỏa mãn query', () => {
      const keywords = ['xâu con liên tục', 'chuỗi con dài nhất', 'đoạn con độ dài k']
      expect(matchesAny(keywords, 'xau con')).toBe(true)
      expect(matchesAny(keywords, 'doan con')).toBe(true)
      expect(matchesAny(keywords, 'chuoi con')).toBe(true)
      expect(matchesAny(keywords, 'do thi')).toBe(false)
    })
  })
})
