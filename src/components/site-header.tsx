import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TitlePage } from "./title-page"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
          <TitlePage />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://wa.me/5591993078307?text=Ol%C3%A1!%20Sou%20cliente%20Delivery%20Track%20e%20gostaria%20de%20suporte%20em%20..."
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Suporte
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
