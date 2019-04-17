// import {env} from "process";

// const required = (envName: string, fallback?: string) => {
//     let result = env[envName];

//     if(result !== undefined) return result;
//     else if(fallback !== undefined) return fallback;

//     throw new Error(`Environment variable '${envName}' not found`)
// }

export interface IServerConfig {
        port: number;
        clientRelativePath: string;

        db: {
            host: string;
            port: number;
        };
}

const config: IServerConfig = {
    port: 9000,
    clientRelativePath: "client",

    db: {
        //host: "couch",
        host: "localhost",
        port: 5984,
    },
    // TO USE required():
    // username: required("PB_LDAP_USER"),
};

export const getConfig = () => config;
