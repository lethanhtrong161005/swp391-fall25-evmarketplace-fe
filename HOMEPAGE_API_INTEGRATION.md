# 🚀 HomePage API Integration - Hướng dẫn sử dụng

## 📋 Tổng quan
Đã tích hợp API thực từ backend để thay thế dữ liệu mock trên trang HomePage.

## 🔧 Các thay đổi chính

### 1. Service mới: `src/services/listingHomeService.js`
- `getAllListings()` - Lấy tất cả listing với phân trang
- `getLatestListings()` - Lấy listing mới nhất cho trang chủ
- `getFeaturedListings()` - Lấy listing nổi bật
- `getTotalListingsCount()` - Lấy tổng số listing

### 2. Cập nhật trang HomePage: `src/pages/Member/Home/index.jsx`
- Thay thế import từ fake data sang real API
- Thêm error handling và loading states
- Thêm debug logging để theo dõi

### 3. Test utility: `src/utils/testListingAPI.js`
- Function để test API integration
- Có thể gọi từ browser console: `window.testListingAPI()`

## 🧪 Cách test

### 1. Chạy ứng dụng
```bash
npm run dev
```

### 2. Mở trang chủ và kiểm tra console
- Mở Developer Tools (F12)
- Vào tab Console
- Xem logs khi trang load

### 3. Test API trực tiếp từ console
```javascript
// Test tất cả API functions
window.testListingAPI()

// Hoặc test từng function riêng
import { getAllListings } from '@/services/listingHomeService'
getAllListings({ page: 0, size: 5 })
```

## 📊 Cấu trúc dữ liệu API

### Request parameters:
- `page`: Trang hiện tại (bắt đầu từ 0)
- `size`: Số lượng item mỗi trang
- `sort`: Trường sắp xếp (mặc định: "createdAt")
- `dir`: Hướng sắp xếp ("asc" hoặc "desc")

### Response format:
```json
{
  "status": 200,
  "success": true,
  "message": "OK",
  "data": {
    "page": 0,
    "items": [...],
    "size": 10,
    "hasNext": false
  },
  "fieldErrors": null,
  "timestamp": "2025-10-11 11:32:57"
}
```

### Item structure:
```json
{
  "id": 14,
  "year": 2023,
  "visibility": "NORMAL",
  "status": "ACTIVE",
  "title": "[Ký gửi] BYD Atto 3 mới",
  "brand": "BYD",
  "model": "Atto 3",
  "batteryCapacityKwh": 60,
  "sohPercent": 99,
  "mileageKm": "3000",
  "price": 820000000,
  "createdAt": "2025-10-06T18:18:05",
  "isConsigned": true,
  "sellerName": "Trần Thị Bích",
  "province": "Đà Nẵng",
  "mediaListUrl": ["url1,url2,url3"]
}
```

## 🔄 Data transformation

Service sẽ transform dữ liệu từ API về format phù hợp với component:

- `mediaListUrl` (string) → `images` (array)
- `isConsigned` → `verified`
- `mileageKm` (string) → `mileageKm` (number)
- Thêm `category` dựa trên `brand` và `model`

## 🐛 Troubleshooting

### 1. API không trả về dữ liệu
- Kiểm tra API_URL trong `src/config/publicRuntimeConfig.js`
- Kiểm tra network tab trong DevTools
- Kiểm tra CORS settings

### 2. Dữ liệu hiển thị không đúng
- Kiểm tra console logs
- Kiểm tra data transformation trong `transformListingData()`
- Kiểm tra component ProductCard

### 3. Images không load
- Kiểm tra `mediaListUrl` parsing
- Kiểm tra URL format
- Kiểm tra CORS cho images

## 📝 Next steps

1. **Pagination**: Implement pagination cho danh sách sản phẩm
2. **Search/Filter**: Tích hợp search và filter
3. **Error handling**: Cải thiện error handling và retry logic
4. **Caching**: Thêm caching để tối ưu performance
5. **Loading states**: Cải thiện UX với skeleton loading

## 🎯 API Endpoints sử dụng

- `GET /api/listing/all` - Lấy tất cả listing
- `GET /api/listing/search` - Tìm kiếm listing (chưa implement)
- `GET /api/listing/mine` - Lấy listing của user (chưa implement)
- `GET /api/listing/mine/counts` - Đếm listing của user (chưa implement)
