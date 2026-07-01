# Notes — To-do & Ghi chú kiểu Notion

Web app ghi chú/to-do dạng trang lồng nhau (giống Notion), lưu trên Firebase, dùng thuần HTML/CSS/JS (không cần build tool).

## 1. Tạo project Firebase

1. Vào https://console.firebase.google.com → **Add project** → đặt tên (vd: `my-notes`).
2. Vào **Build → Authentication → Get started** → tab **Sign-in method** → bật **Google**.
3. Vào **Build → Firestore Database → Create database** → chọn chế độ **Production mode** → chọn region gần bạn (vd `asia-southeast1`).
4. Vào **Build → Storage → Get started** → giữ mặc định (Production mode).
5. Vào **Project settings** (icon bánh răng) → cuộn xuống **Your apps** → bấm biểu tượng **</>** (Web) → đặt nickname → **Register app**.
6. Copy đoạn `firebaseConfig` hiện ra, dán vào file `firebase-config.js` (thay các chỗ `DÁN_..._CỦA_BẠN`).

## 2. Cấu hình bảo mật (chỉ mình bạn truy cập được data)

**Firestore Rules** (tab Rules trong Firestore Database), thay toàn bộ bằng:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage Rules** (tab Rules trong Storage), thay toàn bộ bằng:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Bấm **Publish** cho cả 2. Với rule này, mỗi tài khoản Google chỉ đọc/ghi được data của chính mình.

## 3. Chạy thử local

Vì dùng ES module (`type="module"`), bạn cần chạy qua một local server (không mở trực tiếp file `index.html` bằng `file://`). Ví dụ:

```bash
npx serve .
# hoặc
python3 -m http.server 5500
```

Rồi mở `http://localhost:5500` (hoặc port `serve` báo).

## 4. Đưa lên GitHub

```bash
git init
git add .
git commit -m "Init notes app"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## 5. Deploy lên Vercel

1. Vào https://vercel.com → **Add New → Project** → chọn repo vừa push.
2. Framework Preset: chọn **Other** (đây là static site, không cần build command).
3. Bấm **Deploy**.

Xong — mọi thiết bị (điện thoại, máy tính) vào link Vercel, đăng nhập Google là thấy đúng data của bạn.

> Lưu ý: `firebaseConfig` trong `firebase-config.js` không phải là "bí mật" theo nghĩa API key thông thường — nó chỉ định danh project, việc bảo vệ dữ liệu nằm ở Firestore/Storage Rules ở bước 2. Vẫn nên để repo ở chế độ private nếu muốn thận trọng.

## Tính năng hiện có

- Đăng nhập Google, dữ liệu riêng theo tài khoản
- Cây trang lồng nhau không giới hạn cấp (thêm/xóa trang, trang con)
- Đổi tên trang, đổi icon (emoji)
- Các khối nội dung trong trang: văn bản, tiêu đề, việc cần làm (checkbox), hình ảnh (upload hoặc dán link), liên kết
- Kéo-thả để sắp xếp lại thứ tự khối trong 1 trang
- Responsive: sidebar thu gọn thành drawer trên điện thoại
- Toàn bộ đồng bộ real-time qua Firestore (`onSnapshot`) — sửa ở thiết bị này, thiết bị khác tự cập nhật

## Hướng phát triển tiếp (v2, nếu cần)

- Kéo-thả để đổi cấp/trang cha trong sidebar
- Slash command (`/`) để chèn khối nhanh như Notion thật
- Tìm kiếm toàn bộ trang
- Thẻ (tags), độ ưu tiên, ngày hết hạn cho block todo
- Preview ảnh đại diện (favicon/title) cho block link
