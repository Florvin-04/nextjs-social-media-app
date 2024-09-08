import { Metadata } from "next";
import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata: Metadata = {
  title: "Login page",
};

const LoginPage = () => {
  return (
    <div className="flex h-[100svh] flex-col items-center justify-center">
      <div className="w-[min(50rem,90%)] bg-card py-3 px-3">
        <h1 className="text-center text-2xl font-bold">Log In</h1>
        <div className="flex justify-center mt-2">
          <GoogleSignInButton />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="h-px flex-1 bg-muted"/>
          <p>OR</p>
          <div className="h-px flex-1 bg-muted"/>
        </div>
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
