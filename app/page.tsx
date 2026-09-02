import { Hero } from "@/components/Hero";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TestimonialGallery } from "@/components/TestimonialGallery";
import { EditorialAbout } from "@/components/EditorialAbout";
import { Stats } from "@/components/Stats";
import { Timeline } from "@/components/Timeline";
import { FAQ } from "@/components/FAQ";
import { featuredProperties } from "@/lib/properties";
import { formatPrice, formatNumber } from "@/lib/utils";

function editorialTitle(title: string) {
  const parts = title.split(" ");
  if (parts.length <= 2) return parts.join("\n");
  return `${parts.slice(0, -1).join(" ")}\n${parts[parts.length - 1]}`;
}

export default function HomePage() {
  const carouselItems = featuredProperties.map((p) => ({
    id: p.id,
    title: editorialTitle(p.title),
    image: p.image,
    credit: `${p.city}, ${p.state}`.toUpperCase(),
    meta: [
      formatPrice(p.price),
      `${p.beds} Beds`,
      `${formatNumber(p.sqft)} Sqft`,
    ],
    accent: p.accent,
  }));

  return (
    <main>
      <Hero />

      <section className="relative bg-ivory">
        <div className="mx-auto max-w-[1400px] px-6 pt-28 pb-10 md:px-10 md:pt-32 md:pb-12">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft uppercase">
            Featured Residences
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-5xl leading-[0.95] md:max-w-4xl md:text-6xl">
            Homes that Hold
            <br />
            the Light
          </h2>
        </div>
        <div className="h-[540px] md:h-[560px]">
          <HeroCarousel
            items={carouselItems}
            defaultIndex={2}
            autoplay
            autoplayDelay={2000}
            brand="EasyEstate"
          />
        </div>
      </section>

      <section className="relative overflow-hidden py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft uppercase">
            Lived In
          </p>
          <h2 className="font-display mt-3 max-w-xl text-5xl leading-[0.95] md:text-6xl">
            Flip a Residence
            <br />
            Meet the family.
          </h2>
          <p className="mt-4 max-w-md text-ink-soft">
            Click any card. The other side is a real story — not a listing
            caption.
          </p>
        </div>

        <TestimonialGallery properties={featuredProperties} />
      </section>

      <EditorialAbout />
      <Stats />
      <Timeline />
      <FAQ />
    </main>
  );
}
