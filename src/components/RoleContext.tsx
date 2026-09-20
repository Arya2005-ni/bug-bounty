"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/lib/types";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userAvatar: string;
}

const RoleContext = createContext<RoleContextType>({
  role: "RESEARCHER",
  setRole: () => {},
  userName: "Alex Vance",
  userAvatar: "👨‍💻",
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("RESEARCHER");

  useEffect(() => {
    const saved = localStorage.getItem("cyberscope_active_role") as UserRole;
    if (saved && ["RESEARCHER", "TRIAGER", "ADMIN"].includes(saved)) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("cyberscope_active_role", newRole);
  };

  const getUserMeta = () => {
    switch (role) {
      case "TRIAGER":
        return { userName: "Marcus Sterling", userAvatar: "🛡️" };
      case "ADMIN":
        return { userName: "Sarah Connor", userAvatar: "⚡" };
      default:
        return { userName: "Alex Vance", userAvatar: "👨‍💻" };
    }
  };

  const meta = getUserMeta();

  return (
    <RoleContext.Provider value={{ role, setRole, userName: meta.userName, userAvatar: meta.userAvatar }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
