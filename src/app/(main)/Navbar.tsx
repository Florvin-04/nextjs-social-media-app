import SearchField from "@/components/custom/SearchField";
import UserProfileButton from "@/components/custom/UserProfileButton";

const Navbar = () => {
  return (
    <header className="bg-card py-2 sticky top-0 z-10">
      <div className="mx-auto flex flex-wrap gap-2 w-[min(100rem,90%)] items-center justify-center">
        <h2>Vin</h2>
        <SearchField />
        <UserProfileButton />
      </div>
    </header>
  );
};

export default Navbar;
