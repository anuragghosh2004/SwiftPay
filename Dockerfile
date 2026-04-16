FROM node:20

WORKDIR /app

# 1. Copy the root configuration files
COPY package.json package-lock.json* ./

# 2. Copy ALL workspace package.json files
COPY packages/db/package.json ./packages/db/
COPY apps/user-app/package.json ./apps/user-app/
COPY apps/merchant/package.json ./apps/merchant/
COPY packages/store/package.json ./packages/store/
COPY packages/ui/package.json ./packages/ui/
COPY apps/bank-webhook/package.json ./apps/bank-webhook/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 3. Copy the Prisma schema
COPY packages/db/prisma ./packages/db/prisma 

# 4. Install ALL dependencies (Root + Workspaces) including dev dependencies
RUN npm install --include=dev

# 5. Generate the Prisma Client
RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma

# 6. Copy the rest of your actual application code
COPY . .

# 7. Build the monorepo
RUN npm run build

# 8. Set Hostname for external access
ENV HOSTNAME="0.0.0.0"

# 9. Start the app
CMD ["npm", "run", "start-user-app"]