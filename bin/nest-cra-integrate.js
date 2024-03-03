#!/bin/env node
const fs = require('fs')

if (!(fs.existsSync('backend') && fs.existsSync('frontend'))) {
  console.warn('you should only run this command in a project!')
  process.exit(1)
}

const concurrently = require('concurrently')

const matchOptionName = arg => {
  const optionMap = {
    'f': 'frontend-port',
    'b': 'backend-port'
  }

  const aliasPattern = /^-{1}\w{1}$/
  const optionPattern = /^-{2}\w{2,}$/
  let optionName
  if (aliasPattern.test(arg)) {
    optionName = optionMap[arg.slice(1)]
  } else if (optionPattern.test(arg)) {
    const inputOptionName = arg.slice(2)
    if (Object.values(optionMap).includes(inputOptionName)) optionName = inputOptionName
  }

  return optionName
}

const input = process.argv.slice(2)
const options = new Map()

while (input.length > 0) {
  const nextArg = input.shift()
  const optionName = matchOptionName(nextArg)

  // if alias or option name given, treat next arg as option value
  if (optionName) {
    const optionValue = input.shift()
    if (optionValue === undefined || optionValue.startsWith('--')) {
      console.error(`no value is given for ${nextArg}`)
      process.exit(1)
    }

    options.set(optionName, optionValue)
  }
}

let backendPort, frontendPort
// check if backend and frontend port given
if (!((backendPort = options.get('backend-port')) && (frontendPort = options.get('frontend-port')))) {
  console.error('frontend or backend port not given')
  console.log('e.g. nci --backend-port 3001 --frontend-port 3002')
  throw 'params illegal'
}

// run a express server, and backend, frontend server using concurrently
concurrently(
  [
    { command: 'cd frontend && npm run start', name: 'frontend', env: { PORT: frontendPort }},
    { command: 'cd frontend && npm run test', name: 'frontned-test' },
    { command: 'cd backend && npm run start:dev', name: 'backend', env: { APP_PORT: backendPort }},
    { command: 'cd backend && npm run test:watch', name: 'backend-test' },
    { command: `nci-proxy`, name: 'proxy', env: { FRONTEND_PORT: frontendPort, BACKEND_PORT: backendPort }}
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 1
  }
)
