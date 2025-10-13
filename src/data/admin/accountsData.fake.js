// Fake data for testing Admin Account Management
export const fakeAccountsData = {
  success: true,
  message: "Lấy danh sách tài khoản thành công",
  data: {
    items: [
      {
        id: 1,
        phone_number: "0912345678",
        email: "admin@evmarketplace.com",
        role: "ADMIN",
        status: "ACTIVE",
        verified_phone: true,
        verified_email: true,
        created_at: "2024-01-15T08:30:00Z",
        profile: {
          full_name: "Nguyễn Văn Admin",
          avatar_url: null,
          province: "Hồ Chí Minh",
          address_line: "123 Nguyễn Huệ, Quận 1",
        },
      },
      {
        id: 2,
        phone_number: "0987654321",
        email: "staff@evmarketplace.com",
        role: "STAFF",
        status: "ACTIVE",
        verified_phone: true,
        verified_email: false,
        created_at: "2024-02-10T10:15:00Z",
        profile: {
          full_name: "Trần Thị Staff",
          avatar_url: null,
          province: "Hà Nội",
          address_line: "456 Hoàng Kiếm, Quận Hoàn Kiếm",
        },
      },
      {
        id: 3,
        phone_number: "0901234567",
        email: "member1@gmail.com",
        role: "MEMBER",
        status: "ACTIVE",
        verified_phone: true,
        verified_email: true,
        created_at: "2024-03-05T14:20:00Z",
        profile: {
          full_name: "Lê Văn Member",
          avatar_url: "https://via.placeholder.com/40",
          province: "Đà Nẵng",
          address_line: "789 Hải Châu, Quận Hải Châu",
        },
      },
      {
        id: 4,
        phone_number: "0909876543",
        email: "member2@yahoo.com",
        role: "MEMBER",
        status: "SUSPENDED",
        verified_phone: false,
        verified_email: true,
        created_at: "2024-03-12T16:45:00Z",
        profile: {
          full_name: "Phạm Thị Locked",
          avatar_url: null,
          province: "Cần Thơ",
          address_line: "321 Ninh Kiều, Quận Ninh Kiều",
        },
      },
      {
        id: 5,
        phone_number: "0923456789",
        email: "newmember@outlook.com",
        role: "MEMBER",
        status: "ACTIVE",
        verified_phone: true,
        verified_email: false,
        created_at: "2024-03-20T09:30:00Z",
        profile: {
          full_name: "Hoàng Văn New",
          avatar_url: "https://via.placeholder.com/40/0066cc",
          province: "Hồ Chí Minh",
          address_line: "654 Tân Bình, Quận Tân Bình",
        },
      },
    ],
    total: 5,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

// Mock API delay
export const mockApiDelay = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
