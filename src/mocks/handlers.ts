import { rest } from "msw";
import { baseUrl } from "../components/baseUrl";

export const handlers = [
  rest.post(`${baseUrl}users/signup`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ success: true }));
  }),

  rest.post(`${baseUrl}users/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, token: "test", username: "test" })
    );
  }),

  rest.get(`${baseUrl}users/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
