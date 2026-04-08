"use client";

import Button from "@/components/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 md:px-20 py-4">

        {/* LOGO */}
        <h1 className="text-white text-2xl font-bold">
          Woosh
        </h1>

        {/* CTA BUTTON */}
        <Button text="Book Now" />

      </div>
    </nav>
  );
}