import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "../../models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface AuthState {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;
  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set((state) => {
          state.hydrated = true;
        });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");

          set((state) => {
            state.session = session;
          });
        } catch (error) {
          console.error("Error verifying session:", error);
        }
      },

      async login(email, password) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }

          set((state) => {
            state.session = session;
            state.user = user;
            state.jwt = jwt;
          });

          return { success: true, error: null };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, error: error as AppwriteException };
        }
      },

      async createAccount(email, password, name) {
        try {
          await account.create(ID.unique(), email, password, name);

          return { success: true, error: null };
        } catch (error) {
          console.error("Error creating account:", error);
          return { success: false, error: error as AppwriteException };
        }
      },

      async logout() {
        try {
          await account.deleteSession("current");

          set((state) => {
            state.session = null;
            state.jwt = null;
            state.user = null;
          });
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            state?.setHydrated();
          }
        };
      },
    }
  )
);
