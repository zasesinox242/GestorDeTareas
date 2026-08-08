import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Palette } from "@/config/theme/palette";

const THEME_STORAGE_KEY = "@gestor_tareas:theme_mode";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isThemeLoading, setIsThemeLoading] = useState(true);
  const palette = Palette[theme];

  useEffect(() => {
    let isMounted = true;

    const loadStoredTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && (stored === "light" || stored === "dark")) {
          setTheme(stored);
        }
      } catch {
        // Si falla la lectura, se mantiene el tema claro por defecto.
      } finally {
        if (isMounted) setIsThemeLoading(false);
      }
    };

    loadStoredTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistTheme = useCallback(async (next: "light" | "dark") => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Si no se puede persistir, la app sigue funcionando con el valor en memoria.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  return {
    palette,
    toggleTheme,
    isThemeLoading,
  };
};
