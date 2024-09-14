import { cn } from "@/lib/utils";
import UserProfile from "@/components/custom/UserProfile";
import MenuList from "@/components/custom/menubar/menuList";

type Props = {
  className: string;
  displayProfile?: boolean;
};

const Menubar = ({ className, displayProfile }: Props) => {
  return (
    <div className={cn("", className)}>
      {displayProfile && (
        <div className="mb-2">
          <UserProfile />
        </div>
      )}
      <MenuList />
    </div>
  );
};

export default Menubar;
