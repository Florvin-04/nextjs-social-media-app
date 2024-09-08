import Icon from "@/assets/icons";
import { Button } from "@/components/ui/button";

export default function GoogleSignInButton() {
  return (
    <Button
      variant="outline"
      className="bg-white text-black hover:bg-gray-100 hover:text-black"
      asChild
    >
      <a href="/login/google" className="flex w-full items-center gap-2">
        <Icon.Google />
        Sign in with Google
      </a>
    </Button>
  );
}
