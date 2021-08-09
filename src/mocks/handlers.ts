import { rest } from "msw";
import { baseUrl } from "@/baseUrl";
import { LogInReqBody } from "@/components/Header/LogIn";

export const handlers = [
  rest.post(`${baseUrl}/api/v1/auth/register`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ success: true, token: "test" }));
  }),

  rest.post<LogInReqBody, any>(
    `${baseUrl}/api/v1/auth/login`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          token: "test",
          username: "test",
        })
      );
    }
  ),

  rest.get(`${baseUrl}/api/v1/auth/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
