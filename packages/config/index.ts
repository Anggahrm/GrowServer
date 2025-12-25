import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "smol-toml";

export interface WebConfig {
  development: boolean;
  address: string;
  port: number;
  ports: number[];
  loginUrl: string;
  cdnUrl: string;
  maintenance: {
    enable: boolean;
    message: string;
  };
  tls: {
    key: string;
    cert: string;
  };
}

export interface WebFrontendConfig {
  root: string;
  port: number;
  tls: {
    key: string;
    cert: string;
  };
}

export interface ServerConfig {
  bypassVersionCheck: boolean;
  logLevel: string;
}

export interface Config {
  web: WebConfig;
  webFrontend: WebFrontendConfig;
  server: ServerConfig;
}

const configPath = join(__dirname, "config.toml");
const configContent = readFileSync(configPath, "utf-8");
const baseConfig = parse(configContent) as unknown as Config;

// Apply environment variable overrides for cloud deployment (e.g., Heroku)
const config: Config = {
  web: {
    ...baseConfig.web,
    address: process.env.WEB_ADDRESS || baseConfig.web.address,
    port: process.env.WEB_PORT ? parseInt(process.env.WEB_PORT, 10) : baseConfig.web.port,
    ports: process.env.SERVER_PORTS 
      ? process.env.SERVER_PORTS.split(",").map((p) => parseInt(p.trim(), 10))
      : baseConfig.web.ports,
    loginUrl: process.env.LOGIN_URL || baseConfig.web.loginUrl,
    cdnUrl: process.env.CDN_URL || baseConfig.web.cdnUrl,
  },
  webFrontend: {
    ...baseConfig.webFrontend,
    port: process.env.PORT 
      ? parseInt(process.env.PORT, 10) 
      : (process.env.WEB_FRONTEND_PORT 
        ? parseInt(process.env.WEB_FRONTEND_PORT, 10) 
        : baseConfig.webFrontend.port),
  },
  server: {
    ...baseConfig.server,
    logLevel: process.env.LOG_LEVEL || baseConfig.server.logLevel,
  },
};
const frontend = () => {
  return {
    tls: {
      key: readFileSync(config.webFrontend.tls.key),
      cert: readFileSync(config.webFrontend.tls.cert),
    },
  };
};
const logon = () => {
  return {
    tls: {
      key: readFileSync(config.web.tls.key),
      cert: readFileSync(config.web.tls.cert),
    },
  };
};

export { config, frontend, logon };
