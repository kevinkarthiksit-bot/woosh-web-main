"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [slotAvailability, setSlotAvailability] = useState<Record<string, any>>({});
  const [capacity, setCapacity] = useState(3);

  // 🔥 NEW SETTINGS STATE
  const [slotSettings, setSlotSettings] = useState<any>({
    customSlots: {},
    blockedDates: [],
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const times = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

  // 🔥 FETCH SLOT SETTINGS
useEffect(() => {
  const fetchSettings = async () => {
    try {
      const ref = doc(db, "slotSettings", "global");
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setCapacity(data.defaultCapacity || 3);

        setSlotSettings({
          customSlots: data.customSlots || {},
          blockedDates: data.blockedDates || [],
        });
      }
    } catch (err) {
      console.error("Error fetching slot settings:", err);
    }
  };
  fetchSettings();

  // 🔥 REFRESH every time page loads fresh
}, []);

  // 🔥 SLOT AVAILABILITY
  useEffect(() => {
    const fetchAvailability = async () => {
      const q = query(
  collection(db, "bookings"),
  where("date", "==", selectedDate)
);

      const snapshot = await getDocs(q);

      const slotMap: Record<string, number> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (!slotMap[data.time]) {
          slotMap[data.time] = 0;
        }

        slotMap[data.time]++;
      });

      const formatted: Record<string, any> = {};

      times.forEach((time) => {
        const count = slotMap[time] || 0;

        const slotCapacity =
          slotSettings.customSlots[time] || capacity;

        formatted[time] = {
          count,
          isFull: count >= slotCapacity,
        };
      });

      setSlotAvailability(formatted);
    };

    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate, slug, capacity, JSON.stringify(slotSettings)]);

  const handleBooking = async () => {
    if (!name || !phone || !address || !selectedDate || !selectedTime) {
      setError("Please fill all fields");
      return;
    }

    if (phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    try {
      // 🔥 SAFETY CHECK (WITH SLOT CAPACITY)
      const slotCapacity =
        slotSettings.customSlots[selectedTime] || capacity;

      const q = query(
  collection(db, "bookings"),
  where("date", "==", selectedDate),
  where("time", "==", selectedTime)
);

      const snapshot = await getDocs(q);

      if (snapshot.size >= slotCapacity) {
        alert("Slot just got full. Please select another time.");
        return;
      }

await addDoc(collection(db, "bookings"), {
  service: slug,
  package: selectedPackage,

  serviceDate: selectedDate,   // 🔥 renamed
  serviceTime: selectedTime,   // 🔥 renamed

  orderDate: new Date(),       // 🔥 renamed

  name,
  phone,
  address,
  status: "pending",
});

      const message = `
🚗 New Booking - Woosh

Service: ${slug}
Package: ${selectedPackage}
Date: ${selectedDate}
Time: ${selectedTime}

Name: ${name}
Phone: ${phone}
Address: ${address}
      `;

      window.open(
        `https://wa.me/919663891916?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      setSuccess(true);

    } catch (err) {
      console.error(err);
      alert("Error saving booking ❌");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-green-400">
            🎉 Booking Confirmed
          </h1>
          <p className="text-gray-400 mb-6">
            We’ve received your booking. Our team will contact you shortly.
          </p>

          <Link
            href="/"
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-black text-white p-6 md:p-10">

      <Link href="/" className="mb-6 text-blue-400 hover:underline inline-block">
        ← Back
      </Link>

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
              onClick={() => setSelectedPackage(pkg.name)}
              className="mt-6 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Select
            </button>
          </div>
        ))}
      </div>

      {/* DATE */}
      {selectedPackage && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Select Date</h2>

          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-3 rounded-lg bg-white/10 border border-white/20"
          />
        </div>
      )}

      {/* BLOCKED DATE MESSAGE */}
      {slotSettings.blockedDates.includes(selectedDate) && (
        <p className="text-red-400 mt-4">
          This date is unavailable. Please select another date.
        </p>
      )}

      {/* TIME */}
      {selectedDate && !slotSettings.blockedDates.includes(selectedDate) && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Select Time</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {times.map((time) => {
              const availability = slotAvailability[time];
              const isFull = availability?.isFull;

              return (
                <button
                  key={time}
                  disabled={isFull}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border transition ${
                    isFull
                      ? "bg-gray-700 cursor-not-allowed opacity-50"
                      : selectedTime === time
                      ? "bg-blue-600 border-blue-400"
                      : "border-white/20 hover:bg-blue-600 hover:border-blue-400"
                  }`}
                >
                  <span>{time}</span>
                </button>
              );
            })}
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
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}