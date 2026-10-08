import type {
  Chapter,
  Concept,
  ComplexityRow,
  Pattern,
  Pitfall,
  Template,
  Problem,
  SeedData,
} from '../types'

/**
 * GIÁO TRÌNH CỐT LÕI THUẬT TOÁN & CẤU TRÚC DỮ LIỆU THỰC CHIẾN
 * Được biên soạn bởi Kỹ sư phần mềm phục vụ luyện thi phỏng vấn Big Tech (FAANG)
 * 
 * 6 Chương nền tảng:
 * 1. Arrays & Hashing (Mảng & Bảng Băm)
 * 2. Two Pointers (Kỹ thuật Hai Con Trỏ)
 * 3. Stack (Ngăn Xếp & Monotonic Stack)
 * 4. Binary Search (Tìm Kiếm Nhị Phân)
 * 5. Sliding Window (Cửa Sổ Trượt)
 * 6. Linked List (Danh Sách Liên Kết)
 */

export const seedChapters: Chapter[] = [
  {
    id: 'ch-01',
    slug: 'arrays-and-hashing',
    title: 'Arrays & Hashing',
    summary:
      'Nền tảng mảng động và bảng băm. Hiểu sâu cơ chế cấp phát RAM, phân bổ bộ nhớ liên tục và kỹ thuật đánh đổi không gian lấy thời gian từ $O(N)$ về $O(1)$.',
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
  {
    id: 'ch-02',
    slug: 'two-pointers',
    title: 'Two Pointers',
    summary:
      'Tối ưu hóa không gian trạng thái trên dữ liệu có thứ tự. Thu hẹp bài toán từ $O(N^2)$ về $O(N)$ với bộ nhớ phụ $O(1)$ thông qua tính đơn điệu.',
    order: 2,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
  {
    id: 'ch-03',
    slug: 'stack',
    title: 'Stack',
    summary:
      'Mô hình LIFO và kỹ thuật ngăn xếp đơn điệu. Giải quyết triệt để các bài toán khớp ngoặc, đánh giá biểu thức và tìm kiếm phần tử vượt trội kế tiếp.',
    order: 3,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
  {
    id: 'ch-04',
    slug: 'binary-search',
    title: 'Binary Search',
    summary:
      'Nguyên lý loại trừ nửa không gian tìm kiếm. Chinh phục tìm kiếm nhị phân trên mảng xoay và bài toán tối ưu hóa Binary Search on Answer trong $O(\\log N)$.',
    order: 4,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
  {
    id: 'ch-05',
    slug: 'sliding-window',
    title: 'Sliding Window',
    summary:
      'Kỹ thuật co giãn khung cửa sổ trên mảng con liên tục. Chuyển hóa bài toán vét cạn $O(N^2)$ thành duyệt tuyến tính $O(N)$ với cửa sổ cố định và biến thiên.',
    order: 5,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
  {
    id: 'ch-06',
    slug: 'linked-list',
    title: 'Linked List',
    summary:
      'Cấu trúc dữ liệu phi liên tục trên bộ nhớ Heap. Nắm vững kỹ thuật Dummy Node, đảo liên kết tại chỗ và thuật toán Floyd Cycle Detection.',
    order: 6,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
]

export const seedConcepts: Concept[] = [
  // Chapter 1: Arrays & Hashing
  {
    id: 'con-01',
    chapterId: 'ch-01',
    title: 'Mô hình tư duy: Mảng động & Bảng băm',
    body: `### 1. Bản chất bộ nhớ RAM của mảng
- **Mảng tĩnh**: Cấp phát một khối địa chỉ **liên tục trên RAM**. Nhờ địa chỉ tính theo công thức $\\text{Address}(i) = \\text{Base} + i \\times \\text{ElementSize}$, CPU truy xuất phần tử bất kỳ tức thì trong $O(1)$. Điểm yếu: kích thước cố định, chèn hoặc xóa ở đầu tốn $O(N)$ do phải dịch chuyển toàn bộ phần tử phía sau.
- **Mảng động**: Đại diện là \`std::vector\` trong C++ và \`list\` trong Python.
  - Khi mảng đầy dung lượng capacity, hệ điều hành cấp phát một vùng nhớ mới có kích thước gấp đôi ($2\\times$), sao chép toàn bộ dữ liệu cũ sang và giải phóng vùng nhớ cũ.
  - **Chi phí phân bổ Amortized $O(1)$**: Mặc dù thao tác mở rộng tốn $O(N)$, nhưng việc này diễn ra rất hiếm ($N$ lần thêm mới chỉ tốn một lần cấp phát lại $N$), nên trung bình mỗi thao tác \`append()\` chỉ tốn $O(1)$.

### 2. Bảng băm & Cơ chế giải quyết va chạm
- **Cơ chế**: Ánh xạ một khóa có kiểu dữ liệu bất kỳ thành một chỉ số nguyên trong mảng thông qua hàm băm: $\\text{index} = \\text{hash}(key) \\pmod{\\text{capacity}}$.
- **Giải quyết va chạm**:
  - **Separate Chaining**: Mỗi ô bucket chứa một danh sách liên kết. Nếu va chạm nhiều (bucket $> 8$ phần tử trong Java 8+), bucket tự động chuyển thành cây đỏ đen Red-Black Tree để đảm bảo tra cứu xấu nhất là $O(\\log N)$ thay vì thoái hóa thành $O(N)$.
  - **Open Addressing**: Khi ô bị trùng, thuật toán tìm ô trống tiếp theo dựa trên cơ chế nhảy có xáo trộn để tránh tụ cụm dữ liệu.
- **Sự đánh đổi**: Tốn dung lượng bộ nhớ phụ $O(N)$ để nhận về tốc độ tra cứu, chèn, xóa trung bình đạt $O(1)$.

### 3. Bảng so sánh đặc tính thực chiến
| Cấu trúc dữ liệu | Truy cập ngẫu nhiên | Thêm/Xóa cuối | Thêm/Xóa đầu | Tìm kiếm phần tử | Bộ nhớ phụ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mảng tĩnh** | $O(1)$ | Không hỗ trợ | Không hỗ trợ | $O(N)$ | $O(1)$ |
| **Mảng động** | $O(1)$ | $O(1)$ amortized | $O(N)$ | $O(N)$ | Hệ số mở rộng $1.5\\times - 2\\times$ |
| **Bảng băm** | Không có thứ tự | $O(1)$ | $O(1)$ | $O(1)$ trung bình | $O(N)$ lưu bảng băm |`,
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },

  // Chapter 2: Two Pointers
  {
    id: 'con-02',
    chapterId: 'ch-02',
    title: 'Mô hình tư duy: Kỹ thuật Two Pointers',
    body: `### 1. Bản chất: Thu hẹp không gian trạng thái
- Phương pháp vét cạn Brute-force kiểm tra mọi cặp $(i, j)$ với $i < j$, tạo thành không gian tìm kiếm kích thước ma trận tam giác $\\frac{N(N-1)}{2} \\approx O(N^2)$.
- Kỹ thuật Two Pointers khai thác **tính đơn điệu** của dữ liệu đã sắp xếp. Mỗi khi ta so sánh tổng $A[left] + A[right]$ với $target$:
  - Nếu tổng nhỏ hơn $target$: Mọi phần tử từ $left$ đến $right-1$ khi ghép với $left$ đều sẽ nhỏ hơn $target$. Do đó ta loại bỏ an toàn toàn bộ hàng $left$ bằng cách tăng \`left++\`.
  - Nếu tổng lớn hơn $target$: Ta loại bỏ an toàn toàn bộ cột $right$ bằng cách giảm \`right--\`.
- **Kết quả**: Mỗi bước loại bỏ hẳn một hàng hoặc một cột của không gian trạng thái, giảm độ phức tạp từ $O(N^2)$ xuống tối đa $N$ bước ($O(N)$).

### 2. Ba biến thể Two Pointers kinh điển
1. **Hai đầu đối xứng**: \`left = 0\`, \`right = n - 1\`. Thường dùng cho bài toán tìm cặp số, diện tích chứa nước Container With Most Water, hoặc kiểm tra chuỗi đối xứng Valid Palindrome.
2. **Con trỏ nhanh - chậm**: Hai con trỏ xuất phát cùng phía nhưng tốc độ khác nhau. Dùng trong duyệt mảng tại chỗ như Move Zeroes, Remove Duplicates hoặc phát hiện chu trình.
3. **Cố định kết hợp hai con trỏ**: Dùng vòng lặp cố định $K-2$ phần tử bên ngoài, bên trong chạy con trỏ đối xứng cho 2 phần tử cuối như 3Sum $O(N^2)$, 4Sum $O(N^3)$.`,
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },

  // Chapter 3: Stack
  {
    id: 'con-03',
    chapterId: 'ch-03',
    title: 'Mô hình tư duy: Ngăn xếp Stack & Monotonic Stack',
    body: `### 1. Bản chất: Cấu trúc LIFO & Khử đệ quy
- Ngăn xếp hoạt động theo cơ chế **Last In, First Out (LIFO)**: Phần tử đưa vào sau cùng sẽ được lấy ra đầu tiên. Mọi thao tác \`push\`, \`pop\`, \`top\` đều đạt $O(1)$.
- **Mô hình tư duy**: Tương tự như ngăn kéo xếp đĩa ăn hoặc Call Stack của chương trình máy tính. Khi một bài toán có tính chất phụ thuộc lồng nhau như cặp ngoặc \`{[()]}\` hay lời gọi hàm, Stack là cấu trúc dữ liệu tự nhiên nhất để lưu trữ ngữ cảnh chưa hoàn tất.

### 2. Monotonic Stack & Hiện tượng che bóng
- **Định nghĩa**: Ngăn xếp mà giá trị các phần tử bên trong luôn được duy trì theo thứ tự tăng dần hoặc giảm dần nghiêm ngặt.
- **Hiện tượng che bóng**:
  - Tưởng tượng một hàng người có chiều cao khác nhau đứng nhìn về phía mặt trời lặn. Một người cao đứng ở vị trí sau sẽ che khuất tầm nhìn của những người thấp hơn đứng trước họ.
  - Khi duyệt phần tử $x$: ta liên tục loại bỏ (\`pop\`) các phần tử trong stack yếu thế hơn $x$, vì từ thời điểm này trở đi, $x$ sẽ là ứng viên tối ưu hơn cho mọi phần tử xuất hiện ở phía sau.
- **Phân tích độ phức tạp**: Dù có vòng lặp \`while\` bên trong vòng \`for\`, nhưng mỗi phần tử trong mảng chỉ được đưa vào stack đúng **1 lần** và lấy ra khỏi stack tối đa **1 lần**. Do đó, tổng số thao tác amortized trên toàn mảng $N$ phần tử luôn được giới hạn ở mức **$2N$ thao tác** $\\rightarrow O(N)$ thời gian.`,
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },

  // Chapter 4: Binary Search
  {
    id: 'con-04',
    chapterId: 'ch-04',
    title: 'Mô hình tư duy: Tìm kiếm nhị phân & Ranh giới đơn điệu',
    body: `### 1. Bản chất: Phân định ranh giới nhị phân
- Tìm kiếm nhị phân không chỉ áp dụng cho mảng đã sắp xếp. Bản chất sâu xa của thuật toán là tìm kiếm **điểm chuyển tiếp giữa hai trạng thái True/False** trên một hàm mệnh đề $P(x)$ có tính chất đơn điệu:
$$P(x): [\\text{False}, \\text{False}, \\dots, \\text{False}, \\mathbf{True}, \\text{True}, \\dots, \\text{True}]$$
- Mỗi bước so sánh tại phần tử trung vị $mid$, ta loại trừ chắc chắn một nửa không gian tìm kiếm, giảm số bước tối đa xuống $\\lceil \\log_2 N \\rceil$ bước.

### 2. Công thức tính trung điểm chống tràn số 32-bit
- **Sai lầm kinh điển**: Phép tính \`mid = (left + right) / 2\` có thể gây tràn số nguyên 32-bit khi $left + right > 2^{31} - 1$ (dẫn tới giá trị âm trong C++ hoặc Java).
- **Chuẩn an toàn**:
$$mid = left + \\lfloor \\frac{right - left}{2} \\rfloor$$

### 3. Tìm kiếm nhị phân trên không gian kết quả (Binary Search on Answer)
- Áp dụng khi bài toán yêu cầu: *"Tìm giá trị nhỏ nhất sao cho..."* hoặc *"Tìm giá trị lớn nhất mà vẫn thỏa mãn..."*.
- Nếu ta có thể viết một hàm kiểm tra khả thi \`feasible(k)\` chạy trong $O(N)$, và hàm này mang tính đơn điệu (nếu $k$ thỏa mãn thì mọi giá trị lớn hơn $k$ cũng thỏa mãn), ta có thể nhị phân trực tiếp trên khoảng đáp án $[\\text{min\\_val}, \\text{max\\_val}]$ với chi phí tổng thể $O(N \\log(\\text{range}))$.`,
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },

  // Chapter 5: Sliding Window
  {
    id: 'con-05',
    chapterId: 'ch-05',
    title: 'Mô hình tư duy: Kỹ thuật Sliding Window',
    body: `### 1. Bản chất: Mô hình con sâu đo Caterpillar
- Sliding Window là kỹ thuật tối ưu hóa bài toán trên **mảng con hoặc chuỗi con liên tục**.
- **Mô hình tư duy**: Tưởng tượng con sâu đo bò trên cành cây:
  - Đầu sâu (con trỏ \`right\`) bò về phía trước để nạp thêm phần tử vào cửa sổ.
  - Đuôi sâu (con trỏ \`left\`) co lại khi cửa sổ vi phạm điều kiện bài toán để loại bỏ bớt phần tử.
- Thay vì tính toán lại toàn bộ đoạn $[left, right]$ từ đầu tốn $O(N)$, ta chỉ cập nhật gia tăng phần tử vừa vào và phần tử vừa ra với chi phí $O(1)$.

### 2. Phân loại hai dạng bài toán cốt lõi
1. **Cửa sổ cố định kích thước $K$**:
   - Chiều dài cửa sổ luôn bằng $K$.
   - Mỗi bước: Thêm $A[right]$ vào tập trạng thái, loại bỏ $A[right - K]$ ra khỏi tập trạng thái. Độ phức tạp toàn bài: $O(N)$.
2. **Cửa sổ biến thiên**:
   - **Tìm cửa sổ dài nhất**: Mở rộng \`right\` liên tục, chỉ dùng \`while\` thu hẹp \`left\` khi điều kiện bị vi phạm. Cập nhật kết quả cực đại khi cửa sổ hợp lệ: \`best = max(best, right - left + 1)\`.
   - **Tìm cửa sổ ngắn nhất**: Mở rộng \`right\` đến khi điều kiện được thỏa mãn, sau đó dùng \`while\` thu hẹp \`left\` nhiều nhất có thể để tìm kích thước tối thiểu trước khi điều kiện bị phá vỡ.`,
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },

  // Chapter 6: Linked List
  {
    id: 'con-06',
    chapterId: 'ch-06',
    title: 'Mô hình tư duy: Danh sách liên kết & Kỹ thuật con trỏ',
    body: `### 1. Bản chất: Khối bộ nhớ phân mảnh trên Heap
- Khác với mảng cấp phát liên tục, các nút của danh sách liên kết nằm rải rác bất kỳ nơi nào trên bộ nhớ Heap và kết nối với nhau bằng con trỏ địa chỉ \`next\`.
- **Hệ quả**: Không có tính chất Cache Locality, truy cập ngẫu nhiên tốn $O(N)$. Bù lại, thao tác chèn hoặc xóa nút khi đã nắm giữ con trỏ chỉ tốn $O(1)$ mà không cần dịch chuyển dữ liệu.

### 2. Hai kỹ thuật then chốt trong Linked List
- **Kỹ thuật Dummy Node**:
  - *Vấn đề*: Khi xóa hoặc chèn phần tử ở đầu danh sách, con trỏ \`head\` thay đổi khiến code phát sinh nhiều câu lệnh \`if-else\` xử lý trường hợp biên.
  - *Giải pháp*: Khởi tạo một nút giả \`dummy = ListNode(0)\` trỏ tới \`head\`. Mọi thao tác trên danh sách đều quy về xử lý nút ở giữa, cuối cùng chỉ cần trả về \`dummy.next\`.
- **Kỹ thuật Fast & Slow Pointers**:
  - Cho con trỏ chậm \`slow\` đi 1 bước, con trỏ nhanh \`fast\` đi 2 bước.
  - **Tìm trung điểm**: Khi \`fast\` chạm cuối danh sách, \`slow\` luôn nằm chính xác ở vị trí chính giữa.
  - **Phát hiện chu trình**: Nếu danh sách có chu trình khép kín, \`fast\` chắc chắn sẽ bắt kịp \`slow\` từ phía sau với bộ nhớ phụ $O(1)$.`,
    order: 1,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
  },
]

export const seedComplexityRows: ComplexityRow[] = [
  // Chapter 1: Arrays & Hashing
  {
    id: 'cx-01-01',
    chapterId: 'ch-01',
    operation: 'Truy cập phần tử theo chỉ số',
    time: '$O(1)$',
    space: '$O(1)$',
    note: 'Nhờ địa chỉ RAM liên tục: Address = Base + i * ElementSize.',
    level: 'constant',
    order: 1,
  },
  {
    id: 'cx-01-02',
    chapterId: 'ch-01',
    operation: 'Thêm hoặc xóa cuối mảng động',
    time: '$O(1)$',
    space: '$O(1)$',
    note: 'Chi phí Amortized O(1). Thao tác mở rộng mảng diễn ra hiếm hoi.',
    level: 'constant',
    order: 2,
  },
  {
    id: 'cx-01-03',
    chapterId: 'ch-01',
    operation: 'Chèn hoặc xóa ở đầu hay giữa mảng',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Phải dịch chuyển các phần tử phía sau sang một vị trí.',
    level: 'linear',
    order: 3,
  },
  {
    id: 'cx-01-04',
    chapterId: 'ch-01',
    operation: 'Tra cứu, thêm, xóa trong bảng băm',
    time: '$O(1)$',
    space: '$O(N)$',
    note: 'Hiệu năng trung bình với hàm băm phân phối đều và hệ số tải <= 0.75.',
    level: 'constant',
    order: 4,
  },
  {
    id: 'cx-01-05',
    chapterId: 'ch-01',
    operation: 'Tra cứu bảng băm trong trường hợp xấu nhất',
    time: '$O(N)$',
    space: '$O(N)$',
    note: 'Xảy ra khi toàn bộ khóa bị va chạm vào cùng một bucket duy nhất.',
    level: 'linear',
    order: 5,
  },

  // Chapter 2: Two Pointers
  {
    id: 'cx-02-01',
    chapterId: 'ch-02',
    operation: 'Duyệt hai con trỏ đối xứng',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Mỗi bước ít nhất một con trỏ di chuyển, tổng số bước tối đa N.',
    level: 'linear',
    order: 1,
  },
  {
    id: 'cx-02-02',
    chapterId: 'ch-02',
    operation: 'Thuật toán 3Sum',
    time: '$O(N^2)$',
    space: '$O(1)$',
    note: 'Sắp xếp mảng O(N log N), vòng ngoài N lần kết hợp hai con trỏ N bước.',
    level: 'quadratic',
    order: 2,
  },
  {
    id: 'cx-02-03',
    chapterId: 'ch-02',
    operation: 'Ghi đè mảng tại chỗ In-place',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Quét mảng một lượt duy nhất, ghi đè trực tiếp với bộ nhớ phụ O(1).',
    level: 'linear',
    order: 3,
  },

  // Chapter 3: Stack
  {
    id: 'cx-03-01',
    chapterId: 'ch-03',
    operation: 'Thao tác Push, Pop, Top trên Stack',
    time: '$O(1)$',
    space: '$O(1)$',
    note: 'Thao tác trực tiếp trên đỉnh ngăn xếp theo cơ chế LIFO.',
    level: 'constant',
    order: 1,
  },
  {
    id: 'cx-03-02',
    chapterId: 'ch-03',
    operation: 'Kiểm tra chuỗi ngoặc hợp lệ',
    time: '$O(N)$',
    space: '$O(N)$',
    note: 'Stack lưu trữ tối đa N ký tự ngoặc mở trong trường hợp xấu nhất.',
    level: 'linear',
    order: 2,
  },
  {
    id: 'cx-03-03',
    chapterId: 'ch-03',
    operation: 'Xây dựng Monotonic Stack',
    time: '$O(N)$',
    space: '$O(N)$',
    note: 'Mỗi phần tử vào stack một lần và ra khỏi stack tối đa một lần.',
    level: 'linear',
    order: 3,
  },

  // Chapter 4: Binary Search
  {
    id: 'cx-04-01',
    chapterId: 'ch-04',
    operation: 'Tìm kiếm nhị phân tiêu chuẩn',
    time: '$O(\\log N)$',
    space: '$O(1)$',
    note: 'Không gian tìm kiếm thu hẹp một nửa sau mỗi phép so sánh.',
    level: 'log',
    order: 1,
  },
  {
    id: 'cx-04-02',
    chapterId: 'ch-04',
    operation: 'Tìm kiếm biên Lower Bound / Upper Bound',
    time: '$O(\\log N)$',
    space: '$O(1)$',
    note: 'Xác định điểm biên đầu tiên thỏa mãn điều kiện đơn điệu.',
    level: 'log',
    order: 2,
  },
  {
    id: 'cx-04-03',
    chapterId: 'ch-04',
    operation: 'Binary Search on Answer',
    time: '$O(C \\cdot \\log(\\text{range}))$',
    space: '$O(1)$',
    note: 'Hàm kiểm tra feasible(x) tốn C bước, khoảng nghiệm range = high - low.',
    level: 'log',
    order: 3,
  },

  // Chapter 5: Sliding Window
  {
    id: 'cx-05-01',
    chapterId: 'ch-05',
    operation: 'Cửa sổ trượt cố định',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Cập nhật cửa sổ trong O(1) mỗi bước nhờ thêm phần tử mới và bỏ phần tử cũ.',
    level: 'linear',
    order: 1,
  },
  {
    id: 'cx-05-02',
    chapterId: 'ch-05',
    operation: 'Cửa sổ trượt biến thiên',
    time: '$O(N)$',
    space: '$O(\\Sigma)$',
    note: 'Cả con trỏ trái và phải chỉ dịch về phía trước tối đa N bước.',
    level: 'linear',
    order: 2,
  },

  // Chapter 6: Linked List
  {
    id: 'cx-06-01',
    chapterId: 'ch-06',
    operation: 'Chèn hoặc xóa tại đầu danh sách',
    time: '$O(1)$',
    space: '$O(1)$',
    note: 'Chỉ thay đổi con trỏ địa chỉ của head, không cần dịch dữ liệu.',
    level: 'constant',
    order: 1,
  },
  {
    id: 'cx-06-02',
    chapterId: 'ch-06',
    operation: 'Truy cập phần tử thứ k',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Duyệt tuần tự từ đầu danh sách qua từng con trỏ next.',
    level: 'linear',
    order: 2,
  },
  {
    id: 'cx-06-03',
    chapterId: 'ch-06',
    operation: 'Đảo ngược danh sách liên kết tại chỗ',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Sử dụng 3 con trỏ đảo hướng liên kết với bộ nhớ phụ O(1).',
    level: 'linear',
    order: 3,
  },
  {
    id: 'cx-06-04',
    chapterId: 'ch-06',
    operation: 'Phát hiện chu trình bằng Fast & Slow Pointers',
    time: '$O(N)$',
    space: '$O(1)$',
    note: 'Con trỏ nhanh đuổi kịp con trỏ chậm trong tối đa N bước lặp.',
    level: 'linear',
    order: 4,
  },
]

export const seedPatterns: Pattern[] = [
  // Chapter 1: Arrays & Hashing
  {
    id: 'pt-01-hash-set',
    chapterId: 'ch-01',
    name: 'Hash Set Membership',
    description:
      'Lưu vết các phần tử đã duyệt qua vào Hash Set để kiểm tra sự tồn tại trong $O(1)$. Khi nào KHÔNG NÊN DÙNG: Khi mảng yêu cầu bộ nhớ nghiêm ngặt $O(1)$ và được phép sắp xếp tại chỗ, hoặc khi cần lưu trữ thứ tự xuất hiện ban đầu.',
    keywords: ['contains duplicate', 'find duplicate', 'seen set', 'xuất hiện ít nhất hai lần', 'phần tử trùng lặp'],
    examplePhrases: [
      'Given an integer array nums, return true if any value appears at least twice in the array.',
      'Find the first duplicate element in an array with numbers from 1 to n.',
    ],
    order: 1,
  },
  {
    id: 'pt-01-hash-map',
    chapterId: 'ch-01',
    name: 'Two Sum Pattern (Hash Map Complement)',
    description:
      'Duyệt mảng một lượt duy nhất, với mỗi phần tử $x$, tìm kiếm phần tử bù $target - x$ đã lưu trong Hash Map trước đó. Khi nào KHÔNG NÊN DÙNG: Khi mảng đầu vào đã được sắp xếp trước (nên dùng Two Pointers để đạt $O(1)$ bộ nhớ).',
    keywords: ['two sum', 'complement', 'target sum', 'đếm tần suất', 'chỉ số của cặp số'],
    examplePhrases: [
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      'Find the frequency of each unique element and return elements appearing more than N/3 times.',
    ],
    order: 2,
  },
  {
    id: 'pt-01-canonical-key',
    chapterId: 'ch-01',
    name: 'Group Anagrams (Canonical Key)',
    description:
      'Quy chuẩn hóa các đối tượng tương đương về một khóa đại diện Canonical Key bằng cách sắp xếp ký tự hoặc đếm mảng tần số 26 chữ cái. Khi nào KHÔNG NÊN DÙNG: Khi kích thước chuỗi $K$ quá lớn và bảng chữ cái mở rộng làm chi phí chuẩn hóa vượt ngưỡng.',
    keywords: ['group anagrams', 'canonical key', 'đảo chữ', 'phân loại nhóm', 'tần số ký tự'],
    examplePhrases: [
      'Given an array of strings strs, group the anagrams together in any order.',
      'Group strings that share the same character frequency distribution.',
    ],
    order: 3,
  },
  {
    id: 'pt-01-prefix-suffix',
    chapterId: 'ch-01',
    name: 'Prefix & Suffix Accumulation',
    description:
      'Tính toán trước mảng tích lũy từ trái qua (Prefix) và từ phải qua (Suffix) để trả lời kết quả từng vị trí trong $O(1)$ mà không cần duyệt lại. Khi nào KHÔNG NÊN DÙNG: Khi mảng thường xuyên bị chỉnh sửa động (nên dùng Fenwick Tree hoặc Segment Tree để cập nhật $O(\\log N)$).',
    keywords: ['product of array except self', 'prefix sum', 'suffix product', 'không dùng phép chia', 'tổng đoạn con'],
    examplePhrases: [
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements except nums[i].',
      'Compute the range sum query on immutable arrays in O(1) time.',
    ],
    order: 4,
  },
  {
    id: 'pt-01-bucket-sort',
    chapterId: 'ch-01',
    name: 'Top K Frequent Elements (Bucket Sort)',
    description:
      'Đếm tần suất các phần tử, sau đó sử dụng mảng bucket với chỉ số là tần suất ($0 \\dots N$) để thu thập $K$ phần tử nhiều nhất trong $O(N)$ thay vì $O(N \\log N)$ của heap/sort. Khi nào KHÔNG NÊN DÙNG: Khi miền giá trị tần suất không bị chặn bởi $N$.',
    keywords: ['top k frequent', 'bucket sort', 'tần suất cao nhất', 'không dùng sorting'],
    examplePhrases: [
      'Given an integer array nums and an integer k, return the k most frequent elements in linear time.',
      'Sort characters by frequency in O(N) time.',
    ],
    order: 5,
  },

  // Chapter 2: Two Pointers
  {
    id: 'pt-02-opposite-ends',
    chapterId: 'ch-02',
    name: 'Opposite Ends Two Pointers',
    description:
      'Hai con trỏ xuất phát từ hai đầu mảng (trái $l$ và phải $r$) di chuyển về phía nhau dựa trên điều kiện so sánh. Khi nào KHÔNG NÊN DÙNG: Khi mảng chưa sắp xếp và không có tính chất đơn điệu, hoặc khi việc sắp xếp làm mất tính hợp lệ của bài toán ban đầu.',
    keywords: ['two pointers', 'opposite ends', 'sorted array', 'palindrome', 'container with most water', 'hai con trỏ'],
    examplePhrases: [
      'Given a string s, return true if it is a palindrome, after converting all uppercase letters into lowercase letters and removing non-alphanumeric characters.',
      'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    ],
    order: 1,
  },
  {
    id: 'pt-02-k-sum',
    chapterId: 'ch-02',
    name: 'K-Sum Pattern',
    description:
      'Sắp xếp mảng, cố định $K-2$ phần tử ở các vòng lặp ngoài và dùng hai con trỏ cho 2 phần tử cuối, kèm xử lý bỏ qua các giá trị trùng lặp. Khi nào KHÔNG NÊN DÙNG: Khi $K > 3$ và yêu cầu thời gian nhỏ hơn $O(N^{K-1})$ (có thể cân nhắc Hash Map).',
    keywords: ['3sum', '4sum', 'k-sum', 'bộ ba có tổng bằng 0', 'unique triplets', 'không trùng lặp', 'hai con trỏ'],
    examplePhrases: [
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
      'Find all unique quadruplets that sum to a given target.',
    ],
    order: 2,
  },
  {
    id: 'pt-02-read-write',
    chapterId: 'ch-02',
    name: 'Fast & Slow Pointers In-place',
    description:
      'Dùng con trỏ đọc quét qua toàn bộ mảng và con trỏ ghi lưu các phần tử thỏa mãn tại chỗ mà không cấp phát thêm bộ nhớ. Khi nào KHÔNG NÊN DÙNG: Khi cần bảo toàn nguyên vẹn mảng gốc.',
    keywords: ['in-place', 'move zeroes', 'remove duplicates', 'read write pointers', 'hai con trỏ', 'O(1) memory'],
    examplePhrases: [
      'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements.',
      'Remove duplicates from sorted array in-place such that each unique element appears only once.',
    ],
    order: 3,
  },

  // Chapter 3: Stack
  {
    id: 'pt-03-matching',
    chapterId: 'ch-03',
    name: 'Parentheses Matching',
    description:
      'Sử dụng Stack để kiểm tra tính hợp lệ của các cấu trúc lồng nhau: gặp mở thì push, gặp đóng thì pop và so khớp. Khi nào KHÔNG NÊN DÙNG: Khi chỉ có một loại ngoặc duy nhất (chỉ cần dùng một biến đếm số nguyên để đạt $O(1)$ bộ nhớ).',
    keywords: ['valid parentheses', 'matching brackets', 'ngăn xếp ngoặc', 'lồng nhau'],
    examplePhrases: [
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      'Check if XML/HTML tags are properly balanced and closed.',
    ],
    order: 1,
  },
  {
    id: 'pt-03-monotonic-stack',
    chapterId: 'ch-03',
    name: 'Monotonic Stack',
    description:
      'Duy trì stack có thứ tự đơn điệu để tìm phần tử lớn hơn hoặc nhỏ hơn kế tiếp của mọi vị trí trong $O(N)$. Khi nào KHÔNG NÊN DÙNG: Khi bài toán yêu cầu tìm phần tử lớn nhất trên toàn bộ mảng (chỉ cần quét qua mảng một lượt với 1 biến max).',
    keywords: ['next greater element', 'daily temperatures', 'monotonic stack', 'phần tử lớn hơn tiếp theo', 'histogram'],
    examplePhrases: [
      'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
      'Find the largest rectangle in histogram using monotonic increasing stack.',
    ],
    order: 2,
  },
  {
    id: 'pt-03-expression-eval',
    chapterId: 'ch-03',
    name: 'Reverse Polish Notation',
    description:
      'Đánh giá biểu thức ký pháp Ba Lan ngược: gặp toán hạng thì push vào stack, gặp toán tử thì pop 2 toán hạng ra tính toán và push kết quả trở lại. Khi nào KHÔNG NÊN DÙNG: Khi biểu thức chứa biến số hoặc hàm chưa xác định.',
    keywords: ['evaluate reverse polish notation', 'rpn', 'biểu thức hậu tố', 'calculator'],
    examplePhrases: [
      'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.',
      'Implement a basic calculator that evaluates a mathematical string expression.',
    ],
    order: 3,
  },

  // Chapter 4: Binary Search
  {
    id: 'pt-04-basic-bs',
    chapterId: 'ch-04',
    name: 'Standard Binary Search',
    description:
      'Chia đôi không gian tìm kiếm trên mảng đã sắp xếp để tìm chính xác giá trị target trong $O(\\log N)$. Khi nào KHÔNG NÊN DÙNG: Khi mảng rất nhỏ ($N < 16$), tìm kiếm tuần tự thường nhanh hơn do tận dụng Cache Locality.',
    keywords: ['binary search', 'search in sorted array', 'tìm kiếm nhị phân', 'O(log N)'],
    examplePhrases: [
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums in O(log n) runtime.',
      'Find the index of a target value in a 2D matrix where each row is sorted.',
    ],
    order: 1,
  },
  {
    id: 'pt-04-bound',
    chapterId: 'ch-04',
    name: 'Lower Bound & Upper Bound',
    description:
      'Tìm vị trí phần tử đầu tiên thỏa mãn điều kiện $P(x) = \\text{True}$ (Lower Bound) hoặc phần tử cuối cùng thỏa mãn. Khi nào KHÔNG NÊN DÙNG: Khi hàm kiểm tra $P(x)$ không có tính chất đơn điệu.',
    keywords: ['search insert position', 'find first and last position', 'lower bound', 'upper bound'],
    examplePhrases: [
      'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
      'Find the starting and ending position of a given target value in a sorted array.',
    ],
    order: 2,
  },
  {
    id: 'pt-04-bs-answer',
    chapterId: 'ch-04',
    name: 'Binary Search on Answer',
    description:
      'Xác định không gian kết quả khả dĩ $[low, high]$ và dùng hàm kiểm tra đơn điệu $feasible(k)$ để tìm giá trị tối ưu. Khi nào KHÔNG NÊN DÙNG: Khi khoảng giá trị quá lớn không có biên chặn, hoặc hàm $feasible(k)$ không thể tính trong thời gian đa thức.',
    keywords: ['koko eating bananas', 'capacity to ship packages', 'binary search on answer', 'tốc độ tối thiểu', 'giá trị nhỏ nhất thỏa mãn'],
    examplePhrases: [
      'Koko loves to eat bananas. Return the minimum integer k such that she can eat all the bananas within h hours.',
      'Find the least weight capacity of a ship that will result in all packages being shipped within days.',
    ],
    order: 3,
  },
  {
    id: 'pt-04-rotated-array',
    chapterId: 'ch-04',
    name: 'Rotated Sorted Array Search',
    description:
      'Tại mọi điểm chia đôi $mid$, luôn có ít nhất một nửa (nửa trái hoặc nửa phải) được sắp xếp tuần tự hoàn toàn. Dùng nửa sắp xếp này để quyết định thu hẹp. Khi nào KHÔNG NÊN DÙNG: Khi mảng có nhiều phần tử trùng lặp ($nums[left] == nums[mid] == nums[right]$), độ phức tạp bị thoái hóa về $O(N)$.',
    keywords: ['search in rotated sorted array', 'find minimum in rotated sorted array', 'mảng xoay'],
    examplePhrases: [
      'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
      'Find the minimum element in a sorted rotated array in O(log N) time.',
    ],
    order: 4,
  },

  // Chapter 5: Sliding Window
  {
    id: 'pt-05-fixed-window',
    chapterId: 'ch-05',
    name: 'Fixed-Size Sliding Window',
    description:
      'Duy trì cửa sổ có độ dài cố định $K$, mỗi bước trượt nạp phần tử mới ở biên phải và trừ phần tử cũ bị đẩy ra khỏi biên trái trong $O(1)$. Khi nào KHÔNG NÊN DÙNG: Khi độ dài cửa sổ không cố định mà phụ thuộc vào điều kiện tổng hoặc số lượng phần tử.',
    keywords: ['fixed size window', 'maximum sum subarray of size k', 'permutation in string', 'cửa sổ cố định', 'cửa sổ'],
    examplePhrases: [
      'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.',
      'Find the maximum average of any contiguous subarray of length k.',
    ],
    order: 1,
  },
  {
    id: 'pt-05-variable-longest',
    chapterId: 'ch-05',
    name: 'Variable Window (Longest Substring)',
    description:
      'Mở rộng biên phải $right$ liên tục; khi cửa sổ vi phạm điều kiện, dùng vòng lặp while co biên trái $left$ đến khi hợp lệ trở lại, sau đó cập nhật độ dài cực đại. Khi nào KHÔNG NÊN DÙNG: Khi mảng có chứa số âm khiến tổng không có tính chất đơn điệu tăng (nên dùng Prefix Sum kết hợp Hash Map).',
    keywords: ['longest substring without repeating characters', 'longest repeating character replacement', 'chuỗi con dài nhất', 'xâu con liên tục', 'xâu con', 'cửa sổ'],
    examplePhrases: [
      'Given a string s, find the length of the longest substring without duplicate characters.',
      'Find the length of the longest substring containing the same letter you can get after performing at most k character replacements.',
    ],
    order: 2,
  },
  {
    id: 'pt-05-variable-shortest',
    chapterId: 'ch-05',
    name: 'Variable Window (Shortest Substring)',
    description:
      'Mở rộng biên phải $right$ đến khi cửa sổ thỏa mãn điều kiện, sau đó thu hẹp biên trái $left$ để tìm kích thước tối thiểu và liên tục cập nhật đáp án ngay trong vòng lặp while. Khi nào KHÔNG NÊN DÙNG: Khi điều kiện bài toán không thể kiểm tra tăng dần.',
    keywords: ['minimum window substring', 'minimum size subarray sum', 'chuỗi con ngắn nhất', 'xâu con ngắn nhất', 'cửa sổ'],
    examplePhrases: [
      'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window.',
      'Find the minimal length of a contiguous subarray of which the sum is greater than or equal to target.',
    ],
    order: 3,
  },

  // Chapter 6: Linked List
  {
    id: 'pt-06-reverse-in-place',
    chapterId: 'ch-06',
    name: 'Reverse Linked List In-place',
    description:
      'Dùng 3 con trỏ \`prev\`, \`curr\`, \`next_temp\` để đổi hướng mũi tên liên kết giữa các nút liên tiếp với $O(1)$ bộ nhớ phụ. Khi nào KHÔNG NÊN DÙNG: Khi danh sách liên kết là bất biến hoặc dùng chung trong môi trường đa luồng.',
    keywords: ['reverse linked list', 'đảo ngược danh sách', 'in-place pointer reversal'],
    examplePhrases: [
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      'Reverse nodes of a linked list from position left to position right in-place.',
    ],
    order: 1,
  },
  {
    id: 'pt-06-dummy-node',
    chapterId: 'ch-06',
    name: 'Dummy Node Technique',
    description:
      'Khởi tạo nút giả đứng trước nút đầu tiên để quy chuẩn hóa mọi thao tác chèn và xóa, triệt tiêu toàn bộ phân nhánh đặc biệt cho nút head. Khi nào KHÔNG NÊN DÙNG: Không có trường hợp kiêng kỵ; Dummy Node là chuẩn mực trong hầu hết bài toán thao tác con trỏ.',
    keywords: ['dummy node', 'sentinel node', 'merge two sorted lists', 'remove nth node from end', 'nút giả'],
    examplePhrases: [
      'Merge the two sorted lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.',
      'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    ],
    order: 2,
  },
  {
    id: 'pt-06-fast-slow',
    chapterId: 'ch-06',
    name: 'Floyd Fast & Slow Pointers',
    description:
      'Con trỏ chậm đi 1 bước, con trỏ nhanh đi 2 bước để tìm nút giữa hoặc phát hiện chu trình khép kín trong $O(N)$ thời gian và $O(1)$ không gian. Khi nào KHÔNG NÊN DÙNG: Khi có thể tự do gắn cờ boolean \`visited\` vào thuộc tính của nút mà không bị giới hạn bộ nhớ.',
    keywords: ['linked list cycle', 'middle of the linked list', 'rùa và thỏ', 'fast and slow pointers', 'chu trình'],
    examplePhrases: [
      'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
      'Given the head of a singly linked list, return the middle node of the linked list.',
    ],
    order: 3,
  },
  {
    id: 'pt-06-merge-reorder',
    chapterId: 'ch-06',
    name: 'Reorder List (Split, Reverse & Interleave)',
    description:
      'Kỹ thuật phối hợp 3 bước kinh điển: Tìm trung điểm chia đôi danh sách $\\rightarrow$ Đảo ngược nửa sau $\\rightarrow$ Trộn xen kẽ hai nửa lại với nhau. Khi nào KHÔNG NÊN DÙNG: Khi bài toán cho phép cấp phát mảng phụ để lưu trữ con trỏ ($O(N)$ bộ nhớ).',
    keywords: ['reorder list', 'interleave', 'chia đôi và đảo ngược', 'sắp xếp xen kẽ'],
    examplePhrases: [
      'You are given the head of a singly linked-list. Reorder the list to be: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2...',
      'Check if a singly linked list is a palindrome in O(1) extra space.',
    ],
    order: 4,
  },
]

export const seedPitfalls: Pitfall[] = [
  // Chapter 1: Arrays & Hashing
  {
    id: 'pf-01-hashset-empty',
    chapterId: 'ch-01',
    title: 'Toán tử kiểm tra tồn tại "in" trên mảng biến thuật toán thành O(N^2)',
    type: 'edge-case',
    body: `Khi kiểm tra phần tử đã tồn tại hay chưa, việc dùng toán tử \`in\` trên Python \`list\` thông thường sẽ thực hiện duyệt tuần tự tuyến tính $O(N)$. Khi đặt trong vòng lặp, toàn bộ thuật toán thoái hóa thành $O(N^2)$ và dính lỗi Time Limit Exceeded (TLE).

❌ **Cách viết sai (Dính TLE với mảng lớn):**
\`\`\`python
seen = []
for x in nums:
    if x in seen: # Tốn O(len(seen)) -> Tổng O(N^2)
        return True
    seen.append(x)
\`\`\`

✅ **Cách xử lý chuẩn mực (O(N) thời gian):**
\`\`\`python
seen = set() # Hash Set tra cứu O(1)
for x in nums:
    if x in seen: # Tốn O(1) kỳ vọng
        return True
    seen.add(x)
\`\`\``,
    code: {
      python: `seen = set()
for x in nums:
    if x in seen:
        return True
    seen.add(x)
return False`,
      cpp: `std::unordered_set<int> seen;
for (int x : nums) {
    if (seen.count(x)) return true;
    seen.insert(x);
}
return false;`,
    },
    patternIds: ['pt-01-hash-set'],
    order: 1,
  },
  {
    id: 'pf-01-hashmap-dup',
    chapterId: 'ch-01',
    title: 'Sử dụng cùng một phần tử hai lần trong bài toán Two Sum',
    type: 'edge-case',
    body: `Nếu nạp toàn bộ mảng vào Hash Map trước rồi mới duyệt tìm số bù \`target - x\`, thuật toán có thể ghép chính phần tử tại chỉ số $i$ với chính nó khi $target = 2x$ (ví dụ: \`nums = [3, 2, 4], target = 6\`, thuật toán ghép số 3 với chính số 3 ở vị trí 0).

❌ **Cách viết sai (Dễ dùng lại chính phần tử hiện tại):**
\`\`\`python
# Nạp toàn bộ vào map trước
lookup = {num: i for i, num in enumerate(nums)}
for i, num in enumerate(nums):
    diff = target - num
    if diff in lookup: # Nguy cơ lookup[diff] == i
        return [i, lookup[diff]]
\`\`\`

✅ **Cách xử lý chuẩn mực (One-pass HashMap lookup):**
Tra cứu số bù trong các phần tử ĐÃ DUYỆT TRƯỚC ĐÓ trước khi ghi phần tử hiện tại vào Map:
\`\`\`python
lookup = {}
for i, num in enumerate(nums):
    diff = target - num
    if diff in lookup:
        return [lookup[diff], i]
    lookup[num] = i
\`\`\``,
    code: {
      python: `lookup = {}
for i, num in enumerate(nums):
    diff = target - num
    if diff in lookup:
        return [lookup[diff], i]
    lookup[num] = i
return []`,
      cpp: `std::unordered_map<int, int> lookup;
for (int i = 0; i < (int)nums.size(); ++i) {
    int diff = target - nums[i];
    if (lookup.count(diff)) {
        return {lookup[diff], i};
    }
    lookup[nums[i]] = i;
}
return {};`,
    },
    patternIds: ['pt-01-hash-map'],
    order: 2,
  },
  {
    id: 'pf-01-canonical-key',
    chapterId: 'ch-01',
    title: 'Khóa không băm được Unhashable Type và chi phí băm quá cao',
    type: 'other',
    body: `Trong Python, kiểu danh sách \`list\` là mutable nên không thể sử dụng làm khóa cho dictionary (sẽ văng lỗi \`TypeError: unhashable type: 'list'\`). Phải ép kiểu mảng đếm sang \`tuple\`.
Ngoài ra, việc sắp xếp từng xâu tốn $O(K \\log K)$, với xâu dài $K \\ge 10^4$ sẽ rất chậm so với việc đếm mảng tần số 26 ký tự tốn $O(K)$.

❌ **Cách viết sai:**
\`\`\`python
ans = {}
for s in strs:
    count = [0] * 26
    # Gây TypeError vì list không băm được
    ans[count].append(s)
\`\`\`

✅ **Cách xử lý chuẩn mực:**
\`\`\`python
from collections import defaultdict
ans = defaultdict(list)
for s in strs:
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    ans[tuple(count)].append(s) # Tuple là immutable -> băm được O(1)
\`\`\``,
    code: {
      python: `from collections import defaultdict

ans = defaultdict(list)
for s in strs:
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    ans[tuple(count)].append(s)
return list(ans.values())`,
      cpp: `// Trong C++, có thể dùng std::string làm key biểu diễn 26 ký tự
std::unordered_map<std::string, std::vector<std::string>> ans;
for (const auto& s : strs) {
    std::string key(26, 0);
    for (char c : s) key[c - 'a']++;
    ans[key].push_back(s);
}`,
    },
    patternIds: ['pt-01-canonical-key'],
    order: 3,
  },

  // Chapter 2: Two Pointers
  {
    id: 'pf-02-opposite-bound',
    chapterId: 'ch-02',
    title: 'Điều kiện dừng sai và bỏ sót ký tự đặc biệt trong Valid Palindrome',
    type: 'edge-case',
    body: `Khi duyệt hai con trỏ đối xứng bỏ qua ký tự không phải chữ/số (\`isalnum()\`), nếu không kẹp điều kiện \`left < right\` trong các vòng lặp phụ thì \`left\` có thể vượt quá \`right\` hoặc tràn mảng khi chuỗi toàn ký tự đặc biệt (ví dụ: \`s = ".,"\`).

❌ **Cách viết sai (Dễ out-of-bounds):**
\`\`\`python
while left < right:
    while not s[left].isalnum(): # Nguy cơ left vượt quá len(s)
        left += 1
    while not s[right].isalnum():
        right -= 1
\`\`\`

✅ **Cách xử lý chuẩn mực:**
\`\`\`python
while left < right:
    while left < right and not s[left].isalnum():
        left += 1
    while left < right and not s[right].isalnum():
        right -= 1
    if s[left].lower() != s[right].lower():
        return False
    left += 1
    right -= 1
return True
\`\`\``,
    code: {
      python: `left, right = 0, len(s) - 1
while left < right:
    while left < right and not s[left].isalnum():
        left += 1
    while left < right and not s[right].isalnum():
        right -= 1
    if s[left].lower() != s[right].lower():
        return False
    left += 1
    right -= 1
return True`,
      cpp: `int left = 0, right = (int)s.size() - 1;
while (left < right) {
    while (left < right && !std::isalnum(s[left])) left++;
    while (left < right && !std::isalnum(s[right])) right--;
    if (std::tolower(s[left]) != std::tolower(s[right])) return false;
    left++; right--;
}
return true;`,
    },
    patternIds: ['pt-02-opposite-ends'],
    order: 1,
  },
  {
    id: 'pf-02-ksum-duplicate',
    chapterId: 'ch-02',
    title: 'Trùng lặp bộ số trong bài toán 3Sum và tràn số nguyên',
    type: 'edge-case',
    body: `Để kết quả không chứa các bộ số trùng lặp, bắt buộc phải bỏ qua phần tử trùng ở **cả hai cấp độ**:
1. Ở vòng lặp cố định ngoài: \`if i > 0 and nums[i] == nums[i-1]: continue\` (chú ý so sánh với phần tử trước đó, không phải phần tử kế tiếp để không bỏ sót bộ số hợp lệ như \`[-1, -1, 2]\`).
2. Ở hai con trỏ trong: Sau khi tìm thấy bộ hợp lệ, phải bỏ qua mọi số trùng lặp ở cả hai đầu \`left\` và \`right\`.

✅ **Cách xử lý chuẩn mực:**
\`\`\`cpp
while (left < right && nums[left] == nums[left + 1]) left++;
while (left < right && nums[right] == nums[right - 1]) right--;
left++; right--;
\`\`\``,
    code: {
      python: `nums.sort()
res = []
for i in range(len(nums) - 2):
    if i > 0 and nums[i] == nums[i - 1]:
        continue
    l, r = i + 1, len(nums) - 1
    while l < r:
        total = nums[i] + nums[l] + nums[r]
        if total < 0:
            l += 1
        elif total > 0:
            r -= 1
        else:
            res.append([nums[i], nums[l], nums[r]])
            while l < r and nums[l] == nums[l + 1]: l += 1
            while l < r and nums[r] == nums[r - 1]: r -= 1
            l += 1
            r -= 1
return res`,
      cpp: `std::sort(nums.begin(), nums.end());
std::vector<std::vector<int>> res;
for (int i = 0; i < (int)nums.size() - 2; ++i) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    int l = i + 1, r = (int)nums.size() - 1;
    while (l < r) {
        int total = nums[i] + nums[l] + nums[r];
        if (total < 0) l++;
        else if (total > 0) r--;
        else {
            res.push_back({nums[i], nums[l], nums[r]});
            while (l < r && nums[l] == nums[l + 1]) l++;
            while (l < r && nums[r] == nums[r - 1]) r--;
            l++; r--;
        }
    }
}
return res;`,
    },
    patternIds: ['pt-02-k-sum'],
    order: 2,
  },

  // Chapter 3: Stack
  {
    id: 'pf-03-empty-pop',
    chapterId: 'ch-03',
    title: 'Lỗi Pop trên Stack rỗng và quên kiểm tra tồn dư cuối chuỗi ngoặc',
    type: 'edge-case',
    body: `Khi kiểm tra chuỗi ngoặc:
1. Gặp ngoặc đóng mà Stack đang rỗng chứng tỏ thiếu ngoặc mở tương ứng $\\rightarrow$ Trả về \`False\` ngay lập tức để tránh lỗi \`IndexError: pop from empty list\`.
2. Khi duyệt hết chuỗi, nếu Stack vẫn còn phần tử (ví dụ chuỗi \`"((("\`) thì chuỗi đó vẫn không hợp lệ. Phải kiểm tra điều kiện kết thúc: \`return len(stack) == 0\`.

❌ **Cách viết sai:**
\`\`\`python
# Quên kiểm tra stack còn phần tử cuối cùng
for ch in s:
    if ch in mapping:
        stack.pop() # Nguy cơ IndexError nếu stack rỗng
return True # SAI khi s = "(("
\`\`\`

✅ **Cách xử lý chuẩn mực:**
\`\`\`python
stack = []
mapping = {')': '(', '}': '{', ']': '['}
for ch in s:
    if ch in mapping:
        if not stack or stack[-1] != mapping[ch]:
            return False
        stack.pop()
    else:
        stack.append(ch)
return len(stack) == 0 # Bắt buộc kiểm tra stack rỗng
\`\`\``,
    code: {
      python: `stack = []
mapping = {')': '(', '}': '{', ']': '['}
for ch in s:
    if ch in mapping:
        if not stack or stack[-1] != mapping[ch]:
            return False
        stack.pop()
    else:
        stack.append(ch)
return len(stack) == 0`,
      cpp: `std::stack<char> st;
for (char ch : s) {
    if (ch == '(' || ch == '{' || ch == '[') st.push(ch);
    else {
        if (st.empty()) return false;
        char top = st.top(); st.pop();
        if (ch == ')' && top != '(') return false;
        if (ch == '}' && top != '{') return false;
        if (ch == ']' && top != '[') return false;
    }
}
return st.empty();`,
    },
    patternIds: ['pt-03-matching'],
    order: 1,
  },
  {
    id: 'pf-03-rpn-division',
    chapterId: 'ch-03',
    title: 'Sai thứ tự toán hạng và làm tròn số âm trong phép chia RPN',
    type: 'overflow',
    body: `Trong biểu thức hậu tố (RPN), toán tử trừ và chia không có tính giao hoán:
- Phần tử \`pop()\` ra đầu tiên là **số chia (b)**.
- Phần tử \`pop()\` ra tiếp theo là **số bị chia (a)**. Biểu thức đúng là $a / b$.
- **Bẫy Python số âm**: Trong Python, phép chia nguyên \`//\` làm tròn về âm vô cực (\`-3 // 2 = -2\`), trong khi quy ước đề bài yêu cầu làm tròn về 0 (\`-3 / 2 = -1.5 \\rightarrow -1\`). Phải dùng \`int(a / b)\`.

❌ **Cách viết sai trong Python:**
\`\`\`python
b, a = stack.pop(), stack.pop()
res = a // b # Cho ra -2 khi a = -3, b = 2 (SAI theo chuẩn LeetCode)
\`\`\`

✅ **Cách xử lý chuẩn mực:**
\`\`\`python
b, a = stack.pop(), stack.pop()
res = int(a / b) # Cắt phần thập phân về 0: -3 / 2 = -1.5 -> -1 (ĐÚNG)
\`\`\``,
    code: {
      python: `b = stack.pop()
a = stack.pop()
if token == '+': stack.append(a + b)
elif token == '-': stack.append(a - b)
elif token == '*': stack.append(a * b)
elif token == '/': stack.append(int(a / b))`,
      cpp: `int b = st.top(); st.pop();
int a = st.top(); st.pop();
if (op == "+") st.push(a + b);
else if (op == "-") st.push(a - b);
else if (op == "*") st.push(a * b);
else if (op == "/") st.push(a / b); // C++ tự động cắt về 0`,
    },
    patternIds: ['pt-03-expression-eval'],
    order: 2,
  },

  // Chapter 4: Binary Search
  {
    id: 'pf-04-overflow-mid',
    chapterId: 'ch-04',
    title: 'Tràn số nguyên 32-bit khi tính trung điểm mid = (left + right) / 2',
    type: 'overflow',
    body: `Trong các ngôn ngữ kiểu tĩnh (C++, Java), kiểu \`int\` 32-bit có giới hạn cực đại là $2^{31} - 1 = 2{,}147{,}483{,}647$. Khi cả \`left\` và \`right\` đều là số lớn, tổng \`left + right\` sẽ vượt ngưỡng và tràn thành số âm, dẫn tới lỗi truy cập mảng \`IndexOutOfBounds\`.

❌ **Cách viết sai:**
\`\`\`cpp
int mid = (left + right) / 2; // Nguy cơ tràn số khi left + right > 2^31 - 1
\`\`\`

✅ **Cách xử lý chuẩn mực:**
\`\`\`cpp
int mid = left + (right - left) / 2; // Luôn an toàn tuyệt đối
\`\`\``,
    code: {
      cpp: `// Cách an toàn chống tràn số nguyên trong C++/Java:
int mid = left + (right - left) / 2;`,
      python: `# Trong Python, số nguyên có kích thước động không bị tràn,
# nhưng tuân thủ chuẩn mực để đồng bộ tư duy:
mid = left + (right - left) // 2`,
    },
    patternIds: ['pt-04-basic-bs', 'pt-04-bound'],
    order: 1,
  },
  {
    id: 'pf-04-infinite-loop',
    chapterId: 'ch-04',
    title: 'Vòng lặp vô hạn do cập nhật biên và làm tròn mid',
    type: 'edge-case',
    body: `Khi còn đúng 2 phần tử (\`right = left + 1\`), công thức \`mid = left + (right - left) // 2\` sẽ làm tròn xuống khiến \`mid == left\`.
- Nếu cập nhật \`left = mid\`, giá trị \`left\` không thay đổi, dẫn đến vòng lặp lặp lại vô tận.
- **Quy tắc vàng**:
  - Với khoảng đóng $[left, right]$: Điều kiện là \`while left <= right\`, cập nhật \`left = mid + 1\` và \`right = mid - 1\`.
  - Với khoảng nửa mở $[left, right)$: Điều kiện là \`while left < right\`, cập nhật \`left = mid + 1\` và \`right = mid\`.`,
    code: {
      python: `# Khoảng đóng [left, right] chuẩn mực:
left, right = 0, len(nums) - 1
while left <= right:
    mid = left + (right - left) // 2
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
return -1`,
      cpp: `int left = 0, right = (int)nums.size() - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
return -1;`,
    },
    patternIds: ['pt-04-basic-bs'],
    order: 2,
  },

  // Chapter 5: Sliding Window
  {
    id: 'pf-05-while-vs-if',
    chapterId: 'ch-05',
    title: 'Dùng lệnh if thay vì vòng lặp while khi thu hẹp cửa sổ trượt',
    type: 'edge-case',
    body: `Khi nạp một phần tử mới vào biên phải khiến cửa sổ bị vi phạm điều kiện, một lần dịch biên trái duy nhất (\`if condition: left += 1\`) có thể chưa đủ để đưa cửa sổ trở về trạng thái hợp lệ. Bắt buộc phải dùng vòng lặp \`while\` để thu hẹp cửa sổ liên tục cho đến khi điều kiện được khôi phục.

❌ **Cách viết sai:**
\`\`\`python
if count[ch] > 1: # Sai lầm: chỉ thu hẹp 1 bước duy nhất
    count[s[left]] -= 1
    left += 1
\`\`\`

✅ **Cách xử lý chuẩn mực:**
\`\`\`python
while count[ch] > 1: # Lặp liên tục cho đến khi cửa sổ hợp lệ hoàn toàn
    count[s[left]] -= 1
    left += 1
\`\`\``,
    code: {
      python: `count = {}
left = 0
max_len = 0
for right, ch in enumerate(s):
    count[ch] = count.get(ch, 0) + 1
    while count[ch] > 1: # Thu hẹp liên tục cho đến khi hết trùng lặp
        count[s[left]] -= 1
        left += 1
    max_len = max(max_len, right - left + 1)`,
      cpp: `std::unordered_map<char, int> count;
int left = 0, max_len = 0;
for (int right = 0; right < (int)s.size(); ++right) {
    count[s[right]]++;
    while (count[s[right]] > 1) { // Thu hẹp liên tục
        count[s[left]]--;
        left++;
    }
    max_len = std::max(max_len, right - left + 1);
}`,
    },
    patternIds: ['pt-05-variable-longest'],
    order: 1,
  },
  {
    id: 'pf-05-shortest-timing',
    chapterId: 'ch-05',
    title: 'Cập nhật đáp án sai thời điểm trong bài toán cửa sổ ngắn nhất',
    type: 'edge-case',
    body: `Khác với bài toán tìm cửa sổ dài nhất (cập nhật sau khi thu hẹp xong):
- Trong bài toán tìm cửa sổ ngắn nhất (ví dụ: Minimum Window Substring): ta phải cập nhật độ dài cực tiểu **ngay bên trong vòng lặp \`while\` khi cửa sổ vẫn còn đang hợp lệ**, trước khi dịch con trỏ \`left += 1\`.
- Nếu cập nhật sau vòng lặp \`while\`, cửa sổ lúc đó đã bị thu hẹp quá mức và mất đi tính hợp lệ.`,
    code: {
      python: `# Đúng: Cập nhật kết quả cực tiểu TRONG vòng lặp while khi còn hợp lệ
while have == need:
    if (right - left + 1) < min_len:
        min_len = right - left + 1
        best_window = (left, right)
    # Thu hẹp biên trái để tìm cửa sổ ngắn hơn
    window[s[left]] -= 1
    if s[left] in target_count and window[s[left]] < target_count[s[left]]:
        have -= 1
    left += 1`,
    },
    patternIds: ['pt-05-variable-shortest'],
    order: 2,
  },

  // Chapter 6: Linked List
  {
    id: 'pf-06-lost-next',
    chapterId: 'ch-06',
    title: 'Mất con trỏ next khi đảo ngược danh sách liên kết tại chỗ',
    type: 'memory',
    body: `Khi gán lệnh \`curr.next = prev\`, liên kết đến nút tiếp theo của danh sách gốc sẽ bị cắt đứt vĩnh viễn. Nếu không lưu tạm con trỏ kế tiếp vào một biến trung gian \`next_temp\` trước khi gán, chương trình sẽ làm mất toàn bộ phần còn lại của danh sách.

❌ **Cách viết sai (Mất liên kết):**
\`\`\`python
curr.next = prev
curr = curr.next # curr lúc này thành prev, gây vòng lặp vô hạn!
\`\`\`

✅ **Cách xử lý chuẩn mực (3 con trỏ):**
\`\`\`python
next_temp = curr.next # Bước 1: Lưu tạm con trỏ tiếp theo
curr.next = prev      # Bước 2: Đảo chiều mũi tên
prev = curr           # Bước 3: Tiến prev lên
curr = next_temp      # Bước 4: Tiến curr lên
\`\`\``,
    code: {
      python: `prev = None
curr = head
while curr:
    next_temp = curr.next # 1. Lưu con trỏ tiếp theo
    curr.next = prev      # 2. Đảo chiều
    prev = curr           # 3. Tiến prev
    curr = next_temp      # 4. Tiến curr
return prev`,
      cpp: `ListNode* prev = nullptr;
ListNode* curr = head;
while (curr != nullptr) {
    ListNode* nextTemp = curr->next; // 1. Lưu tạm
    curr->next = prev;              // 2. Đảo chiều
    prev = curr;                    // 3. Tiến prev
    curr = nextTemp;                // 4. Tiến curr
}
return prev;`,
    },
    patternIds: ['pt-06-reverse-in-place'],
    order: 1,
  },
  {
    id: 'pf-06-fast-slow-null',
    chapterId: 'ch-06',
    title: 'Lỗi con trỏ rỗng khi con trỏ nhanh nhảy 2 bước',
    type: 'edge-case',
    body: `Vì con trỏ nhanh nhảy 2 bước mỗi lần (\`fast = fast.next.next\`), nếu chỉ kiểm tra \`while fast != None\` thì khi \`fast\` là nút cuối cùng của danh sách có độ dài lẻ, \`fast.next\` sẽ là \`None\`. Lệnh \`fast.next.next\` sẽ lập tức văng lỗi \`AttributeError: 'NoneType' object has no attribute 'next'\` (hoặc SIGSEGV trong C++).
Bắt buộc phải kiểm tra cả hai điều kiện: \`while fast and fast.next:\`.`,
    code: {
      python: `# Bắt buộc kiểm tra cả fast và fast.next
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        return True
return False`,
      cpp: `ListNode* slow = head;
ListNode* fast = head;
while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true;
}
return false;`,
    },
    patternIds: ['pt-06-fast-slow'],
    order: 2,
  },
]

export const seedTemplates: Template[] = [
  // ==================== Chapter 1: Arrays & Hashing ====================
  {
    id: 'tpl-01-hashset',
    chapterId: 'ch-01',
    patternId: 'pt-01-hash-set',
    name: 'Hash Set Membership',
    whenToUse:
      'Khi cần kiểm tra sự tồn tại của phần tử hoặc phát hiện phần tử trùng lặp trong mảng với thời gian $O(1)$ cho mỗi thao tác tra cứu.',
    time: '$O(N)$',
    space: '$O(N)$',
    code: {
      py: `from typing import List, Set

def contains_duplicate(nums: List[int]) -> bool:
    """Kiểm tra mảng có chứa phần tử xuất hiện ít nhất 2 lần hay không.
    
    Time: O(N) | Space: O(N)
    """
    seen: Set[int] = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
      cpp: `#include <vector>
#include <unordered_set>

bool containsDuplicate(const std::vector<int>& nums) {
    std::unordered_set<int> seen;
    for (int num : nums) {
        if (seen.count(num)) {
            return true;
        }
        seen.insert(num);
    }
    return false;
}`,
    },
    notes:
      'Dùng Hash Set giúp giảm thời gian kiểm tra từ $O(N)$ của mảng xuống $O(1)$ thời gian trung bình.',
    order: 1,
  },
  {
    id: 'tpl-01-hashmap',
    chapterId: 'ch-01',
    patternId: 'pt-01-hash-map',
    name: 'Two Sum Pattern (Hash Map Complement)',
    whenToUse:
      'Khi cần tìm cặp phần tử có quan hệ tổng hoặc hiệu cho trước, hoặc kiểm tra sự tồn tại trong $O(1)$ thời gian.',
    time: '$O(N)$',
    space: '$O(N)$',
    code: {
      py: `from typing import List, Dict

def two_sum(nums: List[int], target: int) -> List[int]:
    """Tìm chỉ số hai số có tổng bằng target trong một lần duyệt.
    
    Time: O(N) | Space: O(N)
    """
    lookup: Dict[int, int] = {} # Ánh xạ: giá trị -> chỉ số
    
    for i, num in enumerate(nums):
        complement = target - num
        # Bước 1: Kiểm tra số bù đã xuất hiện trước đó chưa
        if complement in lookup:
            return [lookup[complement], i]
        # Bước 2: Lưu giá trị hiện tại cùng chỉ số vào bảng băm
        lookup[num] = i
        
    return []`,
      cpp: `#include <vector>
#include <unordered_map>

std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    // Ánh xạ: giá trị -> chỉ số
    std::unordered_map<int, int> lookup;
    
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        int complement = target - nums[i];
        // Bước 1: Tra cứu phần tử bù trong bảng băm
        auto it = lookup.find(complement);
        if (it != lookup.end()) {
            return {it->second, i};
        }
        // Bước 2: Lưu phần tử hiện tại vào bảng băm
        lookup[nums[i]] = i;
    }
    return {};
}`,
    },
    notes:
      'Có thể linh hoạt thay đổi công thức số bù: `diff = target - num` cho phép cộng, `target + num` cho phép trừ, hoặc kiểm tra chia hết.',
    order: 2,
  },
  {
    id: 'tpl-01-canonical-key',
    chapterId: 'ch-01',
    patternId: 'pt-01-canonical-key',
    name: 'Group Anagrams (Canonical Key)',
    whenToUse:
      'Khi cần gom nhóm các xâu/đối tượng có cùng phân phối tần suất ký tự hoặc cấu trúc tương đương về cùng một khóa đại diện.',
    time: '$O(N \\times K)$',
    space: '$O(N \\times K)$',
    code: {
      py: `from typing import List, Dict
from collections import defaultdict

def group_anagrams(strs: List[str]) -> List[List[str]]:
    """Gom nhóm các chuỗi đảo chữ bằng mảng tần số 26 ký tự làm khóa.
    
    Time: O(N * K) | Space: O(N * K)
    """
    ans: Dict[tuple, List[str]] = defaultdict(list)
    
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        # Ép kiểu count thành tuple để có thể băm (hashable)
        ans[tuple(count)].append(s)
        
    return list(ans.values())`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>

std::vector<std::vector<std::string>> groupAnagrams(const std::vector<std::string>& strs) {
    std::unordered_map<std::string, std::vector<std::string>> groups;
    
    for (const auto& s : strs) {
        std::string key(26, 0);
        for (char c : s) {
            key[c - 'a']++;
        }
        groups[key].push_back(s);
    }
    
    std::vector<std::vector<std::string>> result;
    for (auto& pair : groups) {
        result.push_back(std::move(pair.second));
    }
    return result;
}`,
    },
    notes:
      'Trong Python, mảng `list` không băm được nên cần chuyển thành `tuple`. Trong C++, chuỗi `std::string` độ dài 26 có thể làm key cho `unordered_map`.',
    order: 3,
  },
  {
    id: 'tpl-01-prefix-suffix',
    chapterId: 'ch-01',
    patternId: 'pt-01-prefix-suffix',
    name: 'Prefix & Suffix Accumulation',
    whenToUse:
      'Khi kết quả tại vị trí $i$ phụ thuộc vào tích/tổng của toàn bộ các phần tử bên trái $i$ và bên phải $i$ mà không được dùng phép chia.',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def product_except_self(nums: List[int]) -> List[int]:
    """Tính tích mảng ngoại trừ chính nó mà không dùng phép chia.
    
    Time: O(N) | Space: O(1) (không tính mảng kết quả)
    """
    n = len(nums)
    res = [1] * n
    
    # Lượt 1: Tính tích tiền tố Prefix từ trái qua phải
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
        
    # Lượt 2: Nhân dồn tích hậu tố Suffix từ phải qua trái
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
        
    return res`,
      cpp: `#include <vector>

std::vector<int> productExceptSelf(const std::vector<int>& nums) {
    int n = static_cast<int>(nums.size());
    std::vector<int> res(n, 1);
    
    // Lượt 1: Tích tiền tố
    int prefix = 1;
    for (int i = 0; i < n; ++i) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    
    // Lượt 2: Tích hậu tố
    int suffix = 1;
    for (int i = n - 1; i >= 0; --i) {
        res[i] *= suffix;
        suffix *= nums[i];
    }
    
    return res;
}`,
    },
    notes:
      'Tránh dùng phép chia giúp giải quyết triệt để trường hợp mảng có chứa các phần tử bằng $0$.',
    order: 4,
  },
  {
    id: 'tpl-01-bucket-sort',
    chapterId: 'ch-01',
    patternId: 'pt-01-bucket-sort',
    name: 'Top K Frequent Elements (Bucket Sort)',
    whenToUse:
      'Khi cần đếm tần suất và rút ra $K$ phần tử xuất hiện nhiều nhất trong thời gian tuyến tính $O(N)$.',
    time: '$O(N)$',
    space: '$O(N)$',
    code: {
      py: `from typing import List, Dict
from collections import Counter

def top_k_frequent(nums: List[int], k: int) -> List[int]:
    """Tìm K phần tử có tần suất cao nhất bằng Bucket Sort.
    
    Time: O(N) | Space: O(N)
    """
    count: Dict[int, int] = Counter(nums)
    # Mảng buckets: chỉ số là tần suất (từ 0 đến N)
    freq_buckets: List[List[int]] = [[] for _ in range(len(nums) + 1)]
    
    for num, cnt in count.items():
        freq_buckets[cnt].append(num)
        
    res: List[int] = []
    # Duyệt ngược từ tần suất cao nhất về 1
    for i in range(len(freq_buckets) - 1, 0, -1):
        for num in freq_buckets[i]:
            res.append(num)
            if len(res) == k:
                return res
    return res`,
      cpp: `#include <vector>
#include <unordered_map>

std::vector<int> topKFrequent(const std::vector<int>& nums, int k) {
    std::unordered_map<int, int> count;
    for (int num : nums) {
        count[num]++;
    }
    
    int n = static_cast<int>(nums.size());
    std::vector<std::vector<int>> buckets(n + 1);
    for (const auto& pair : count) {
        buckets[pair.second].push_back(pair.first);
    }
    
    std::vector<int> res;
    for (int i = n; i > 0; --i) {
        for (int num : buckets[i]) {
            res.push_back(num);
            if (static_cast<int>(res.size()) == k) {
                return res;
            }
        }
    }
    return res;
}`,
    },
    notes:
      'Bucket Sort sử dụng tần suất làm chỉ số mảng giúp đạt độ phức tạp $O(N)$, vượt trội hơn so với Heap $O(N \\log K)$ hoặc Sắp xếp $O(N \\log N)$.',
    order: 5,
  },

  // ==================== Chapter 2: Two Pointers ====================
  {
    id: 'tpl-02-opposite',
    chapterId: 'ch-02',
    patternId: 'pt-02-opposite-ends',
    name: 'Opposite Ends Two Pointers',
    whenToUse:
      'Áp dụng trên mảng đã sắp xếp để tìm cặp số thỏa mãn điều kiện hoặc bài toán tối ưu diện tích Container With Most Water / Trapping Water.',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def two_sum_sorted(arr: List[int], target: int) -> List[int]:
    """Tìm hai con trỏ đối xứng trên mảng đã sắp xếp.
    
    Time: O(N) | Space: O(1)
    """
    left: int = 0
    right: int = len(arr) - 1
    
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1  # Tổng nhỏ -> dịch con trỏ trái sang phải để tăng tổng
        else:
            right -= 1 # Tổng lớn -> dịch con trỏ phải sang trái để giảm tổng
            
    return []`,
      cpp: `#include <vector>

std::vector<int> twoSumSorted(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            left++;  // Tăng tổng
        } else {
            right--; // Giảm tổng
        }
    }
    return {};
}`,
    },
    notes:
      'Nếu mảng đầu vào chưa sắp xếp, có thể gọi hàm sắp xếp trước với chi phí $O(N \\log N)$ rồi mới áp dụng mẫu này.',
    order: 1,
  },
  {
    id: 'tpl-02-k-sum',
    chapterId: 'ch-02',
    patternId: 'pt-02-k-sum',
    name: 'K-Sum Pattern (3Sum / 4Sum)',
    whenToUse:
      'Khi cần tìm tất cả các bộ $K$ số có tổng bằng target mà không bị trùng lặp kết quả trong kết quả trả về.',
    time: '$O(N^2)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def three_sum(nums: List[int]) -> List[List[int]]:
    """Tìm tất cả bộ 3 số có tổng bằng 0 không trùng lặp.
    
    Time: O(N^2) | Space: O(1) (không tính mảng kết quả)
    """
    nums.sort()
    res: List[List[int]] = []
    
    for i in range(len(nums) - 2):
        # Bỏ qua giá trị trùng ở vòng lặp ngoài
        if i > 0 and nums[i] == nums[i - 1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                res.append([nums[i], nums[left], nums[right]])
                # Khử trùng lặp ở hai con trỏ trong
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
                
    return res`,
      cpp: `#include <vector>
#include <algorithm>

std::vector<std::vector<int>> threeSum(std::vector<int>& nums) {
    std::sort(nums.begin(), nums.end());
    std::vector<std::vector<int>> res;
    int n = static_cast<int>(nums.size());
    
    for (int i = 0; i < n - 2; ++i) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int left = i + 1, right = n - 1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total < 0) {
                left++;
            } else if (total > 0) {
                right--;
            } else {
                res.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            }
        }
    }
    return res;
}`,
    },
    notes:
      'Chú ý phải bỏ qua các phần tử trùng lặp ở cả hai cấp độ (vòng ngoài và hai con trỏ trong) để tránh kết quả bị trùng.',
    order: 2,
  },
  {
    id: 'tpl-02-read-write',
    chapterId: 'ch-02',
    patternId: 'pt-02-read-write',
    name: 'Fast & Slow Pointers In-place',
    whenToUse:
      'Khi cần biến đổi mảng tại chỗ với bộ nhớ phụ $O(1)$ (ví dụ: xóa trùng lặp, chuyển số 0 về cuối mảng).',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def remove_duplicates(nums: List[int]) -> int:
    """Xóa trùng lặp trong mảng đã sắp xếp tại chỗ.
    
    Time: O(N) | Space: O(1)
    """
    if not nums:
        return 0
        
    write_ptr = 1 # Con trỏ ghi vị trí hợp lệ kế tiếp
    
    for read_ptr in range(1, len(nums)):
        if nums[read_ptr] != nums[read_ptr - 1]:
            nums[write_ptr] = nums[read_ptr]
            write_ptr += 1
            
    return write_ptr`,
      cpp: `#include <vector>

int removeDuplicates(std::vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int writePtr = 1;
    for (int readPtr = 1; readPtr < static_cast<int>(nums.size()); ++readPtr) {
        if (nums[readPtr] != nums[readPtr - 1]) {
            nums[writePtr] = nums[readPtr];
            writePtr++;
        }
    }
    return writePtr;
}`,
    },
    notes:
      'Con trỏ đọc `read_ptr` duyệt qua toàn bộ dữ liệu, trong khi con trỏ ghi `write_ptr` chỉ tiến lên khi gặp dữ liệu hợp lệ.',
    order: 3,
  },

  // ==================== Chapter 3: Stack ====================
  {
    id: 'tpl-03-matching',
    chapterId: 'ch-03',
    patternId: 'pt-03-matching',
    name: 'Parentheses Matching',
    whenToUse:
      'Khi cần kiểm tra tính hợp lệ của các cấu trúc lồng nhau như cặp dấu ngoặc `()`, `{}`, `[]` hoặc thẻ đóng mở HTML/XML.',
    time: '$O(N)$',
    space: '$O(N)$',
    code: {
      py: `from typing import List, Dict

def is_valid_parentheses(s: str) -> bool:
    """Kiểm tra chuỗi ngoặc lồng nhau có hợp lệ hay không.
    
    Time: O(N) | Space: O(N)
    """
    stack: List[str] = []
    mapping: Dict[str, str] = {')': '(', '}': '{', ']': '['}
    
    for ch in s:
        if ch in mapping:
            # Ngoặc đóng: Pop phần tử đỉnh stack để so sánh
            top = stack.pop() if stack else '#'
            if top != mapping[ch]:
                return False
        else:
            # Ngoặc mở: Push vào stack
            stack.append(ch)
            
    return len(stack) == 0`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>

bool isValidParentheses(const std::string& s) {
    std::stack<char> st;
    std::unordered_map<char, char> mapping = {
        {')', '('},
        {'}', '{'},
        {']', '['}
    };
    
    for (char ch : s) {
        if (mapping.count(ch)) {
            if (st.empty() || st.top() != mapping[ch]) {
                return false;
            }
            st.pop();
        } else {
            st.push(ch);
        }
    }
    return st.empty();
}`,
    },
    notes:
      'Bắt buộc kiểm tra `len(stack) == 0` ở cuối bài để xử lý các trường hợp chuỗi còn dư ngoặc mở như `"((("`.',
    order: 1,
  },
  {
    id: 'tpl-03-monotonic',
    chapterId: 'ch-03',
    patternId: 'pt-03-monotonic-stack',
    name: 'Monotonic Decreasing Stack (Next Greater Element)',
    whenToUse:
      'Tìm phần tử lớn hơn đầu tiên ở bên phải hoặc bên trái cho mọi vị trí trong mảng trong $O(N)$.',
    time: '$O(N)$',
    space: '$O(N)$',
    code: {
      py: `from typing import List

def next_greater_elements(nums: List[int]) -> List[int]:
    """Tìm phần tử lớn hơn kế tiếp bên phải cho từng vị trí.
    
    Time: O(N) | Space: O(N)
    """
    n = len(nums)
    result: List[int] = [-1] * n
    stack: List[int] = [] # Lưu trữ chỉ số (indices), giá trị giảm dần
    
    for i in range(n):
        # Bước 1: Khi phần tử hiện tại lớn hơn phần tử đỉnh stack
        while stack and nums[i] > nums[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = nums[i]
        # Bước 2: Đẩy chỉ số hiện tại vào stack
        stack.append(i)
        
    return result`,
      cpp: `#include <vector>
#include <stack>

std::vector<int> nextGreaterElements(const std::vector<int>& nums) {
    int n = static_cast<int>(nums.size());
    std::vector<int> result(n, -1);
    std::stack<int> st; // Lưu chỉ số
    
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int prevIdx = st.top();
            st.pop();
            result[prevIdx] = nums[i];
        }
        st.push(i);
    }
    return result;
}`,
    },
    notes:
      'Lưu chỉ số (`index`) thay vì lưu giá trị (`value`) vào stack giúp ta vừa tính được khoảng cách chỉ số vừa gán được kết quả trực tiếp.',
    order: 2,
  },
  {
    id: 'tpl-03-expression-eval',
    chapterId: 'ch-03',
    patternId: 'pt-03-expression-eval',
    name: 'Reverse Polish Notation Evaluation',
    whenToUse:
      'Khi cần tính toán giá trị biểu thức toán học biểu diễn ở dạng ký pháp Ba Lan ngược (RPN).',
    time: '$O(N)$',
    space: '$O(N)$',
    code: {
      py: `from typing import List

def eval_rpn(tokens: List[str]) -> int:
    """Đánh giá giá trị biểu thức Ba Lan ngược (RPN).
    
    Time: O(N) | Space: O(N)
    """
    stack: List[int] = []
    
    for token in tokens:
        if token in {"+", "-", "*", "/"}:
            b = stack.pop() # Toán hạng thứ hai
            a = stack.pop() # Toán hạng thứ nhất
            if token == "+":
                stack.append(a + b)
            elif token == "-":
                stack.append(a - b)
            elif token == "*":
                stack.append(a * b)
            elif token == "/":
                # Chú ý: int(a / b) làm tròn về 0 đúng chuẩn LeetCode
                stack.append(int(a / b))
        else:
            stack.append(int(token))
            
    return stack[0]`,
      cpp: `#include <vector>
#include <string>
#include <stack>

int evalRPN(const std::vector<std::string>& tokens) {
    std::stack<int> st;
    
    for (const std::string& token : tokens) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else if (token == "/") st.push(a / b);
        } else {
            st.push(std::stoi(token));
        }
    }
    return st.top();
}`,
    },
    notes:
      'Chú ý thứ tự toán hạng: phần tử pop ra trước là $b$ (số chia), phần tử pop ra sau là $a$ (số bị chia). Phép chia Python dùng `int(a / b)` để cắt phần thập phân về 0.',
    order: 3,
  },

  // ==================== Chapter 4: Binary Search ====================
  {
    id: 'tpl-04-basic-bs',
    chapterId: 'ch-04',
    patternId: 'pt-04-basic-bs',
    name: 'Standard Binary Search',
    whenToUse:
      'Khi cần tìm vị trí của một phần tử target trong mảng hoặc ma trận đã sắp xếp tăng dần.',
    time: '$O(\\log N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def binary_search(nums: List[int], target: int) -> int:
    """Tìm kiếm nhị phân chuẩn trên mảng đã sắp xếp.
    
    Time: O(log N) | Space: O(1)
    """
    left: int = 0
    right: int = len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
      cpp: `#include <vector>

int binarySearch(const std::vector<int>& nums, int target) {
    int left = 0;
    int right = static_cast<int>(nums.size()) - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    },
    notes:
      'Luôn tính `mid = left + (right - left) // 2` để tránh nguy cơ tràn số nguyên trong các ngôn ngữ như C++.',
    order: 1,
  },
  {
    id: 'tpl-04-binary-search',
    chapterId: 'ch-04',
    patternId: 'pt-04-bound',
    name: 'Binary Search Lower Bound',
    whenToUse:
      'Tìm vị trí phần tử đầu tiên thỏa mãn điều kiện $feasible(x)$ hoặc tìm vị trí chèn Insert Position.',
    time: '$O(\\log N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def lower_bound(nums: List[int], target: int) -> int:
    """Tìm chỉ số nhỏ nhất sao cho nums[i] >= target.
    
    Time: O(log N) | Space: O(1)
    """
    left: int = 0
    right: int = len(nums) # Nửa khoảng [left, right)
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] >= target:
            right = mid     # Nghiệm tiềm năng, thu hẹp nửa phải
        else:
            left = mid + 1  # Không thỏa mãn, chuyển sang nửa sau
            
    return left # left luôn trỏ vào phần tử đầu tiên >= target`,
      cpp: `#include <vector>

int lowerBound(const std::vector<int>& nums, int target) {
    int left = 0;
    int right = static_cast<int>(nums.size());
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
    },
    notes:
      'Mẫu nửa khoảng `[left, right)` đảm bảo không bao giờ bị lặp vô hạn và khi kết thúc vòng lặp `left == right`.',
    order: 2,
  },
  {
    id: 'tpl-04-bs-answer',
    chapterId: 'ch-04',
    patternId: 'pt-04-bs-answer',
    name: 'Binary Search on Answer (Parametric Search)',
    whenToUse:
      'Khi cần tìm giá trị nhỏ nhất hoặc lớn nhất của một tham số $k$ sao cho hàm kiểm tra tính khả thi $feasible(k)$ là đơn điệu.',
    time: '$O(N \\log (high - low))$',
    space: '$O(1)$',
    code: {
      py: `from typing import List
import math

def min_eating_speed(piles: List[int], h: int) -> int:
    """Bài toán Koko Eating Bananas - Tìm tốc độ ăn nhỏ nhất thỏa mãn trong h giờ.
    
    Time: O(N * log(max_pile)) | Space: O(1)
    """
    def feasible(speed: int) -> bool:
        # Tính tổng số giờ cần với tốc độ speed
        hours = sum(math.ceil(p / speed) for p in piles)
        return hours <= h

    left = 1
    right = max(piles)
    
    while left < right:
        mid = left + (right - left) // 2
        if feasible(mid):
            right = mid     # Thử tốc độ nhỏ hơn
        else:
            left = mid + 1  # Tốc độ quá chậm, phải tăng lên
            
    return left`,
      cpp: `#include <vector>
#include <algorithm>

bool feasible(const std::vector<int>& piles, int speed, int h) {
    long long hours = 0;
    for (int p : piles) {
        hours += (p + speed - 1) / speed; // Tính ceil(p / speed) bằng số nguyên
    }
    return hours <= h;
}

int minEatingSpeed(const std::vector<int>& piles, int h) {
    int left = 1;
    int right = *std::max_element(piles.begin(), piles.end());
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (feasible(piles, mid, h)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
    },
    notes:
      'Tính chất đơn điệu: Nếu tốc độ $k$ thỏa mãn, mọi tốc độ $> k$ đều thỏa mãn. Điều này cho phép áp dụng Tìm kiếm nhị phân trên không gian đáp án.',
    order: 3,
  },
  {
    id: 'tpl-04-rotated-array',
    chapterId: 'ch-04',
    patternId: 'pt-04-rotated-array',
    name: 'Rotated Sorted Array Search',
    whenToUse:
      'Khi mảng đã sắp xếp bị xoay tại một điểm uốn (pivot) và cần tìm vị trí target trong thời gian $O(\\log N)$.',
    time: '$O(\\log N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def search_rotated(nums: List[int], target: int) -> int:
    """Tìm target trong mảng đã sắp xếp bị xoay.
    
    Time: O(log N) | Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
            
        # Kiểm tra nửa bên trái có được sắp xếp tuần tự hay không
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Nửa bên phải được sắp xếp tuần tự
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
                
    return -1`,
      cpp: `#include <vector>

int searchRotated(const std::vector<int>& nums, int target) {
    int left = 0, right = static_cast<int>(nums.size()) - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,
    },
    notes:
      'Khi chia đôi mảng xoay, luôn có ít nhất một nửa (trái hoặc phải) giữ nguyên trật tự sắp xếp tăng dần. Dùng nửa đó để phân loại vị trí của target.',
    order: 4,
  },

  // ==================== Chapter 5: Sliding Window ====================
  {
    id: 'tpl-05-fixed-window',
    chapterId: 'ch-05',
    patternId: 'pt-05-fixed-window',
    name: 'Fixed-Size Sliding Window',
    whenToUse:
      'Khi cần tính toán các chỉ số (như tổng lớn nhất, hoán vị xâu) trên mọi mảng con có kích thước cố định $K$.',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import List

def max_sub_array_sum(nums: List[int], k: int) -> int:
    """Tìm tổng lớn nhất của mảng con có độ dài cố định k.
    
    Time: O(N) | Space: O(1)
    """
    if len(nums) < k:
        return 0
        
    # Tính tổng cửa sổ đầu tiên
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Trượt cửa sổ từ vị trí k đến hết mảng
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum`,
      cpp: `#include <vector>
#include <numeric>
#include <algorithm>

int maxSubArraySum(const std::vector<int>& nums, int k) {
    int n = static_cast<int>(nums.size());
    if (n < k) return 0;
    
    int windowSum = 0;
    for (int i = 0; i < k; ++i) {
        windowSum += nums[i];
    }
    int maxSum = windowSum;
    
    for (int i = k; i < n; ++i) {
        windowSum += nums[i] - nums[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    return maxSum;
}`,
    },
    notes:
      'Mỗi bước trượt cửa sổ chỉ tốn $O(1)$ bằng cách cộng thêm phần tử mới ở biên phải và trừ đi phần tử cũ ở biên trái.',
    order: 1,
  },
  {
    id: 'tpl-05-sliding-window',
    chapterId: 'ch-05',
    patternId: 'pt-05-variable-longest',
    name: 'Variable Sliding Window (Longest)',
    whenToUse:
      'Tìm độ dài lớn nhất của mảng con hoặc chuỗi con liên tục thỏa mãn một điều kiện cho trước.',
    time: '$O(N)$',
    space: '$O(\\Sigma)$',
    code: {
      py: `from typing import Dict

def longest_substring_k_distinct(s: str, k: int) -> int:
    """Tìm độ dài chuỗi con dài nhất có tối đa k ký tự khác nhau.
    
    Time: O(N) | Space: O(K)
    """
    counts: Dict[str, int] = {}
    left: int = 0
    max_len: int = 0
    
    for right, ch in enumerate(s):
        # Bước 1: Nạp phần tử biên phải vào cửa sổ
        counts[ch] = counts.get(ch, 0) + 1
        
        # Bước 2: Thu hẹp biên trái khi cửa sổ vi phạm điều kiện
        while len(counts) > k:
            counts[s[left]] -= 1
            if counts[s[left]] == 0:
                del counts[s[left]]
            left += 1
            
        # Bước 3: Cập nhật kết quả cực đại khi cửa sổ đã hợp lệ
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

int longestSubstringKDistinct(const std::string& s, int k) {
    std::unordered_map<char, int> counts;
    int left = 0;
    int maxLen = 0;
    
    for (int right = 0; right < static_cast<int>(s.size()); ++right) {
        counts[s[right]]++;
        
        while (static_cast<int>(counts.size()) > k) {
            counts[s[left]]--;
            if (counts[s[left]] == 0) {
                counts.erase(s[left]);
            }
            left++;
        }
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    },
    notes:
      'Với bài toán tìm cửa sổ dài nhất, ta cập nhật kết quả sau khi cửa sổ đã được thu hẹp về trạng thái hợp lệ.',
    order: 2,
  },
  {
    id: 'tpl-05-variable-shortest',
    chapterId: 'ch-05',
    patternId: 'pt-05-variable-shortest',
    name: 'Variable Sliding Window (Shortest)',
    whenToUse:
      'Tìm độ dài nhỏ nhất của cửa sổ con liên tục thỏa mãn điều kiện (ví dụ: Minimum Window Substring).',
    time: '$O(N)$',
    space: '$O(\\Sigma)$',
    code: {
      py: `from typing import Dict
from collections import Counter

def min_window(s: str, t: str) -> str:
    """Tìm chuỗi con ngắn nhất của s chứa đủ các ký tự của t.
    
    Time: O(N) | Space: O(Sigma)
    """
    if not t or not s:
        return ""
        
    target_count = Counter(t)
    window: Dict[str, int] = {}
    
    have, need = 0, len(target_count)
    res, res_len = [-1, -1], float("inf")
    left = 0
    
    for right in range(len(s)):
        ch = s[right]
        window[ch] = window.get(ch, 0) + 1
        
        if ch in target_count and window[ch] == target_count[ch]:
            have += 1
            
        # Khi cửa sổ đã hợp lệ, liên tục thu hẹp biên trái để tìm cửa sổ cực tiểu
        while have == need:
            if (right - left + 1) < res_len:
                res = [left, right]
                res_len = right - left + 1
                
            window[s[left]] -= 1
            if s[left] in target_count and window[s[left]] < target_count[s[left]]:
                have -= 1
            left += 1
            
    l, r = res
    return s[l : r + 1] if res_len != float("inf") else ""`,
      cpp: `#include <string>
#include <unordered_map>
#include <climits>

std::string minWindow(std::string s, std::string t) {
    if (s.empty() || t.empty()) return "";
    
    std::unordered_map<char, int> targetCount, window;
    for (char c : t) targetCount[c]++;
    
    int have = 0, need = static_cast<int>(targetCount.size());
    int minLen = INT_MAX, minStart = 0;
    int left = 0;
    
    for (int right = 0; right < static_cast<int>(s.size()); ++right) {
        char c = s[right];
        window[c]++;
        
        if (targetCount.count(c) && window[c] == targetCount[c]) {
            have++;
        }
        
        while (have == need) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            char leftChar = s[left];
            window[leftChar]--;
            if (targetCount.count(leftChar) && window[leftChar] < targetCount[leftChar]) {
                have--;
            }
            left++;
        }
    }
    return minLen == INT_MAX ? "" : s.substr(minStart, minLen);
}`,
    },
    notes:
      'Với bài toán tìm cửa sổ ngắn nhất, ta cập nhật `min_len` ngay bên trong vòng lặp `while` khi cửa sổ còn hợp lệ.',
    order: 3,
  },

  // ==================== Chapter 6: Linked List ====================
  {
    id: 'tpl-06-reverse-linkedlist',
    chapterId: 'ch-06',
    patternId: 'pt-06-reverse-in-place',
    name: 'Reverse Linked List In-place',
    whenToUse:
      'Đảo ngược danh sách liên kết đơn tại chỗ với bộ nhớ $O(1)$.',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """Đảo ngược danh sách liên kết đơn tại chỗ.
    
    Time: O(N) | Space: O(1)
    """
    prev: Optional[ListNode] = None
    curr: Optional[ListNode] = head
    
    while curr:
        next_temp = curr.next  # Bước 1: Lưu con trỏ tiếp theo
        curr.next = prev       # Bước 2: Đảo chiều mũi tên
        prev = curr            # Bước 3: Tiến prev lên
        curr = next_temp       # Bước 4: Tiến curr lên
        
    return prev`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    },
    notes:
      'Cần sử dụng 3 con trỏ `prev`, `curr`, `next_temp` để không làm mất liên kết tới phần còn lại của danh sách.',
    order: 1,
  },
  {
    id: 'tpl-06-dummy-node',
    chapterId: 'ch-06',
    patternId: 'pt-06-dummy-node',
    name: 'Dummy Node Technique (Merge Two Lists)',
    whenToUse:
      'Khi cần tạo danh sách liên kết mới (trộn hai danh sách, xóa nút head) để tránh rẽ nhánh kiểm tra nút rỗng.',
    time: '$O(N + M)$',
    space: '$O(1)$',
    code: {
      py: `from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def merge_two_lists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    """Trộn hai danh sách liên kết đã sắp xếp bằng Dummy Node.
    
    Time: O(N + M) | Space: O(1)
    """
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
        
    # Nối phần còn lại của danh sách chưa duyệt hết
    tail.next = l1 if l1 else l2
    return dummy.next`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (l1 != nullptr && l2 != nullptr) {
        if (l1->val <= l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    
    tail->next = (l1 != nullptr) ? l1 : l2;
    return dummy.next;
}`,
    },
    notes:
      'Sử dụng `dummy node` giúp loại bỏ hoàn toàn các câu lệnh kiểm tra `if head is None` ban đầu.',
    order: 2,
  },
  {
    id: 'tpl-06-fast-slow',
    chapterId: 'ch-06',
    patternId: 'pt-06-fast-slow',
    name: 'Floyd Fast & Slow Pointers',
    whenToUse:
      'Khi cần tìm nút trung điểm hoặc phát hiện chu trình khép kín trong danh sách liên kết với $O(1)$ bộ nhớ.',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def has_cycle(head: Optional[ListNode]) -> bool:
    """Phát hiện chu trình trong danh sách liên kết (Thuật toán rùa và thỏ).
    
    Time: O(N) | Space: O(1)
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next          # Rùa đi 1 bước
        fast = fast.next.next     # Thỏ đi 2 bước
        if slow == fast:
            return True
            
    return False

def find_middle(head: Optional[ListNode]) -> Optional[ListNode]:
    """Tìm nút trung điểm của danh sách liên kết."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

ListNode* findMiddle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
    },
    notes:
      'Bắt buộc phải kiểm tra điều kiện `while fast and fast.next:` để tránh văng lỗi truy cập con trỏ rỗng (`NullPointerException`).',
    order: 3,
  },
  {
    id: 'tpl-06-merge-reorder',
    chapterId: 'ch-06',
    patternId: 'pt-06-merge-reorder',
    name: 'Reorder List (Split, Reverse & Interleave)',
    whenToUse:
      'Khi cần sắp xếp lại danh sách liên kết theo dạng $L_0 \\to L_n \\to L_1 \\to L_{n-1} \\dots$ tại chỗ.',
    time: '$O(N)$',
    space: '$O(1)$',
    code: {
      py: `from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def reorder_list(head: Optional[ListNode]) -> None:
    """Sắp xếp lại danh sách xen kẽ L0 -> Ln -> L1 -> Ln-1... tại chỗ.
    
    Time: O(N) | Space: O(1)
    """
    if not head or not head.next:
        return
        
    # Bước 1: Tìm trung điểm và ngắt đôi danh sách
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    second = slow.next
    slow.next = None # Ngắt đôi danh sách
    
    # Bước 2: Đảo ngược nửa sau danh sách
    prev = None
    curr = second
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second = prev
    
    # Bước 3: Trộn xen kẽ hai nửa danh sách
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first = tmp1
        second = tmp2`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

void reorderList(ListNode* head) {
    if (head == nullptr || head->next == nullptr) return;
    
    // Bước 1: Tìm trung điểm
    ListNode* slow = head;
    ListNode* fast = head->next;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    ListNode* second = slow->next;
    slow->next = nullptr;
    
    // Bước 2: Đảo ngược nửa sau
    ListNode* prev = nullptr;
    ListNode* curr = second;
    while (curr != nullptr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    second = prev;
    
    // Bước 3: Trộn xen kẽ
    ListNode* first = head;
    while (second != nullptr) {
        ListNode* tmp1 = first->next;
        ListNode* tmp2 = second->next;
        first->next = second;
        second->next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
    },
    notes:
      'Kết hợp 3 kỹ thuật nền tảng: Fast & Slow Pointers $\\to$ Reverse Linked List $\\to$ Interleave Nodes.',
    order: 4,
  },
]

export const seedProblems: Problem[] = [
  // Chapter 1: Arrays & Hashing
  {
    id: 'prob-01-217',
    chapterId: 'ch-01',
    title: 'Contains Duplicate',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    neetcodeUrl: 'https://neetcode.io/problems/duplicate-integer',
    patternIds: ['pt-01-hash-set'],
    hint: `- **Tầng 1 (Tư duy):** Kiểm tra xem phần tử hiện tại đã từng xuất hiện ở quá khứ hay chưa.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`HashSet\` để đạt thời gian kiểm tra và chèn trung bình $O(1)$.
- **Tầng 3 (Kỹ thuật then chốt):** Duyệt từng số $x$; nếu $x \\in \\text{seen}$ trả về \`True\` ngay lập tức; ngược lại thêm $x$ vào \`seen\`.`,
    order: 1,
  },
  {
    id: 'prob-01-1',
    chapterId: 'ch-01',
    title: 'Two Sum',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    neetcodeUrl: 'https://neetcode.io/problems/two-integer-sum',
    patternIds: ['pt-01-hash-map'],
    hint: `- **Tầng 1 (Tư duy):** Với mỗi số $x$, ta tìm xem số bù $target - x$ có nằm trong mảng hay không.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`HashMap\` lưu ánh xạ \`giá trị -> chỉ số\` để tìm số bù trong $O(1)$.
- **Tầng 3 (Kỹ thuật then chốt):** Áp dụng One-pass: kiểm tra $target - x$ trong map trước khi ghi nhận chính $x$ vào map để tránh dùng lại một phần tử 2 lần.`,
    order: 2,
  },
  {
    id: 'prob-01-49',
    chapterId: 'ch-01',
    title: 'Group Anagrams',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    neetcodeUrl: 'https://neetcode.io/problems/anagram-groups',
    patternIds: ['pt-01-canonical-key'],
    hint: `- **Tầng 1 (Tư duy):** Hai chuỗi là đảo chữ của nhau khi và chỉ khi chúng có cùng phân phối tần suất các chữ cái.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`HashMap<CanonicalKey, List<String>>\` để gom nhóm.
- **Tầng 3 (Kỹ thuật then chốt):** Tạo khóa đại diện bằng mảng tần số 26 ký tự chuyển thành tuple \`tuple(count)\` đạt $O(K)$, hoặc sắp xếp xâu \`"".join(sorted(s))\` đạt $O(K \\log K)$.`,
    order: 3,
  },
  {
    id: 'prob-01-347',
    chapterId: 'ch-01',
    title: 'Top K Frequent Elements',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
    neetcodeUrl: 'https://neetcode.io/problems/top-k-elements-in-list',
    patternIds: ['pt-01-hash-map', 'pt-01-bucket-sort'],
    hint: `- **Tầng 1 (Tư duy):** Đếm tần số xuất hiện của từng phần tử, sau đó lọc ra $K$ phần tử có tần số lớn nhất.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`HashMap\` đếm tần suất, sau đó dùng kỹ thuật \`Bucket Sort\` với chỉ số mảng chính là tần suất (từ $0$ đến $N$).
- **Tầng 3 (Kỹ thuật then chốt):** Duyệt ngược mảng bucket từ tần suất cao nhất $N$ về $1$ để thu thập đủ $K$ phần tử mà không cần sắp xếp, đạt $O(N)$ thời gian.`,
    order: 4,
  },
  {
    id: 'prob-01-238',
    chapterId: 'ch-01',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    neetcodeUrl: 'https://neetcode.io/problems/products-of-array-discluding-self',
    patternIds: ['pt-01-prefix-suffix'],
    hint: `- **Tầng 1 (Tư duy):** Tích của mọi phần tử trừ $A[i]$ chính bằng tích các phần tử bên trái $i$ nhân với tích các phần tử bên phải $i$.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng mảng kết quả để lưu tích tiền tố Prefix, và dùng một biến tích lũy tích hậu tố Suffix.
- **Tầng 3 (Kỹ thuật then chốt):** Quét lượt 1 từ trái sang phải tính prefix; quét lượt 2 từ phải sang trái nhân dồn biến suffix vào kết quả để đạt $O(1)$ bộ nhớ phụ (ngoại trừ mảng output).`,
    order: 5,
  },

  // Chapter 2: Two Pointers
  {
    id: 'prob-02-125',
    chapterId: 'ch-02',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    neetcodeUrl: 'https://neetcode.io/problems/is-palindrome',
    patternIds: ['pt-02-opposite-ends'],
    hint: `- **Tầng 1 (Tư duy):** Một xâu là đối xứng nếu đọc từ hai đầu về giữa luôn gặp các ký tự giống nhau.
- **Tầng 2 (Cấu trúc dữ liệu):** Hai con trỏ \`left = 0\`, \`right = len(s) - 1\`, không cần tạo bản sao xâu mới.
- **Tầng 3 (Kỹ thuật then chốt):** Bỏ qua ký tự không phải chữ/số bằng \`isalnum()\`, chuyển ký tự về chữ thường và so sánh; nếu khác nhau trả về \`False\`.`,
    order: 1,
  },
  {
    id: 'prob-02-167',
    chapterId: 'ch-02',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    neetcodeUrl: 'https://neetcode.io/problems/two-integer-sum-ii',
    patternIds: ['pt-02-opposite-ends'],
    hint: `- **Tầng 1 (Tư duy):** Tận dụng tính chất mảng đã sắp xếp tăng dần để giảm không gian tìm kiếm.
- **Tầng 2 (Cấu trúc dữ liệu):** Hai con trỏ xuất phát từ hai đầu mảng: \`left = 0\`, \`right = len(nums) - 1\`.
- **Tầng 3 (Kỹ thuật then chốt):** Nếu tổng $nums[l] + nums[r] < target$, tăng $l$ để tăng tổng; nếu tổng $> target$, giảm $r$ để giảm tổng; nếu bằng thì trả về kết quả (1-indexed).`,
    order: 2,
  },
  {
    id: 'prob-02-15',
    chapterId: 'ch-02',
    title: '3Sum',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    neetcodeUrl: 'https://neetcode.io/problems/three-integer-sum',
    patternIds: ['pt-02-k-sum'],
    hint: `- **Tầng 1 (Tư duy):** Quy bài toán 3Sum về chuỗi bài toán Two Sum bằng cách sắp xếp mảng và cố định phần tử thứ nhất.
- **Tầng 2 (Cấu trúc dữ liệu):** Sắp xếp mảng trong $O(N \\log N)$, sau đó dùng vòng lặp for kết hợp hai con trỏ đối xứng.
- **Tầng 3 (Kỹ thuật then chốt):** Khử trùng lặp: bỏ qua $nums[i] == nums[i-1]$ ở vòng ngoài, và sau khi tìm thấy bộ số hợp lệ thì dùng \`while\` bỏ qua toàn bộ số trùng lặp ở cả hai con trỏ $l$ và $r$.`,
    order: 3,
  },
  {
    id: 'prob-02-11',
    chapterId: 'ch-02',
    title: 'Container With Most Water',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    neetcodeUrl: 'https://neetcode.io/problems/max-water-container',
    patternIds: ['pt-02-opposite-ends'],
    hint: `- **Tầng 1 (Tư duy):** Diện tích nước bị giới hạn bởi vách thấp hơn: $\\text{Area} = (r - l) \\times \\min(h[l], h[r])$.
- **Tầng 2 (Cấu trúc dữ liệu):** Hai con trỏ bắt đầu từ hai đầu mảng có khoảng cách chiều rộng lớn nhất.
- **Tầng 3 (Kỹ thuật then chốt):** Luôn dịch chuyển con trỏ ở vách thấp hơn vào trong, vì giữ lại vách thấp hơn trong khi khoảng cách giảm sẽ không bao giờ tạo ra diện tích lớn hơn.`,
    order: 4,
  },
  {
    id: 'prob-02-42',
    chapterId: 'ch-02',
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    neetcodeUrl: 'https://neetcode.io/problems/trapping-rain-water',
    patternIds: ['pt-02-opposite-ends'],
    hint: `- **Tầng 1 (Tư duy):** Lượng nước đọng tại cột $i$ được quyết định bởi $\\min(\\text{max\\_left}, \\text{max\\_right}) - height[i]$.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng hai con trỏ đối xứng cùng 2 biến lưu đỉnh cao nhất từ hai phía: \`max_left\`, \`max_right\`.
- **Tầng 3 (Kỹ thuật then chốt):** Nếu \`max_left < max_right\`, lượng nước tại con trỏ trái được quyết định bởi \`max_left\` (không phụ thuộc vào các đỉnh ở giữa), ta tính nước tại \`left\` và tăng \`left++\`; ngược lại xử lý bên phải.`,
    order: 5,
  },

  // Chapter 3: Stack
  {
    id: 'prob-03-20',
    chapterId: 'ch-03',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    neetcodeUrl: 'https://neetcode.io/problems/validate-parentheses',
    patternIds: ['pt-03-matching'],
    hint: `- **Tầng 1 (Tư duy):** Ngoặc mở gần nhất phải khớp với ngoặc đóng đầu tiên gặp phải theo nguyên lý LIFO.
- **Tầng 2 (Cấu trúc dữ liệu):** Sử dụng \`Stack\` cùng bảng tra cứu \`mapping = {')': '(', '}': '{', ']': '['}\`.
- **Tầng 3 (Kỹ thuật then chốt):** Gặp ngoặc đóng: pop phần tử đỉnh stack so sánh; nếu stack rỗng hoặc không khớp thì trả về \`False\`. Cuối cùng kiểm tra \`len(stack) == 0\`.`,
    order: 1,
  },
  {
    id: 'prob-03-155',
    chapterId: 'ch-03',
    title: 'Min Stack',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/min-stack/',
    neetcodeUrl: 'https://neetcode.io/problems/minimum-stack',
    patternIds: ['pt-03-matching'],
    hint: `- **Tầng 1 (Tư duy):** Thiết kế Stack hỗ trợ lấy giá trị nhỏ nhất \`getMin()\` trong thời gian $O(1)$.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng hai Stack song song: một Stack lưu dữ liệu chính, một Stack phụ lưu giá trị nhỏ nhất tính tới thời điểm đó.
- **Tầng 3 (Kỹ thuật then chốt):** Khi push $val$: giá trị vào min_stack là $\\min(val, \\text{min\\_stack[-1]})$. Khi pop thì pop đồng thời cả hai stack.`,
    order: 2,
  },
  {
    id: 'prob-03-150',
    chapterId: 'ch-03',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    neetcodeUrl: 'https://neetcode.io/problems/evaluate-reverse-polish-notation',
    patternIds: ['pt-03-expression-eval'],
    hint: `- **Tầng 1 (Tư duy):** Trong ký pháp nghịch đảo Ba Lan (RPN), toán tử áp dụng ngay cho 2 toán hạng đứng liền trước nó.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`Stack\` lưu các số nguyên.
- **Tầng 3 (Kỹ thuật then chốt):** Gặp toán tử: pop số thứ nhất làm $b$, pop số thứ hai làm $a$; tính $a \\text{ op } b$ và đẩy kết quả trở lại. Chú ý phép chia trong Python dùng \`int(a / b)\` để làm tròn về 0.`,
    order: 3,
  },
  {
    id: 'prob-03-739',
    chapterId: 'ch-03',
    title: 'Daily Temperatures',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
    neetcodeUrl: 'https://neetcode.io/problems/daily-temperatures',
    patternIds: ['pt-03-monotonic-stack'],
    hint: `- **Tầng 1 (Tư duy):** Với mỗi ngày, tìm ngày đầu tiên trong tương lai có nhiệt độ cao hơn (bài toán Next Greater Element).
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`Monotonic Stack\` lưu chỉ số của các ngày có nhiệt độ giảm dần.
- **Tầng 3 (Kỹ thuật then chốt):** Duyệt ngày $i$: trong khi nhiệt độ hôm nay cao hơn nhiệt độ ngày đỉnh stack, pop chỉ số \`prev_day\` ra và gán khoảng cách \`ans[prev_day] = i - prev_day\`.`,
    order: 4,
  },
  {
    id: 'prob-03-84',
    chapterId: 'ch-03',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'hard',
    leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    neetcodeUrl: 'https://neetcode.io/problems/largest-rectangle-in-histogram',
    patternIds: ['pt-03-monotonic-stack'],
    hint: `- **Tầng 1 (Tư duy):** Mỗi cột $i$ có thể tạo thành hình chữ nhật có chiều cao bằng chính nó nếu tìm được biên trái và biên phải đầu tiên thấp hơn nó.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`Monotonic Increasing Stack\` lưu cặp \`(index, height)\`.
- **Tầng 3 (Kỹ thuật then chốt):** Khi gặp cột thấp hơn, pop các cột cao hơn ra để tính diện tích; chiều rộng tính từ vị trí mở rộng xa nhất về bên trái mà cột đó có thể vươn tới.`,
    order: 5,
  },

  // Chapter 4: Binary Search
  {
    id: 'prob-04-704',
    chapterId: 'ch-04',
    title: 'Binary Search',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    neetcodeUrl: 'https://neetcode.io/problems/binary-search',
    patternIds: ['pt-04-basic-bs'],
    hint: `- **Tầng 1 (Tư duy):** So sánh giá trị trung tâm $mid$ với $target$ để loại bỏ một nửa mảng đã sắp xếp.
- **Tầng 2 (Cấu trúc dữ liệu):** Hai con trỏ biên: \`left = 0\`, \`right = len(nums) - 1\`.
- **Tầng 3 (Kỹ thuật then chốt):** Tính \`mid = left + (right - left) // 2\` để chống tràn số. Nếu $nums[mid] == target$ trả về $mid$; nếu nhỏ hơn tăng $left = mid + 1$; nếu lớn hơn giảm $right = mid - 1$.`,
    order: 1,
  },
  {
    id: 'prob-04-74',
    chapterId: 'ch-04',
    title: 'Search a 2D Matrix',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/',
    neetcodeUrl: 'https://neetcode.io/problems/search-2d-matrix',
    patternIds: ['pt-04-basic-bs'],
    hint: `- **Tầng 1 (Tư duy):** Ma trận $M \\times N$ được sắp xếp liên tục từ trái qua phải và trên xuống dưới có thể coi như một mảng 1D độ dài $M \\times N$.
- **Tầng 2 (Cấu trúc dữ liệu):** Tìm kiếm nhị phân trên chỉ số ảo từ $0$ đến $M \\times N - 1$.
- **Tầng 3 (Kỹ thuật then chốt):** Chuyển đổi chỉ số 1D $idx$ về tọa độ ma trận 2D: \`row = idx // N\`, \`col = idx % N\`.`,
    order: 2,
  },
  {
    id: 'prob-04-875',
    chapterId: 'ch-04',
    title: 'Koko Eating Bananas',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/',
    neetcodeUrl: 'https://neetcode.io/problems/eating-bananas',
    patternIds: ['pt-04-bs-answer'],
    hint: `- **Tầng 1 (Tư duy):** Tốc độ ăn $k$ càng lớn thì thời gian ăn càng giảm (tính chất đơn điệu). Ta tìm $k$ nhỏ nhất để tổng giờ $\\le h$.
- **Tầng 2 (Cấu trúc dữ liệu):** Nhị phân trên khoảng đáp án $k \\in [1, \\max(piles)]$.
- **Tầng 3 (Kỹ thuật then chốt):** Viết hàm \`can_eat(k)\`: tính tổng $\\sum \\lceil pile / k \\rceil = \\sum (pile + k - 1) // k$. Nếu $\\le h$, ghi nhận nghiệm và thử tốc độ nhỏ hơn bằng cách đặt $right = mid$; ngược lại đặt $left = mid + 1$.`,
    order: 3,
  },
  {
    id: 'prob-04-153',
    chapterId: 'ch-04',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    neetcodeUrl: 'https://neetcode.io/problems/find-minimum-in-rotated-sorted-array',
    patternIds: ['pt-04-rotated-array'],
    hint: `- **Tầng 1 (Tư duy):** Phần tử nhỏ nhất chính là điểm uốn (pivot) nơi chuỗi tăng bị gãy.
- **Tầng 2 (Cấu trúc dữ liệu):** Hai con trỏ \`left = 0\`, \`right = len(nums) - 1\`.
- **Tầng 3 (Kỹ thuật then chốt):** So sánh $nums[mid]$ với $nums[right]$: Nếu $nums[mid] > nums[right]$, điểm uốn chắc chắn nằm ở nửa phải $\\rightarrow left = mid + 1$; ngược lại điểm uốn ở $mid$ hoặc nửa trái $\\rightarrow right = mid$.`,
    order: 4,
  },
  {
    id: 'prob-04-33',
    chapterId: 'ch-04',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    neetcodeUrl: 'https://neetcode.io/problems/find-target-in-rotated-sorted-array',
    patternIds: ['pt-04-rotated-array'],
    hint: `- **Tầng 1 (Tư duy):** Khi chia đôi một mảng bị xoay, luôn có ít nhất một nửa (nửa trái hoặc nửa phải) giữ nguyên trật tự sắp xếp tăng dần.
- **Tầng 2 (Cấu trúc dữ liệu):** Tìm kiếm nhị phân có phân nhánh điều kiện.
- **Tầng 3 (Kỹ thuật then chốt):** Kiểm tra $nums[left] \\le nums[mid]$: nếu đúng thì nửa trái đã sắp xếp; kiểm tra $target$ có nằm trong $[nums[left], nums[mid]]$ không để quyết định thu hẹp. Nếu sai thì nửa phải đã sắp xếp.`,
    order: 5,
  },

  // Chapter 5: Sliding Window
  {
    id: 'prob-05-121',
    chapterId: 'ch-05',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    neetcodeUrl: 'https://neetcode.io/problems/buy-and-sell-crypto',
    patternIds: ['pt-05-variable-longest'],
    hint: `- **Tầng 1 (Tư duy):** Lợi nhuận lớn nhất khi bán ở ngày $i$ được tính bằng $prices[i] - \\text{giá thấp nhất đã gặp trước đó}$.
- **Tầng 2 (Cấu trúc dữ liệu):** Duyệt 1 lượt với một biến lưu giá mua nhỏ nhất \`min_price\`.
- **Tầng 3 (Kỹ thuật then chốt):** Tại mỗi ngày, cập nhật lợi nhuận \`max_profit = max(max_profit, price - min_price)\` và cập nhật \`min_price = min(min_price, price)\`.`,
    order: 1,
  },
  {
    id: 'prob-05-3',
    chapterId: 'ch-05',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    neetcodeUrl: 'https://neetcode.io/problems/longest-substring-without-duplicates',
    patternIds: ['pt-05-variable-longest'],
    hint: `- **Tầng 1 (Tư duy):** Duy trì một cửa sổ con $[left, right]$ sao cho không có ký tự nào xuất hiện quá 1 lần.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`HashSet\` hoặc \`HashMap\` lưu ký tự và vị trí xuất hiện gần nhất của nó.
- **Tầng 3 (Kỹ thuật then chốt):** Khi gặp ký tự đã có trong cửa sổ, dịch $left$ vượt qua vị trí xuất hiện trước đó của ký tự đó; cập nhật độ dài cực đại bằng \`right - left + 1\`.`,
    order: 2,
  },
  {
    id: 'prob-05-424',
    chapterId: 'ch-05',
    title: 'Longest Repeating Character Replacement',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    neetcodeUrl: 'https://neetcode.io/problems/longest-repeating-substring-with-replacement',
    patternIds: ['pt-05-variable-longest'],
    hint: `- **Tầng 1 (Tư duy):** Số ký tự cần thay thế trong một cửa sổ độ dài $L$ bằng $L - \\text{tần số ký tự xuất hiện nhiều nhất}$.
- **Tầng 2 (Cấu trúc dữ liệu):** Mảng đếm tần suất 26 ký tự cùng biến lưu tần số cực đại \`max_freq\`.
- **Tầng 3 (Kỹ thuật then chốt):** Điều kiện cửa sổ hợp lệ: $(right - left + 1) - max\\_freq \\le k$. Nếu vi phạm, dịch $left += 1$ và giảm tần suất tương ứng.`,
    order: 3,
  },
  {
    id: 'prob-05-567',
    chapterId: 'ch-05',
    title: 'Permutation in String',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/',
    neetcodeUrl: 'https://neetcode.io/problems/permutation-string',
    patternIds: ['pt-05-fixed-window'],
    hint: `- **Tầng 1 (Tư duy):** Hoán vị của $s_1$ xuất hiện trong $s_2$ khi có một cửa sổ con liên tiếp trong $s_2$ có độ dài đúng bằng $len(s_1)$ và cùng phân bố tần suất ký tự.
- **Tầng 2 (Cấu trúc dữ liệu):** Cửa sổ trượt cố định độ dài $K = len(s_1)$ với mảng đếm 26 ký tự.
- **Tầng 3 (Kỹ thuật then chốt):** Mỗi bước trượt cửa sổ sang phải: tăng tần số ký tự mới vào, giảm tần số ký tự cũ ra; so sánh hai mảng đếm tần số trong $O(1)$.`,
    order: 4,
  },
  {
    id: 'prob-05-76',
    chapterId: 'ch-05',
    title: 'Minimum Window Substring',
    difficulty: 'hard',
    leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    neetcodeUrl: 'https://neetcode.io/problems/minimum-window-with-characters',
    patternIds: ['pt-05-variable-shortest'],
    hint: `- **Tầng 1 (Tư duy):** Tìm cửa sổ ngắn nhất trong $s$ chứa đủ mọi ký tự của $t$.
- **Tầng 2 (Cấu trúc dữ liệu):** Hai \`HashMap\` đếm tần suất cùng biến đếm \`have\` và \`need\` biểu thị số ký tự độc nhất đã thỏa mãn.
- **Tầng 3 (Kỹ thuật then chốt):** Mở rộng $right$ đến khi $have == need$; sau đó dùng \`while\` thu hẹp $left$ để tìm kích thước nhỏ nhất, cập nhật kết quả trước khi $have < need$.`,
    order: 5,
  },

  // Chapter 6: Linked List
  {
    id: 'prob-06-206',
    chapterId: 'ch-06',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    neetcodeUrl: 'https://neetcode.io/problems/reverse-a-linked-list',
    patternIds: ['pt-06-reverse-in-place'],
    hint: `- **Tầng 1 (Tư duy):** Đổi hướng mũi tên liên kết của từng nút từ trỏ tới nút kế tiếp thành trỏ về nút đứng trước.
- **Tầng 2 (Cấu trúc dữ liệu):** Ba con trỏ: \`prev = None\`, \`curr = head\`, \`next_temp\`.
- **Tầng 3 (Kỹ thuật then chốt):** Lưu tạm \`next_temp = curr.next\`, gán \`curr.next = prev\`, sau đó dịch \`prev = curr\` và \`curr = next_temp\`. Kết thúc trả về \`prev\`.`,
    order: 1,
  },
  {
    id: 'prob-06-21',
    chapterId: 'ch-06',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    neetcodeUrl: 'https://neetcode.io/problems/merge-two-sorted-linked-lists',
    patternIds: ['pt-06-dummy-node', 'pt-06-merge-reorder'],
    hint: `- **Tầng 1 (Tư duy):** So sánh giá trị đầu của hai danh sách đã sắp xếp, liên tục chọn nút có giá trị nhỏ hơn nối vào danh sách kết quả.
- **Tầng 2 (Cấu trúc dữ liệu):** Sử dụng một nút giả \`dummy = ListNode(0)\` và con trỏ \`tail = dummy\`.
- **Tầng 3 (Kỹ thuật then chốt):** So sánh $l1.val$ và $l2.val$, nối nút nhỏ hơn vào \`tail.next\` và tiến con trỏ tương ứng; khi một danh sách hết, nối thẳng phần còn lại của danh sách kia vào đuôi. Trả về \`dummy.next\`.`,
    order: 2,
  },
  {
    id: 'prob-06-141',
    chapterId: 'ch-06',
    title: 'Linked List Cycle',
    difficulty: 'easy',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    neetcodeUrl: 'https://neetcode.io/problems/linked-list-cycle-detection',
    patternIds: ['pt-06-fast-slow'],
    hint: `- **Tầng 1 (Tư duy):** Nếu danh sách có vòng lặp, hai người chạy trên đường đua tròn với vận tốc khác nhau chắc chắn sẽ gặp lại nhau.
- **Tầng 2 (Cấu trúc dữ liệu):** Thuật toán rùa và thỏ: \`slow = head\`, \`fast = head\`.
- **Tầng 3 (Kỹ thuật then chốt):** Cho $slow$ đi 1 bước, $fast$ đi 2 bước (\`fast = fast.next.next\`). Nếu $slow == fast$, kết luận có chu trình; nếu $fast$ chạm \`None\`, kết luận không có chu trình.`,
    order: 3,
  },
  {
    id: 'prob-06-143',
    chapterId: 'ch-06',
    title: 'Reorder List',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/reorder-list/',
    neetcodeUrl: 'https://neetcode.io/problems/reorder-linked-list',
    patternIds: ['pt-06-fast-slow', 'pt-06-reverse-in-place', 'pt-06-merge-reorder'],
    hint: `- **Tầng 1 (Tư duy):** Sắp xếp lại danh sách theo thứ tự $L_0 \\rightarrow L_n \\rightarrow L_1 \\rightarrow L_{n-1} \\dots$
- **Tầng 2 (Cấu trúc dữ liệu):** Kết hợp 3 kỹ thuật cốt lõi: Tìm trung điểm $\\rightarrow$ Đảo ngược nửa sau $\\rightarrow$ Trộn xen kẽ.
- **Tầng 3 (Kỹ thuật then chốt):** Dùng fast/slow tìm điểm giữa và ngắt đôi danh sách (\`slow.next = None\`); đảo ngược nửa sau bằng 3 con trỏ; sau đó dùng vòng lặp nối xen kẽ từng nút của nửa đầu với nửa sau.`,
    order: 4,
  },
  {
    id: 'prob-06-19',
    chapterId: 'ch-06',
    title: 'Remove Nth Node From End of List',
    difficulty: 'medium',
    leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    neetcodeUrl: 'https://neetcode.io/problems/remove-node-from-end-of-linked-list',
    patternIds: ['pt-06-fast-slow', 'pt-06-dummy-node'],
    hint: `- **Tầng 1 (Tư duy):** Để xóa nút thứ $n$ từ cuối trong 1 lần duyệt duy nhất, duy trì khoảng cách giữa 2 con trỏ đúng bằng $n$.
- **Tầng 2 (Cấu trúc dữ liệu):** Dùng \`dummy node\` để tránh lỗi khi phải xóa chính nút đầu tiên \`head\`.
- **Tầng 3 (Kỹ thuật then chốt):** Cho con trỏ $fast$ đi trước $n$ bước từ dummy; sau đó cho cả $slow$ và $fast$ cùng tiến bước đến khi $fast.next$ chạm \`None\`. Lúc này $slow$ đang đứng ngay trước nút cần xóa, thực hiện \`slow.next = slow.next.next\`.`,
    order: 5,
  },
]

export const initialSeedData: SeedData = {
  schemaVersion: 1,
  exportedAt: '2026-10-08T00:00:00+07:00',
  chapters: seedChapters,
  concepts: seedConcepts,
  complexityRows: seedComplexityRows,
  patterns: seedPatterns,
  pitfalls: seedPitfalls,
  templates: seedTemplates,
  problems: seedProblems,
}

export default initialSeedData
