// Khi nối BE: thay fake* bằng request(...)
import {
  fakeList,
  fakeCreate,
  fakeUpdate,
  fakeChangeRole,
  fakeLock,
  fakeUnlock,
  fakeLogs,
} from "@/data/admin/accounts.fake";

export const listAccounts = (params) => fakeList(params);
export const createAccount = (payload) => fakeCreate(payload);
export const updateAccount = (id, patch) => fakeUpdate(id, patch);
export const changeRole = (id, role) => fakeChangeRole(id, role);
export const lockAccount = (id) => fakeLock(id);
export const unlockAccount = (id) => fakeUnlock(id);
export const getAccountLogs = (id) => fakeLogs(id);
