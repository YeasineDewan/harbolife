import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const BASE =
  "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";

const VARIANTS = {
  solid:
    "bg-(--color-primary-700) hover:bg-(--color-primary-800) text-white shadow-md focus-visible:ring-(--color-primary-600)",
  outline:
    "border-2 border-(--color-primary-700) text-(--color-primary-700) hover:bg-(--color-primary-700) hover:text-white dark:border-(--color-primary-400) dark:text-(--color-primary-400) dark:hover:bg-(--color-primary-700) dark:hover:text-white focus-visible:ring-(--color-primary-600)",
  ghost:
    "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
  danger:
    "bg-(--color-danger-50) dark:bg-(--color-danger-900) text-(--color-danger-600) hover:bg-red-100 dark:hover:bg-red-900/40 focus-visible:ring-(--color-danger-500)",
  "danger-ghost":
    "text-(--color-danger-600) hover:text-(--color-danger-700) hover:bg-(--color-danger-50) dark:hover:bg-(--color-danger-900) focus-visible:ring-(--color-danger-500)",
};

const SIZES = {
  sm: "px-4 py-2 text-sm rounded-lg min-h-[36px]",
  md: "px-6 py-2.5 text-sm rounded-xl min-h-[42px]",
  lg: "px-8 py-3.5 text-base rounded-xl min-h-[52px]",
  icon: "w-8 h-8 rounded-lg flex-shrink-0",
};

const ROUNDED = {
  md: "",
  full: "!rounded-full",
};

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "solid",
    size = "md",
    isLoading = false,
    fullWidth = false,
    rounded = "md",
    children,
    className = "",
    disabled,
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      disabled={Component === "button" ? (disabled || isLoading) : undefined}
      className={[
        BASE,
        VARIANTS[variant] ?? VARIANTS.solid,
        SIZES[size] ?? SIZES.md,
        ROUNDED[rounded] ?? "",
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin shrink-0 text-current" />
      ) : (
        children
      )}
    </Component>
  );
});

export default Button;
