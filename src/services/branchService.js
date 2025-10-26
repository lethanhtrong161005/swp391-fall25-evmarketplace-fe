import {get} from "@/utils/apiCaller"

export const getAllBranches = async () => {
  return await get("/api/branchs/");
};