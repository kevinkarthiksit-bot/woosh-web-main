"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const serviceData: Record<string, { name: string; price: string }[]> = {
  "car-wash": [
    { name: "Basic Wash", price: "₹299" },
    { name: "Premium Wash", price: "₹499" },
    { name: "Full Detailing", price: "₹999" },
  ],
  "bike-wash": [
    { name: "Basic Wash", price: "₹149" },
    { name: "Premium Wash", price: "₹299" },
  ],
  "auto-wash": [
    { name: "Standard", price: "₹199" },
    { name: "Deep Clean", price: "₹399" },
  ],
  "monthly-packages": [
    { name: "Weekly Wash", price: "₹999/month" },
    { name: "Unlimited Wash", price: "₹1999/month" },
  ],
};

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;

  const packages = serviceData[slug] || [];

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // 🚀 SAVE TO FIRESTORE
  const handleBooking = async () => {
    if (!name || !phone || !address) {
      setError("Please fill all fields");
      return;
    }

    if (phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        service: slug,
        package: selectedPackage,
        time: selectedTime,
        name,
        phone,
        address,
        status: "pending",
        createdAt: new Date(),
      });

      setError("");
      alert("Booking Confirmed ✅");

      // Reset form
      setSelectedPackage(null);
      setSelectedTime(null);
      setName("");
      setPhone("");
      setAddress("");

    } catch (err) {
      console.error(err);
      alert("Error saving booking ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-black text-white p-6 md:p-10">

      {/* BACK */}
      <Link href="/" className="mb-6 text-blue-400 hover:underline inline-block">
        ← Back
      </Link>

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold capitalize mb-8">
        {slug.replace("-", " ")}
      </h1>

      {/* PACKAGES */}
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border transition ${
              selectedPackage === pkg.name
                ? "bg-blue-600 border-blue-400"
                : "bg-white/10 border-white/20 hover:shadow-xl"
            }`}
          >
            <h3 className="text-xl font-semibold">{pkg.name}</h3>
            <p className="mt-2 text-blue-400">{pkg.price}</p>

            <button
              onClick={() => {
                setSelectedPackage(pkg.name);
                document
                  .getElementById("time-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`mt-6 w-full py-3 rounded-lg font-medium transition ${
                selectedPackage === pkg.name
                  ? "bg-white text-blue-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {selectedPackage === pkg.name ? "Selected" : "Book Now"}
            </button>
          </div>
        ))}
      </div>

      {/* TIME */}
      {selectedPackage && (
        <div id="time-section" className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Select Time</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg border transition ${
                  selectedTime === time
                    ? "bg-blue-600 border-blue-400"
                    : "border-white/20 hover:bg-blue-600 hover:border-blue-400"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FORM */}
      {selectedTime && (
        <div className="mt-10 space-y-4 max-w-md">
          <h3 className="text-xl font-semibold">Enter Details</h3>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleBooking}
            disabled={!name || !phone || !address}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              !name || !phone || !address
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}