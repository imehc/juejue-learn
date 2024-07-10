###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# https://www.tomray.dev/nestjs-docker-production
FROM node:22-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:22-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN \
  if [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile --production && \
    yarn cache clean; \
  elif [ -f package-lock.json ]; then \
    npm ci --only=production && \
    npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    pnpm install --prod && \
    pnpm prune; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi


USER node

###################
# PRODUCTION
###################

FROM node:22-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node .env.yaml ./.env.yaml

EXPOSE 6020

ENV PORT 6020

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
