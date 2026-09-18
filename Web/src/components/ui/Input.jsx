import { forwardRef } from "react";

const SIZES = {
  sm: "py-2 text-sm",
  md: "py-2.5 text-sm",
};

const Input = forwardRef(function Input(
  { label, error, icon, rightIcon, size = "md", className = "", id, ...props },
  ref,
) {
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-(--color-text-label) dark:text-(--color-text-label) font-semibold text-sm"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="h-5 w-5 text-(--color-text-muted)">{icon}</span>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-xl border outline-none transition-all",
            "bg-(--color-surface-input) dark:bg-(--color-panel-dark)",
            "text-(--color-text-primary) dark:text-(--color-text-primary)",
            "placeholder:text-(--color-text-muted)",
            icon ? "pl-10" : "pl-4",
            rightIcon ? "pr-10" : "pr-4",
            SIZES[size] ?? SIZES.md,
            error
              ? "border-(--color-danger-500) focus:ring-2 focus:ring-(--color-danger-400)"
              : "border-(--color-border-input) dark:border-gray-600 focus:ring-2 focus:ring-(--color-primary-500)",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p
          className="text-(--color-danger-600) dark:text-(--color-danger-400) text-xs font-semibold"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
