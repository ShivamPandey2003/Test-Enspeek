import React, { useState } from "react";
import type { AdminPanelUser } from "../../../api-network/admin-panel/query";
import UserCard, { type AdminPanelActionType } from "./UserCard";

interface UserDisplayProps {
  userData: AdminPanelUser[];
  onAction: (user: AdminPanelUser, action: AdminPanelActionType) => void;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ userData, onAction }) => {
  const [openDropdownUserId, setOpenDropdownUserId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {userData.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isDropdownOpen={openDropdownUserId === user.id}
          onDropdownToggle={() =>
            setOpenDropdownUserId((currentId) =>
              currentId === user.id ? null : user.id
            )
          }
          onDropdownClose={() => setOpenDropdownUserId(null)}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default UserDisplay;
