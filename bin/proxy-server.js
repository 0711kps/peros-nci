#!/bin/env node
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const backendPort = process.env.BACKEND_PORT
const frontendPort = process.env.FRONTEND_PORT
const waitOn = require('wait-on')
const waitOpts = {
  resources: [`tcp:${backendPort}`, `tcp:${frontendPort}`]
}
let proxyPort = 3000
while (backendPort === proxyPort || frontendPort === proxyPort) proxyPort += 1

app.use('/api', createProxyMiddleware({
  target: `http://localhost:${backendPort}`
}))

app.use('/', createProxyMiddleware({
  target: `http://localhost:${frontendPort}`
}))

waitOn(waitOpts, () => {
  console.log(`proxy server is running at http://localhost:${proxyPort}`)
})
app.listen(proxyPort, 'localhost')
