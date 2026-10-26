import Image from "next/image";
import ParticleText from "@/components/animations/ParticleText";
import ScrollVelocity from "@/components/animations/ScrollVelocity";
import portrait from "@/foto/Foto saya.png";

export default function HomeSection() {
  return (
    <section className="portfolio-stage" id="home" aria-label="Beranda portofolio">
      <h1 className="sr-only">Muhammad Ibrahim Musyaffa</h1>
      <div className="portfolio-name" aria-hidden="true">
        <ScrollVelocity
          texts={[
            <ParticleText
              key="portfolio-name"
              className="portfolio-name-particle"
              text="MUHAMMAD IBRAHIM MUSYAFFA"
              fontSize={320}
              fontWeight={800}
              particleSize={2.1}
              density={5}
              color="#374151"
              highlightColor="#2563EB"
              scatter={160}
              gatherDuration={1800}
              stagger={380}
              pointerRepel={28}
              repelRadius={110}
              idleDrift={0.35}
              glow={false}
            />
          ]}
          velocity={-120}
          numCopies={4}
          className="portfolio-name-copy"
          parallaxClassName="portfolio-name-velocity"
          scrollerClassName="portfolio-name-track"
        />
      </div>
      <Image
        className="portfolio-portrait"
        src={portrait}
        alt="Muhammad Ibrahim Musyaffa"
        priority
        sizes="(max-width: 700px) 88vw, 48vw"
      />
    </section>
  );
}