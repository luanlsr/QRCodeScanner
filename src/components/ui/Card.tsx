import React from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl shadow-md bg-white">{children}</div>
);

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`p-4 ${className}`}>{children}</div>
);
