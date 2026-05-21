"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import useStoreInfo from "@/hooks/useStore"

export function CarouselHomeMobile() {
  const storeInfo = useStoreInfo()
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  // Usa mobileBanners se existir, senão cai para banners normais
  const banners =
    storeInfo?.storeConfig?.mobileBanners?.length
      ? storeInfo.storeConfig.mobileBanners
      : storeInfo?.storeConfig?.banners ?? []

  if (!banners.length) return null

  return (
    <div className="md:hidden w-full">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={index} className="pl-0">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-52 object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
