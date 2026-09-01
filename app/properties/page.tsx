import { ImageStreamHero } from "@/components/ImageStreamHero";
import { MagneticButton } from "@/components/MagneticButton";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyListings } from "@/components/PropertyListings";
import { properties, streamImages } from "@/lib/properties";

const cities = [...new Set(properties.map((p) => p.city))];

export default function PropertiesPage() {
  const catalog = properties.map((p) => ({
    id: p.id,
    type: p.type,
    price: p.price,
    beds: p.beds,
    baths: p.baths,
    city: p.city,
    popular: p.popular,
    newest: p.newest,
    image: p.image,
    gallery: p.gallery,
    agentPhoto: p.agent.photo,
  }));

  const cards = Object.fromEntries(
    properties.map((property, index) => [
      property.id,
      <PropertyCard key={property.id} property={property} index={index} />,
    ]),
  );

  return (
    <main>
      <ImageStreamHero
        images={streamImages}
        className="min-h-0 min-[1400px]:h-[100svh] min-[1400px]:min-h-[720px]"
      >
        <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center px-6 pt-28 pb-12 text-center md:pt-32 md:pb-16 min-[1400px]:h-full min-[1400px]:pt-16 min-[1400px]:pb-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-10%] top-1/2 h-80 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(246,243,238,0.92)_0%,rgba(246,243,238,0.55)_42%,transparent_72%)]"
          />
          <p className="relative z-10 font-mono text-[11px] tracking-[0.32em] text-ink-soft uppercase">
            Private Marketplace
          </p>
          <h1 className="font-display relative z-10 mt-5 text-[clamp(2.6rem,10vw,3.25rem)] leading-[0.9] sm:text-7xl md:text-[84px]">
            Find Your Perfect Property
          </h1>
          <p className="relative z-10 mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            Choose from hundreds of carefully selected luxury homes, apartments,
            villas, and commercial spaces designed for every lifestyle.
          </p>
          <div className="relative z-10 mt-9 flex flex-wrap justify-center gap-3">
            <MagneticButton href="#listings">Explore Listings</MagneticButton>
            <MagneticButton href="#contact" variant="light">
              Talk to an Agent
            </MagneticButton>
          </div>
        </div>
      </ImageStreamHero>

      <PropertyListings cities={cities} catalog={catalog} cards={cards} />
    </main>
  );
}
