FROM node:lts-alpine3.23

WORKDIR /app/backend

RUN npm install -g pnpm 

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["pnpm", "run", "build","&&","pnpm","run","start"]