import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/settings/public")
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}