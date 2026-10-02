import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicBreadcrumbs } from "./DynamicBreadcrumbs";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar className="mt-20 bg-sidebar" />
      <SidebarInset className="mt-20 w-lg">
        <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-1 px-4">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumbs />
          </div>
        </header>
       <div className="flex flex-1 flex-col p-0 gap-0 sm:p-4 sm:gap-4 sm:pt-0">{children}</div>
      </SidebarInset>
    </>
  );
}
