/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";

export const ThemeContext: any = createContext("");

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
