import SearchField from "@/components/custom/SearchField";
import UserProfileButton from "@/components/custom/UserProfileButton";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card py-2">
      <div className="mx-auto flex w-[min(100rem,95%)] flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2>Vin</h2>
          <SearchField />
        </div>
        <UserProfileButton />
      </div>
    </header>
  );
};

export default Navbar;
