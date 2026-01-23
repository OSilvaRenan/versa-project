import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export interface UsuarioResponse {
  Codacesso: number;
  Codperfil: number;
  Codusuario: number;
  Codusuarioversa: number;
  Nome: string;
  Ddd: string;
  Telefone: string;
  Empresa: string;
  Cnpj: string;
  Datinclusao: string;
  Indativo: number;
  Userowner: number;
  Codcliente: number;
  Codempresa: number;
  Codvendedor?: number;
  Nomcliente: string;
  Obsentrega: string;
  Tipofrete: number;
  Codestado: number;
  Codtransportadora: number;
  Codrepresentante: number;
  Cgccpf: string;
  Email: string;
  Codalmoxarifado: number;
  Token: string;
  Codempresacli: number;
  Codoperacao: number;
}

declare module "next-auth" {
  interface Session {
    user: UsuarioResponse & DefaultSession["user"];
  }
  interface User extends Partial<UsuarioResponse> {
    id?: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UsuarioResponse;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as unknown as UsuarioResponse;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nome: { label: "Usuario", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nome || !credentials?.senha) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
            method: "POST",
            body: JSON.stringify({
                nome: credentials.nome,
                senha: credentials.senha
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) return null;

          const user = await res.json();

          if (user && user.Token) {
            return user;
          }
          
          return null;
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };