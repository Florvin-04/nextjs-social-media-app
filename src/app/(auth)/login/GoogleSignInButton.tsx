import Icon from "@/assets/icons";
import { Button } from "@/components/ui/button";

export default function GoogleSignInButton() {
  return (
    <Button
      variant="outline"
      className=""
      asChild
    >
      <a href="/login/google" className="flex w-full items-center gap-2 bg-white text-black rounded-md justify-center py-2">
        <Icon.Google />
        Sign in with Google
      </a>
    </Button>
  );
}
