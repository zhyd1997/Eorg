# README

Migrated to [blog](https://zhangyadong.me/)

# Features

Migrated to [project management](https://github.com/zhyd1997/Eorg/projects)
![wish list](https://i.imgur.com/mc9xri8.png)

# Developer Tips
First `start` backend, [Eorg-Server](https://github.com/zhyd1997/Eorg-Server),
it runs on port: 3000, and then `start` frontend, the project, it runs on port:
3001

if you want to `build` it, don't forget to modify `./docs/index.html`:
```diff
- <link href="/static/css/2.<hash>.chunk.css" rel="stylesheet"><link href="/static/css/main.<hash>.chunk.css" rel="stylesheet">
+ <link href="./static/css/2.<hash>.chunk.css" rel="stylesheet"><link href="./static/css/main.<hash>.chunk.css" rel="stylesheet">

- <script src="/static/js/2.<hash>.chunk.js"></script><script src="/static/js/main.<hash>.chunk.js">
+ <script src="./static/js/2.<hash>.chunk.js"></script><script src="./static/js/main.<hash>.chunk.js">
```
or you will get 4 errors on the webpage.

# User Tips
Text only supports a single style