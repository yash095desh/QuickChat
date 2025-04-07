"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Link from "next/link";
import * as Yup from "yup";
import { Formik } from "formik";
import FormError from "@/components/ui/FormError";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface formValues {
  email: string;
  password: string;
}

function SignIn() {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const { toast } = useToast();
  const router = useRouter();

  const initialValues: formValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(8).max(10),
  });


  const handleLogin = async (values: formValues) => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/login`,
        values
      );
      if(response.data.success){
        localStorage.setItem("token",response.data.user.token)
        toast({
          title: "Login Successful!",
          variant: "default",
        })
        router.push("/")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        console.log("Sign-In Error", error.response.data.message);
      } else {
        console.log("Sign-In Error", (error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className=" text-3xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <Formik
          initialValues={initialValues}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
        >
          {({
            errors,
            values,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="email"
                      placeholder="m@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email && (
                      <FormError text={errors.email} />
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="Password">Password</Label>
                    <div className=" flex gap-2 items-center group rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:outline-none border border-input shadow-sm ">
                      <Input
                        id="password"
                        type={showPass ? "text" : "password"}
                        minLength={8}
                        maxLength={10}
                        className=" border-none outline-none shadow-none focus-visible:ring-0"
                        onChange={handleChange}
                        value={values.password}
                        onBlur={handleBlur}
                      />
                      <span
                        className="px-2 cursor-pointer hover:opacity-50"
                        onClick={() => setShowPass((prev) => !prev)}
                      >
                        {showPass ? <EyeClosed /> : <Eye />}
                      </span>
                    </div>
                    {errors.password && touched.password && (
                      <FormError text={errors.password} />
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spinner /> : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Formik>

        <CardFooter className="flex flex-col space-y-3">
          <div className=" w-full">
            <GoogleLoginButton text="signin_with" />
          </div>
          <h2 className=" text-sm text-center">
            Don &apos t have an account?{" "}
            <Link className=" underline font-semibold" href={"/signUp"} prefetch={true}>
              Sign Up
            </Link>
          </h2>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignIn;
