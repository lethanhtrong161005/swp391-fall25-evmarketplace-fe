let _id = 1000;

const now = () => new Date().toISOString();

export const ROLES = ["ADMIN", "STAFF", "MEMBER"];
export const STATUS = { ACTIVE: "ACTIVE", LOCKED: "LOCKED" };

export let accounts = [
  {
    id: ++_id,
    name: "Nguyễn Văn 0",
    email: "user0@reev.com",
    phone: "0912345670",
    role: "ADMIN",
    status: STATUS.LOCKED,
    verified_phone: true,
    verified_email: true,
    created_at: now(),
  },
  {
    id: ++_id,
    name: "Trần Thị 1",
    email: "user1@reev.com",
    phone: "0912345671",
    role: "MEMBER",
    status: STATUS.ACTIVE,
    verified_phone: true,
    verified_email: false,
    created_at: now(),
  },
  {
    id: ++_id,
    name: "Trần Thị 2",
    email: "user2@reev.com",
    phone: "0912345672",
    role: "MEMBER",
    status: STATUS.ACTIVE,
    verified_phone: false,
    verified_email: true,
    created_at: now(),
  },
  {
    id: ++_id,
    name: "Trần Thị 3",
    email: "user3@reev.com",
    phone: "0912345673",
    role: "MEMBER",
    status: STATUS.ACTIVE,
    verified_phone: false,
    verified_email: false,
    created_at: now(),
  },
  {
    id: ++_id,
    name: "Trần Thị 4",
    email: "user4@reev.com",
    phone: "0912345674",
    role: "STAFF",
    status: STATUS.ACTIVE,
    verified_phone: true,
    verified_email: false,
    created_at: now(),
  },
];

export let accountLogs = [
  {
    id: 1,
    account_id: accounts[0].id,
    at: now(),
    action: "CREATE",
    by: "System",
    note: "Khởi tạo dữ liệu mẫu",
  },
];

export function fakeList(params = {}) {
  const { q } = params;
  let data = [...accounts];
  if (q) {
    const s = q.toLowerCase();
    data = data.filter((x) =>
      [x.name, x.email, x.phone].some((v) =>
        (v || "").toLowerCase().includes(s)
      )
    );
  }
  return Promise.resolve({ items: data, total: data.length });
}

export function fakeCreate(payload) {
  const id = ++_id;
  const row = {
    id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role, // only STAFF/MEMBER
    status: STATUS.ACTIVE,
    verified_phone: false,
    verified_email: false,
    created_at: now(),
  };
  accounts.unshift(row);
  accountLogs.push({
    id: accountLogs.length + 1,
    account_id: id,
    at: now(),
    action: "CREATE",
    by: "Admin",
    note: "Tạo tài khoản",
  });
  return Promise.resolve(row);
}

export function fakeUpdate(id, patch) {
  const i = accounts.findIndex((x) => x.id === id);
  if (i >= 0) {
    accounts[i] = { ...accounts[i], ...patch };
    accountLogs.push({
      id: accountLogs.length + 1,
      account_id: id,
      at: now(),
      action: "UPDATE",
      by: "Admin",
      note: "Cập nhật thông tin",
    });
    return Promise.resolve(accounts[i]);
  }
  return Promise.reject(new Error("Not found"));
}

export function fakeChangeRole(id, role) {
  return fakeUpdate(id, { role });
}

export function fakeLock(id) {
  return fakeUpdate(id, { status: STATUS.LOCKED });
}

export function fakeUnlock(id) {
  return fakeUpdate(id, { status: STATUS.ACTIVE });
}

export function fakeLogs(accountId) {
  return Promise.resolve(accountLogs.filter((x) => x.account_id === accountId));
}
