"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
