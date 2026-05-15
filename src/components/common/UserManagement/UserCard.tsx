import { Card, CardContent } from "../../ui/Card";
import Button from "../../ui/Button";
import { LuPencilLine } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa6";
import { useEffect, useRef, useState, type FC } from "react";
import DropDown from "../../global/DropDown";

export type UserProps = {
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
};

const DropDownData:DropdownData[] = [
  {
    Title:"Edit",
    onClick: ()=>{}
  }
]

const UserCard: FC<UserProps> = ({ name, email, role, status, lastActive }) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Card className="overflow-hidden bg-white border-gray-100">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <div className="h-full w-full flex items-center justify-center bg-primary text-white text-xl">
                  {name[0]}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-medium block mb-1">Role</span>
                <span>{role}</span>
              </div>
              <div>
                <span className="text-xs font-medium block mb-1">
                  Last Active
                </span>
                <span>{lastActive}</span>
              </div>
              <div>
                <span className="text-xs font-medium block mb-1">Status</span>
                <span>{status}</span>
              </div>
            </div>
          </div>
          <div className="border-t p-4 flex justify-end gap-2">
            <Button
              varinat={"ghost"}
              size={"sm"}
              className="flex text-md items-center"
            >
              <LuPencilLine className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button
              varinat={"ghost"}
              size={"sm"}
              className="flex text-md items-center"
              onClick={() => setIsOpenDropdown((pre) => !pre)}
            >
              <FaChevronDown className="h-3 w-3 mr-2" />
              Action
            </Button>
          </div>
        </CardContent>
      </Card>
      {isOpenDropdown && (
        <DropDown Data={DropDownData} className="-mt-4 mr-4"/>
      )}
    </div>
  );
};

export default UserCard;
