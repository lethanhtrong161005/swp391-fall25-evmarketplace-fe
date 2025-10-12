# 🔍 Search API Integration - Hướng dẫn sử dụng

## 📋 Tổng quan
Đã tích hợp API search `/api/listing/search` cho thanh tìm kiếm trên trang chủ.

## 🔧 Các thay đổi chính

### 1. Service mới: `src/services/listingHomeService.js`
- `searchListings()` - Gọi API search với từ khóa và phân trang

### 2. Cập nhật SearchBar: `src/components/SearchBar/SearchBar.jsx`
- Thêm state management cho search term, category, area
- Tích hợp với API search
- Thêm loading state và error handling
- Hỗ trợ Enter key để search
- Navigate đến trang kết quả với dữ liệu

### 3. Trang kết quả tìm kiếm: `src/pages/Member/SearchResults/index.jsx`
- Hiển thị kết quả tìm kiếm
- Hỗ trợ load more với pagination
- Transform dữ liệu từ API về format phù hợp
- Empty state khi không có kết quả

### 4. Cập nhật routes: `src/routes/index.jsx`
- Thêm route `/search-results` cho trang kết quả

## 🧪 Cách test

### 1. Chạy ứng dụng
```bash
npm run dev
```

### 2. Test từ thanh tìm kiếm
- Mở trang chủ
- Nhập từ khóa vào ô "Tìm sản phẩm..." (VD: "BYD", "Tesla", "VinFast")
- Nhấn Enter hoặc click "Tìm kiếm"
- Kiểm tra trang kết quả

### 3. Test API trực tiếp từ console
```javascript
// Test search với từ khóa cụ thể
window.testSearchAPI("BYD")

// Test với nhiều từ khóa
window.testSearchAPI("Tesla")

// Test tất cả từ khóa
window.testMultipleSearches()
```

## 📊 API Search Parameters

### Request parameters:
- `key`: Từ khóa tìm kiếm (required)
- `page`: Trang hiện tại (bắt đầu từ 0)
- `size`: Số lượng item mỗi trang
- `sort`: Trường sắp xếp (mặc định: "createdAt")
- `dir`: Hướng sắp xếp ("asc" hoặc "desc")

### Example request:
```
GET /api/listing/search?key=BYD&page=0&size=10&sort=createdAt&dir=desc
```

### Response format:
```json
{
  "status": 200,
  "success": true,
  "message": "OK",
  "data": {
    "page": 0,
    "items": [
      {
        "id": 14,
        "title": "[Ký gửi] BYD Atto 3 mới",
        "brand": "BYD",
        "model": "Atto 3",
        "batteryCapacityKwh": 60,
        "sohPercent": 99,
        "mileageKm": "3000",
        "price": 820000000,
        "province": "Đà Nẵng",
        "mediaListUrl": ["url1,url2,url3"],
        "isConsigned": true,
        "visibility": "NORMAL"
      }
    ],
    "size": 10,
    "hasNext": false
  }
}
```

## 🎯 Search Features

### 1. **Tìm kiếm cơ bản**
- Tìm kiếm theo từ khóa trong title, brand, model
- Hỗ trợ Enter key và click button
- Loading state khi đang tìm kiếm

### 2. **Filter options** (UI ready, chưa tích hợp backend)
- Danh mục: Tất cả, Xe điện, Pin, VinFast, Tesla, BYD
- Khu vực: Tất cả, Hà Nội, Hồ Chí Minh, Đà Nẵng, Hải Phòng

### 3. **Kết quả tìm kiếm**
- Hiển thị grid layout với ProductCard
- Load more với pagination
- Empty state khi không có kết quả
- Transform dữ liệu để hiển thị đúng

### 4. **Navigation**
- Chuyển từ trang chủ đến trang kết quả
- Truyền dữ liệu qua state
- Nút "Quay lại trang chủ"

## 🔄 Data Flow

1. **User nhập từ khóa** → SearchBar component
2. **Click search hoặc Enter** → Gọi `searchListings()` API
3. **API trả về kết quả** → Transform data với `transformListingData()`
4. **Navigate đến SearchResults** → Truyền data qua state
5. **Hiển thị kết quả** → ProductCard grid layout
6. **Load more** → Gọi API với page tiếp theo

## 🐛 Troubleshooting

### 1. Search không hoạt động
- Kiểm tra console logs
- Kiểm tra API_URL trong config
- Kiểm tra network tab trong DevTools

### 2. Không có kết quả
- Kiểm tra từ khóa có đúng không
- Kiểm tra API response
- Kiểm tra data transformation

### 3. Images không hiển thị
- Kiểm tra `mediaListUrl` parsing
- Kiểm tra URL format
- Kiểm tra CORS cho images

### 4. Navigation không hoạt động
- Kiểm tra route đã được thêm chưa
- Kiểm tra state được truyền đúng chưa
- Kiểm tra useNavigate hook

## 📝 Next Steps

1. **Filter integration**: Tích hợp filter category và area với backend
2. **Advanced search**: Thêm filter theo giá, năm, SOH, etc.
3. **Search suggestions**: Thêm autocomplete/suggestions
4. **Search history**: Lưu lịch sử tìm kiếm
5. **Sort options**: Thêm các tùy chọn sắp xếp khác
6. **Search analytics**: Track search behavior

## 🎯 Test Cases

### Manual Testing:
1. ✅ Search với từ khóa có kết quả ("BYD")
2. ✅ Search với từ khóa không có kết quả ("xyz123")
3. ✅ Search với từ khóa rỗng (hiển thị warning)
4. ✅ Enter key để search
5. ✅ Load more functionality
6. ✅ Navigation back to home
7. ✅ Empty state display
8. ✅ Loading states

### API Testing:
1. ✅ Search API với các từ khóa khác nhau
2. ✅ Pagination với page và size
3. ✅ Error handling
4. ✅ Data transformation
5. ✅ Response format validation
