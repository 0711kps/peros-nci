# peros nci

this is a little package to use express as proxy server  
and make my work a little easier  
when developing a separated(frontend and backend) web app  

> notice: this is not a general purpose package to use on every project  
> make sure you read this document nicely before using it

## Prerequisite

- you separate project into two folders, frontend, and backend in the project's root
- you use create-react-app in frontend, or you should have a frontend project which use `PORT` environment variable to config the port of dev server, and can the dev server can be launched with `npm run start`
- you use nest in backend, and config an environment variable `APP_PORT` for dev server port, or you have a backend server which use that environment variable name for dev server, and the dev server can be launched with `npm run start:dev`

## Installation

npm i -g peros-nci

## usage

```sh
  cd your-nice-project
  nci -f 3001 -b 3002
  # or nci --frontend-port 3001 --backend-port 3002
```
