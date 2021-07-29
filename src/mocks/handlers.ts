import { rest } from "msw";
import { baseUrl } from "../components/baseUrl";
import { LogInReqBody } from "../components/Header";

export const handlers = [
  rest.post(`${baseUrl}users/signup`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ success: true, status: "SignUp successfully!" })
    );
  }),

  rest.post<LogInReqBody, any>(`${baseUrl}users/login`, (req, res, ctx) => {
    const { username } = req.body;

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        status: "LogIn successfully!",
        login: true,
        token: "test",
        username,
      })
    );
  }),

  rest.get(`${baseUrl}users/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
