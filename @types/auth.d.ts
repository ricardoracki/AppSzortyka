declare module Auth {
  interface IUser {
    id: string;
    name: string;
    active: boolean;
    role: "guest" | "mod" | "owner";
    /**
     * guest -> somente visualiza os dados
     * mod -> cria e edita os dados
     * owner -> gerencia outros usuarios
     */
  }

  interface Context {
    user: IUser | undefined;
    login: (u: IUser) => void;
    logout: () => void;
    authenticated: Boolean | undefined;
  }
}
