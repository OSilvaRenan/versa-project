'use client'

import { ConferenciaProvider } from "./_components/ConferenciaContext";

interface LayoutProps {
    children: React.ReactNode;
    params: { id: string };
}

export default function Layout({ children, params }: LayoutProps) {
    return (
        <ConferenciaProvider params={params}>
            {children}
        </ConferenciaProvider>
    )
}