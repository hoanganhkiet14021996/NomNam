import * as React from "react"
import { Drawer as Vaul } from "vaul"

import { cn } from "@/lib/utils"

/** Bottom sheet (vuốt xuống để đóng). */
function Drawer(props: React.ComponentProps<typeof Vaul.Root>) {
  return <Vaul.Root repositionInputs={false} {...props} />
}

function DrawerContent({
  className,
  children,
  title,
  description,
  ...props
}: React.ComponentProps<typeof Vaul.Content> & { title: string; description?: string }) {
  return (
    <Vaul.Portal>
      <Vaul.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
      <Vaul.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl border border-b-0 bg-background outline-none",
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/25" />
        <Vaul.Title className="sr-only">{title}</Vaul.Title>
        <Vaul.Description className="sr-only">{description ?? title}</Vaul.Description>
        {children}
      </Vaul.Content>
    </Vaul.Portal>
  )
}

export { Drawer, DrawerContent }
