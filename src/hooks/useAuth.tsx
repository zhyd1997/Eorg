import React, { createContext, useContext, useState } from "react";

interface AuthContext {
    user: any;
    signup: any;
    signin: any;
    signout: any;
}

const authContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signin = (username: string, password: string) => {};

    const signup = (username: string, password: string) => {};

    const signout = () => {};

    return {
        user,
        signin,
        signup,
        signout,
    };
}

export function ProvideAuth({ children }: any) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
