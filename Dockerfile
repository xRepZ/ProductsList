FROM node:18-alpine
    
ENV APP_DIR=/app
    
WORKDIR $APP_DIR
    
COPY . .
    
RUN yarn install

USER node
    
CMD yarn start