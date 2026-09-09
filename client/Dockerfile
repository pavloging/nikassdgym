FROM node:18

WORKDIR /app

# Ставим зависимости строго по lock-файлу и отдельным слоем,
# чтобы правки исходников не заставляли переустанавливать пакеты.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
