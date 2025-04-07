"use client"
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "react-redux";
import { store } from "./store";

function ClientProvider({ children }: { children: React.ReactNode }) {
  const clientId =
    "368440763087-cp9l19pes64hic385tu7uuo0lm88ovip.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <Toaster />
        {children}
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default ClientProvider;
