FROM node:20

WORKDIR /app

# 1. Copy the root configuration files
COPY package.json package-lock.json* ./

# 2. Copy the workspace package.json files so npm knows what to install!
# (If you have other packages like packages/ui, add a COPY line for them here too)
COPY packages/db/package.json ./packages/db/
COPY apps/user-app/package.json ./apps/user-app/

# 3. Copy the Prisma schema
COPY packages/db/prisma ./packages/db/prisma 
COPY packages/store/package.json ./packages/store/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 4. Install ALL dependencies (Root + Workspaces)
RUN npm install 

# 5. Generate the Prisma Client
RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma

# 6. NOW copy the rest of your actual application code
COPY . .

# 7. Build the monorepo
RUN npm run build

# 8. Start the app
CMD ["npm", "run", "start-user-app"]