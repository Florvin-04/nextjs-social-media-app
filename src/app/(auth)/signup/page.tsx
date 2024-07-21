import { Metadata } from "next";
import SignUpForm from "./SignUpForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up page",
};

const signUpPage = () => {
  return (
    <div className="flex h-[100svh] flex-col bg-red-500">
      <div className="m-auto w-[min(50rem,90%)] bg-card py-3">
        <h1 className="text-center font-bold">Sign Up Form</h1>
        <SignUpForm />
        <div className="text-center">
          <Link className="hover:underline" href="/login">
            Already have an Account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
