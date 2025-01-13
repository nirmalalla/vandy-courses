'use client'

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { CookiesProvider } from "react-cookie";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CookiesProvider><AntdRegistry>{children}</AntdRegistry></CookiesProvider>;
}