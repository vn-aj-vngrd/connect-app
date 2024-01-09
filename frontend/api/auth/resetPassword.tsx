import axios from "axios";
import { Response } from "@/types";

type ResetPassword = {
  userId: string;
  password: string;
  code: string;
};

export const resetPassword = async (body: ResetPassword) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`;

  const res = await axios.post<Response>(api, body, {
    withCredentials: true,
  });

  return res;
};
