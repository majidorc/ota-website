import React from "react";
import AdminHeader from "../components/AdminHeader";
import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
} 