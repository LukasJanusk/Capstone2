import pino from 'pino'

export const logger = pino({
  redact: [
    'email',
    'password',
    'access_token',
    'refresh_token',
    'firstName',
    'lastName',
    'lastname',
    'firstname',
    'first_name',
    'last_name',
  ],
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'UTC:yyyy-mm-dd HH:MM:ss',
      colorize: true,
    },
  },
})

export type Logger = typeof logger
