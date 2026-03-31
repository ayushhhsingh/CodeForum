import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "appwrite";
import type { UserPrefs } from "@/models/user";
import { account } from "../../models/client/config";

function toAuthError(error: unknown): AppwriteException {
  if (error instanceof AppwriteException) {
    return error;
  }

  if (error instanceof Error && /failed to fetch/i.test(error.message)) {
    return new AppwriteException(
      "Unable to reach Appwrite from the browser. Check the Appwrite endpoint and add this Vercel domain to Appwrite Platforms."
    );
  }

  return new AppwriteException("Unexpected authentication error");
}

interface AuthState {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;
  setHydrated(): void;
  refreshUser(): Promise<void>;
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

      async refreshUser() {
        try {
          const user = await account.get<UserPrefs>();

          set((state) => {
            state.user = user;
          });
        } catch (error) {
          console.error("Error refreshing user:", error);
        }
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          const user = await account.get<UserPrefs>();

          set((state) => {
            state.session = session;
            state.user = user;
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
          return { success: false, error: toAuthError(error) };
        }
      },

      async createAccount(email, password, name) {
        try {
          await account.create(ID.unique(), email, password, name);

          return { success: true, error: null };
        } catch (error) {
          console.error("Error creating account:", error);
          return { success: false, error: toAuthError(error) };
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
