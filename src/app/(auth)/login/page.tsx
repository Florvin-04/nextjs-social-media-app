import { Metadata } from "next";
import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login page",
};

const LoginPage = () => {
  return (
    <div className="flex h-[100svh] flex-col items-center justify-center bg-red-500">
      <div className="w-[min(50rem,90%)] bg-card py-3">
        <h1 className="text-center font-bold">Log In</h1>
        <LoginForm />
        <div className="text-center">
          <Link className="hover:underline" href="/signup">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
