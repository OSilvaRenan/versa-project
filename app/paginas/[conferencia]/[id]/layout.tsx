'use client'

import { use } from "react";
import { ConferenciaProvider } from "./_components/ConferenciaContext";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>; 
}

export default function Layout({ children, params }: LayoutProps) {
    const resolvedParams = use(params);

    return (
        <ConferenciaProvider params={resolvedParams}>
            {children}
        </ConferenciaProvider>
    )
}