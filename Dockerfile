FROM node:15.0.0-alpine

ARG sadmin=syte3admin
ARG ssesh=syte3sesh
ARG appurl=appurl

# Creating final working directory
RUN mkdir /app
COPY . /app
WORKDIR /app/api

# Installing api dependencies
RUN npm install --production

# Setting some env variables
ENV SYTE3ADMIN=$sadmin
ENV SYTE3SESH=$ssesh
ENV CLIENT_URL=$appurl
ENV API_URL=$appurl
ENV NODE_ENV=production
ENV PORT=80

#Expose API
EXPOSE 80

CMD ["node", "app.js"]


