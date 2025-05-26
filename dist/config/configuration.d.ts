declare const _default: () => {
    port: number;
    database: {
        uri: string;
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    jwt: {
        secret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    email: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
};
export default _default;
