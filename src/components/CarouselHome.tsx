"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import useStoreInfo from "@/hooks/useStore"

export function CarouselHome() {
  const storeInfo = useStoreInfo()
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  const banners = storeInfo?.storeConfig?.banners ?? []

  if (!banners.length) return null

  return (
    <div className="w-full hidden md:block">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full overflow-hidden">
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[380px] lg:h-[440px] object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
    </div>
  )
}
