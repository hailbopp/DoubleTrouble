//import {env} from "process";

// const required = (envName: string, fallback?: string) => {
//     let result = env[envName];
    
//     if(result !== undefined) return result;
//     else if(fallback !== undefined) return fallback;

//     throw new Error(`Environment variable '${envName}' not found`)
// }

export interface ServerConfig {
        port: number;
        clientRelativePath: string;

};

const config: ServerConfig = {
    port: 9000,
    clientRelativePath: "client",

    // TO USE required():
    //username: required("PB_LDAP_USER"),
};

export const getConfig = () => config;