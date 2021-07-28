import { rest } from "msw";
import { baseUrl } from "../components/baseUrl";

interface LoginBody {
  username: string;
  password: string;
}

export const handlers = [
  rest.post(`${baseUrl}users/signup`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ success: true }));
  }),

  rest.post<LoginBody, any>(`${baseUrl}users/login`, (req, res, ctx) => {
    const { username } = req.body;

    return res(
      ctx.status(200),
      ctx.json({ success: true, token: "test", username })
    );
  }),

  rest.get(`${baseUrl}users/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
