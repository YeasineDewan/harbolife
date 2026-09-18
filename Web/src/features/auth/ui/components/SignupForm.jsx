import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useSignupMutation } from "../../store/authApi";
import { setCredentials } from "../../store/authSlice";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import emailjs from "@emailjs/browser";

const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .trim()
      .toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signupMutation, { isLoading }] = useSignupMutation();
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setGlobalError("");
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await signupMutation(payload).unwrap();
      dispatch(setCredentials({ user: response.data, token: response.token }));

      try {
        await emailjs.send(
          "service_noarme9",
          "template_j0225k8",
          {
            user_name: payload.name,
            user_email: payload.email,
          },
          "j-3XGK0Gpytzm5UwR",
        );
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }

      navigate("/profile");
      
    } catch (err) {
      setGlobalError(err.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Name"
          type="text"
          {...register("name")}
          error={errors.name?.message}
          icon={<User className="h-5 w-5 text-(--color-text-muted)" />}
          placeholder="Enter your full name"
          className="bg-(--color-surface-input) dark:bg-[#2c2c2c]"
        />
      </div>

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
          placeholder="Create a password"
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

      <div>
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          icon={<Lock className="h-5 w-5 text-(--color-text-muted)" />}
          placeholder="Confirm your password"
          className="bg-(--color-surface-input) dark:bg-[#2c2c2c]"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-(--color-text-muted) hover:text-(--color-primary-600) dark:hover:text-green-400 transition-colors focus:outline-none"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? (
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
        className="w-full mt-2 bg-(--color-primary-600) hover:bg-(--color-primary-700) shadow-md"
      >
        {!isLoading && (
          <>
            Create Account <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
}
