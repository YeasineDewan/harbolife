import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "../../../features/uiSlice/uiSlice";
import Button from "../../ui/Button";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      onClick={() => dispatch(toggleTheme())}
      className="text-white hover:bg-(--color-primary-600) dark:hover:bg-(--color-primary-800) transition-colors"
    >
      {darkMode ? (
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </Button>
  );
}
