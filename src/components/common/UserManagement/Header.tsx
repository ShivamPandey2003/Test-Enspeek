import { LuSearch, LuUserPlus } from "react-icons/lu";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import type { FC } from "react";

interface HeaderProp {
  value:string
  setValue: (e: React.ChangeEvent<HTMLInputElement>)=>void
}

const Header:FC<HeaderProp> = ({value, setValue}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full md:w-80">
        <LuSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10 bg-white"
          value={value}
          onChange={(e) => setValue(e)}
        />
      </div>
      <Button className="flex w-full items-center rounded px-4 py-1 text-md text-white md:w-auto bg-primary hover:bg-primary/90">
        <LuUserPlus className="mr-2 h-4 w-4" />
        Add New User
      </Button>
    </div>
  );
};

export default Header;
