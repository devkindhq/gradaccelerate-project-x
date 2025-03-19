import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      healthCheck: true,
      debug: false,
    },
  },
})

export default dbConfig
