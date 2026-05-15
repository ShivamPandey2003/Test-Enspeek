import Button from "../../../ui/Button";
import GoogleIcon from "../../../../assets/icons/GoogleIcon";
import Input from "../../../ui/Input";
import { LuArrowRight, LuEye, LuEyeOff } from "react-icons/lu";
import React from "react";
import { cn } from "../../../../utils";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../../services/apiService";
import LoaderSpinner from "../../../global/LoaderSpinner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import { Login } from "../../../../store/UserSlice";
import AuthCard from "./AuthCard";

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { mutate, isPending } = useMutation({
    mutationKey: ["Login"],
    mutationFn: async (obj: { username: string; password: string }) => {
      const res = await apiRequest("post", "user/login", obj);
      const data = await res.response;
      return data;
    },
    onSuccess: (data: any) => {
      dispatch(
        Login({
          ...data,
          apiToken: data.apitoken,
          firstName: data.firstname,
          lastName: data.lastname,
          userType: data.usertype,
        }),
      );
      toast.success("Login Successful!");
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: { email?: string; password?: string } = {};

    if (email === "") {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    const randomOne = Math.floor(Math.random() * 10) + 3;
    const randomTwo = Math.floor(Math.random() * 10) + 3;

    if (Object.keys(newErrors).length === 0) {
      mutate({
        username: email,
        password: btoa(randomOne + "&^" + password + "&^" + randomTwo),
      });
    }
  };

  return (
    <AuthCard
      title="Welcome Back!"
      subtitle="Sign in to your account"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Input id="email" variant="login" data-test-id="EMAIL" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          {errors.email && (
            <p className="mt-1 text-sm text-[var(--color-core-danger)]">{errors.email}</p>
          )}
        </div>
        <div>
          <div className="relative">
            <Input id="password" variant="login" type={isPasswordVisible ? "text" : "password"} data-test-id="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="pr-11" />
            <Button
              type="button"
              varinat="ghost"
              size="icon"
              className="absolute inset-y-0 right-1 my-auto h-10 w-10 border-0 bg-transparent p-0 text-[var(--color-text-muted)] shadow-none hover:bg-transparent hover:text-[var(--color-text-default)]"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </Button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-[var(--color-core-danger)]">{errors.password}</p>
          )}
        </div>
        <Button type="submit" data-test-id="SUBMIT" className={cn(
          "h-12 w-full rounded-xl bg-gradient-to-r from-login-primary to-login-bg-end text-base font-semibold text-white transition-all duration-300 hover:from-login-primary-hover hover:to-login-primary",
        )}>
          <span className="flex items-center justify-center">
            Sign in
            <LuArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t theme-border-soft" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-login-card px-3 text-login-muted">or</span>
          </div>
        </div>
        <Button varinat={"social"} className="h-12 rounded-xl text-[15px] font-medium cursor-not-allowed" disabled>
          <GoogleIcon />
          <span>Continue with Google</span>
        </Button>
        <div className="text-center">
          <Button varinat={"link"} className="cursor-not-allowed text-sm transition-colors" disabled>
            Forgot password?
          </Button>
        </div>
      </form>
      {isPending && <LoaderSpinner />}
    </AuthCard>
  );
};

export default LoginForm;
