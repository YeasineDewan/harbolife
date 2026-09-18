import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../../store/authApi";
import { setCredentials } from "../../store/authSlice";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setGlobalError("");
    try {
      const response = await loginMutation(data).unwrap();
      dispatch(setCredentials({ user: response.data }));
      navigate("/");
    } catch (err) {
      setGlobalError(
        err.data?.message || "Invalid email or password. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Input
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          icon={<Mail className="h-5 w-5 text-(--color-text-muted)" />}
          placeholder="Enter your email"
          className="bg-(--color-surface-input) dark:bg-[#2c2c2c]"
        />
      </div>

      <div>
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={errors.password?.message}
          icon={<Lock className="h-5 w-5 text-(--color-text-muted)" />}
          placeholder="Enter your password"
          className="bg-(--color-surface-input) dark:bg-[#2c2c2c]"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-(--color-text-muted) hover:text-(--color-primary-600) dark:hover:text-green-400 transition-colors focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />
      </div>

      {globalError && (
        <div className="p-3 bg-(--color-danger-50) dark:bg-(--color-danger-900) border border-(--color-danger-200) dark:border-red-800 text-(--color-danger-600) dark:text-(--color-danger-400) rounded-lg text-center font-semibold text-sm">
          {globalError}
        </div>
      )}

      <Button
        type="submit"
        variant="solid"
        size="lg"
        fullWidth
        isLoading={isLoading}
        className="bg-(--color-primary-600) hover:bg-(--color-primary-700) shadow-md mt-2"
      >
        {!isLoading && (
          <>
            Login <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
}
