'use client'
import { sidebarLinks } from '@/contants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Sidebar() {
  const pathName = usePathname()
  return (
    <section
    className='sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-darks-1 p-6 pt-28 text-white max-sm:hidden lg:-w-[246px]'
    >
        <div className="flex felx-1 flex-col gap-6">
            {sidebarLinks.map(links => {
              const isActive = pathName === links.route || pathName.startsWith(`${links.route}/`);

              return (
                <Link
                href={links.route}
                key={links.label}
                className={cn('flex gap-4 items-center p-4 rounded-lg justify-start', {
                  'bg-blue-1': isActive,
                })}
                >
                  <Image
                  src={links.imageUrl}
                  alt={links.label}
                  width={24}
                  height={24}
                  />
                  <p className='text-lg font-semibold max-lg:hidden'>
                    {links.label}
                  </p>
                </Link>
              )
            })}
        </div>
    </section>
  )
}

export default Sidebar