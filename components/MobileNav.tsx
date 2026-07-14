'use client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/contants";
import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

function MobileNav() {
  const pathName = usePathname()
  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={36}
            height={24}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-darks-1">
          <SheetHeader>
            <Link
              href="/"
              className="flex items-center gap-1"
            >
              <Image
                src="/icons/logo.svg"
                width={32}
                height={32}
                alt="Yoom logo"
                className="max-sm:size-10"
              />
              <p className="text-[26px] font-extrabold text-white max-sm:hidden">Yoom</p>
            </Link>
          </SheetHeader>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full gap-6 flex-col pt-16 text-white">
                {sidebarLinks.map(links => {
                  const isActive = pathName === links.route ;
                  return (
                    <SheetClose asChild key={links.route}>
                      <Link
                        href={links.route}
                        key={links.label}
                        className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60', {
                          'bg-blue-1': isActive,
                        })}
                      >
                        <Image
                          src={links.imageUrl}
                          alt={links.label}
                          width={20}
                          height={20}
                        />
                        <p className='font-semibold'>
                          {links.label}
                        </p>
                      </Link>
                    </SheetClose>

                  )
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav