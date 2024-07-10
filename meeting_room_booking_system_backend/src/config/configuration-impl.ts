export interface ConfigurationImpl {
  ['redis-server.host']: string;
  ['redis-server.port']: number;
  ['redis-server.db']: number;

  ['mysql-server.host']: string;
  ['mysql-server.port']: number;
  ['mysql-server.username']: string;
  ['mysql-server.password']: string;
  ['mysql-server.database']: string;

  ['minio-server.endpoint']: string;
  ['minio-server.port']: number;
  ['minio-server.access-key']: string;
  ['minio-server.secret-key']: string;
  ['minio-server.bucket-name']: string;
  ['minio-server.expires']: string;

  ['nodemailer-server.host']: string;
  ['nodemailer-server.port']: number;
  ['nodemailer-server.user']: string;
  ['nodemailer-server.pass']: string;

  ['winston.log-level']: string;
  ['winston.log-dirname']: string;
  ['winston.log-filename']: string;
  ['winston.log-date-pattern']: string;
  ['winston.log-max-size']: string;

  ['google.login.client-id']: string;
  ['google.login.client-secret']: string;
  ['google.login.callback-url']: string;
  ['google.login.redirect-url']: string;

  ['github.login.client-id']: string;
  ['github.login.client-secret']: string;
  ['github.login.callback-url']: string;
  ['github.login.redirect-url']: string;

  ['jwt.secret']: string;
  ['jwt.access-token-expires-time']: string;
  ['jwt.access-refresh-expires-time']: string;

  ['nest-server.port']: number;
  ['nest-server.doc-url']: string;
}
