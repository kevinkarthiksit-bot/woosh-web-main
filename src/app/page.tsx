import Image from "next/image";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main>
      <section className="relative h-screen text-white overflow-hidden pt-20">

        {/* BACKGROUND IMAGE */}
        <Image
          src="/images/hero-car.png"
          alt="Car wash"
          fill
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center px-6 md:px-20">
          <Container>
            <div className="max-w-xl">

              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                NO TRAVEL <br /> NO WAITING
              </h1>

              <p className="mt-6 text-lg md:text-xl text-gray-200">
                Just clean vehicles on your time
              </p>

              <div className="mt-8">
                <Button text="Book Now" className="px-8 py-4 text-lg" />
              </div>

            </div>
          </Container>
        </div>

      </section>
      <Services />
    </main>
  );
}