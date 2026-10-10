import { FoundingCircle } from "@/components/home/founding-circle";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Join } from "@/components/home/join";
import { Pillars } from "@/components/home/pillars";
import { Statement } from "@/components/home/statement";
import { SupportBand } from "@/components/home/support-band";
import { Voices } from "@/components/home/voices";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Statement />
        <Pillars />
        <FoundingCircle />
        <Voices />
        <Faq />
        <Join />
        <SupportBand />
      </main>
      <SiteFooter />
    </>
  );
}
