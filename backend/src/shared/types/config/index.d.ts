import { StringValue } from "ms";
export interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl?: string;
    cors: {
        origin: string;
    };
    cloudinary: {
        cloudName?: string;
        apiKey?: string;
        apiSecret?: string;
    };
    jwt: {
        secret: string;
        accessTokenExpiry: StringValue | number;
        refreshTokenExpiry: StringValue | number;
    };
}