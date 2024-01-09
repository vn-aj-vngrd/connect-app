import axios from "axios";
import { forgotPasswordSchema } from "@/schemas";
import { z } from "zod";
import { Response } from "@/types";

type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const forgotPassword = async (body: ForgotPassword) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`;

  const res = await axios.post<Response>(api, body, {
    withCredentials: true,
  });

  return res;
};
