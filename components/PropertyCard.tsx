import Image from "next/image";
import { X } from "lucide-react";
import type { Property } from "@/lib/properties";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

interface PropertyCardProps {
  property: Property;
  className?: string;
  index?: number;
}

function CardImage({
  src,
  alt,
  sizes,
  eager,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={eager || undefined}
      loading={eager ? undefined : "lazy"}
      className={className}
    />
  );
}

export function PropertyCard({
  property,
  className,
  index = 0,
}: PropertyCardProps) {
  const eager = index < 4;

  return (
    <article
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/45 shadow-none backdrop-blur-xl",
        className,
      )}
    >
      <button
        type="button"
        data-close
        aria-label={`Close ${property.title}`}
        className="absolute top-4 right-4 z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-white/65 bg-white/50 text-ink backdrop-blur-xl group-data-[expanded=true]/listing:flex"
      >
        <X size={15} strokeWidth={1.75} />
      </button>

      <div className="flex h-full min-h-0 flex-col md:flex-row">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-sand",
            "aspect-[16/11] min-h-[168px] md:aspect-auto md:h-auto md:w-[40%] md:min-h-[220px]",
            "group-data-[expanded=true]/listing:aspect-[16/10] group-data-[expanded=true]/listing:min-h-[220px]",
            "group-data-[expanded=true]/listing:md:w-[46%] group-data-[expanded=true]/listing:md:min-h-[320px]",
          )}
        >
          <CardImage
            src={property.image}
            alt={property.title}
            eager={eager}
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 28vw, 90vw"
          />
          {(property.premium || property.featured) && (
            <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-ivory uppercase backdrop-blur-md">
              {property.featured ? "Featured" : "Premium"}
            </span>
          )}
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center px-5 py-5 md:px-7 md:py-6">
          <div
            className={cn(
              "flex min-w-0 items-start justify-between gap-3",
              "group-data-[expanded=true]/listing:pr-12",
            )}
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[22px] leading-[1.05] break-words sm:text-[25px] md:text-[28px]">
                {property.title}
              </h3>
              <p className="mt-1.5 text-sm break-words text-ink-soft">
                {property.city}, {property.state}
              </p>
            </div>
            <p className="font-display shrink-0 text-[20px] leading-none text-ink sm:text-[24px] md:text-[26px]">
              {formatPrice(property.price)}
            </p>
          </div>

          <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-[0.12em] break-words text-ink-soft uppercase">
            {property.beds} Beds • {property.baths} Baths •{" "}
            {formatNumber(property.sqft)} sqft
          </p>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed break-words text-ink/80">
            “{property.blurb}”
          </p>

          <div
            data-ignore-toggle
            className="hidden min-w-0 group-data-[expanded=true]/listing:block"
          >
            <div className="mt-6 border-t border-ink/10 pt-6">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.gallery.map((src) => (
                  <div
                    key={src}
                    className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-[1rem_0.35rem_1rem_0.85rem] bg-sand"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="120px"
                      loading={eager ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>

              <p className="font-display mt-5 max-w-3xl text-[22px] leading-[1.3] break-words text-ink">
                {property.description}
              </p>

              <div className="mt-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ink-soft uppercase">
                  Features
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <li
                      key={f}
                      className="rounded-full bg-white/70 px-3.5 py-1.5 text-sm ring-1 ring-black/5"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[0.9rem_0.25rem_0.9rem_0.9rem] bg-sand">
                    <Image
                      src={property.agent.photo}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      loading={eager ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-xl leading-none break-words">
                      {property.agent.name}
                    </p>
                    <p className="mt-1 text-sm break-words text-ink-soft">
                      {property.agent.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <MagneticButton href="#contact" className="!px-5 !py-2.5 !text-[11px]">
                    Schedule Tour
                  </MagneticButton>
                  <MagneticButton
                    href="#contact"
                    variant="light"
                    className="!px-5 !py-2.5 !text-[11px]"
                  >
                    Contact
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
