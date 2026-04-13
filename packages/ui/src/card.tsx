import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    // ✅ Added bg-white and rounded-xl to make it visible against the background
    <div className="border p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-xl border-b pb-4 font-semibold text-slate-800">
        {title}
      </h1>
      <div className="pt-4"> 
        {children}
      </div>
    </div>
  );
}