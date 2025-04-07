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
import axios,{AxiosError} from 'axios'
import Spinner from "@/components/Spinner";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface formValues {
  name: string;
  email: string;
  password: string;
}

function SignUp() {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean | undefined>(false)
  const router = useRouter()
  // initial form values
  const initialValues: formValues = {
    name: "",
    email: "",
    password: "",
  };

  //validationSchema
  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).max(10).required(),
  });

  // handle Register
  const handleRegister = async(values:formValues) => {
    try {
      setLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/register`,values);
      console.log("User:",response.data)

      if(response.data.success){
        localStorage.setItem("token",response.data.user.token)
        toast({
          title: "Registration Successful!",
          variant: "default",
        })
        router.push("/")
      }
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        console.log("Sign-Up Error", error.response.data.message);
      } else {
        console.log("Sign-Up Error", (error as Error).message);
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className=" text-3xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleRegister}
        >
          {({ errors, values, touched ,handleChange, handleBlur, handleSubmit }) => (
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name && <FormError text={errors.name} />}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="email"
                      placeholder="m@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email && <FormError text={errors.email} />}
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
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span
                        className="px-2 cursor-pointer hover:opacity-50"
                        onClick={() => setShowPass((prev) => !prev)}
                      >
                        {showPass ? <EyeClosed /> : <Eye />}
                      </span>
                    </div>
                    {errors.password && touched.password && <FormError text={errors.password} />}
                  </div>

                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ?
                    <Spinner/>
                    :
                    "Create account"
                  }
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Formik>

        <CardFooter className="flex flex-col space-y-3">
          <div className=" w-full">
            <GoogleLoginButton text="signup_with" />
          </div>
          <h2 className=" text-sm text-center">
            Already have an account?{" "}
            <Link className=" underline font-semibold" href={"/signIn"} prefetch={true}>
              Sign In
            </Link>
          </h2>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
