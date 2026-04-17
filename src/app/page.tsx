"use client";

import Link from "next/link";

const services = [
  {
    title: "Car Wash & Care",
    slug: "car-wash",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9",
  },
  {
    title: "Bike Wash & Care",
    slug: "bike-wash",
    image: "https://images.unsplash.com/photo-1558981403-c5f9891c2c8b",
  },
  {
    title: "Monthly Packages",
    slug: "monthly-packages",
    image: "https://images.unsplash.com/photo-1592853625601-bb9d23da12d1",
  },
  {
    title: "Auto Wash & Care",
    slug: "auto-wash",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 bg-black text-white">

      {/* 🌌 GLOBAL GLOW BACKGROUND */}
      <div className="fixed inset-0 -z-10 
        bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_40%),
             radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.15),transparent_40%)]" />

      {/* HERO */}
      <section className="relative h-[85vh] flex items-center justify-center text-center px-6">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Premium Doorstep Car & Bike Wash
          </h1>

          <p className="mt-5 text-gray-300">
            Experience next-level cleaning with Woosh.
          </p>

          <a
            href="#services"
            className="inline-block mt-8 px-8 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-blue-500 to-indigo-500
            hover:scale-105 transition shadow-lg shadow-blue-500/30"
          >
            Book Now
          </a>
        </div>
      </section>

      {/* WHY US */}
      <section className="px-6 py-28 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-16">
          Why Choose Woosh
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { title: "Eco-Friendly", desc: "Low water usage" },
            { title: "Trained Experts", desc: "Verified professionals" },
            { title: "Affordable", desc: "Premium pricing" },
            { title: "On-Time", desc: "Always punctual" },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl text-center
              bg-white/5 border border-blue-500/20 backdrop-blur-xl
              transition duration-500 hover:scale-105
              hover:border-blue-400
              hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]"
            >
              {/* glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition
                bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 blur-xl" />

              <div className="relative">
                <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-300 transition">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-28 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-16">
          Our Services
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer
                bg-white/5 border border-blue-500/20 backdrop-blur-xl
                transition duration-500 hover:scale-105
                hover:border-blue-400
                hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
              >

                {/* glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition
                  bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 blur-xl" />

                {/* image */}
                <div className="relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* text */}
                <div className="relative p-6 text-center">
                  <h3 className="text-lg font-semibold group-hover:text-blue-300 transition">
                    {s.title}
                  </h3>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-28 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-16">
          Customer Testimonials
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden
              bg-white/5 border border-blue-500/20 backdrop-blur-xl
              hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition"
            >
              <img
                src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9"
                className="w-full h-64 object-cover"
              />

              <div className="p-5 text-sm text-gray-300">
                Real customer experience with Woosh.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Book Your Wash Today
        </h2>

        <a
          href="#services"
          className="px-10 py-4 rounded-xl font-semibold text-lg
          bg-gradient-to-r from-blue-500 to-indigo-500
          hover:scale-105 transition
          shadow-lg shadow-blue-500/40"
        >
          Get Started
        </a>
      </section>

    </main>
  );
}