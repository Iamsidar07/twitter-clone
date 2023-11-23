import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = useCallback(
    (value: string) => {
      setTheme(value);
      setIsOpen(false);
    },
    [setTheme],
  );

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute right-3">
      <div className="relative">
        <div
          onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
          className=" w-8 h-8 hover:opacity-80 border rounded-md cursor-pointer grid place-content-center"
        >
          <Sun className="w-5 h-5" />
        </div>
        {isOpen ? (
          <div className="border rounded-md absolute right-4 top-12  p-2 w-44 bg-white dark:bg-[#17202A] z-50">
            <p
              className="hover:bg-white/70 dark:hover:bg-dark2 transition-colors px-4 py-2 rounded-md cursor-pointer"
              onClick={() => handleThemeChange("system")}
            >
              System
            </p>
            <p
              className="hover:bg-white/70 dark:hover:bg-dark2 transition-colors px-4 py-2 rounded-md cursor-pointer"
              onClick={() => handleThemeChange("light")}
            >
              Light
            </p>
            <p
              className="hover:bg-white/70 dark:hover:bg-dark2 transition-colors px-4 py-2 rounded-md cursor-pointer"
              onClick={() => handleThemeChange("dark")}
            >
              Dark
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
