"use client";

import Link from "next/link";

const services = [
  {
    title: "Car Wash & Care",
    slug: "car-wash",
    image: "/images/car.png",
  },
  {
    title: "Monthly Packages",
    slug: "monthly-packages",
    image: "/images/monthly.png",
  },
  {
    title: "Bike Wash & Care",
    slug: "bike-wash",
    image: "/images/bike.png",
  },
  {
    title: "Auto Wash & Care",
    slug: "auto-wash",
    image: "/images/auto.png",
  },
];

export default function Services() {


  return (
    <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#0f172a] via-[#111827] to-black text-white">

      {/* HEADING */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        <span className="text-blue-400">Our</span> Services
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {services.map((service, index) => (
      <Link
  key={index}
  href={`/services/${service.slug}`}
  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 cursor-pointer hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 hover:border-blue-400 active:scale-95 transition-all duration-300 ease-in-out block"
>
  <h3 className="text-md font-semibold mb-3 text-white text-center">
    {service.title}
  </h3>

  <img
    src={service.image}
    alt={service.title}
    className="w-full h-28 object-contain mb-3 mx-auto"
  />
</Link>
        ))}

      </div>

    </section>
  );
}