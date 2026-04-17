"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

type Booking = {
  id: string;
  service: string;
  package: string;
  time: string;
  name: string;
  phone: string;
  address: string;
  status?: string;
  rejectionReason?: string;
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // SLOT SETTINGS
  const [defaultCapacity, setDefaultCapacity] = useState(3);
  const [slotInputs, setSlotInputs] = useState<any>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");

  const times = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

  // REAL-TIME BOOKINGS
  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(data);
    });

    return () => unsubscribe();
  }, []);

  // FETCH SLOT SETTINGS
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, "slotSettings", "global");
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setDefaultCapacity(
            data.defaultCapacity !== undefined ? data.defaultCapacity : 3
          );

          const cleaned: any = {};
          Object.keys(data.customSlots || {}).forEach((key) => {
            cleaned[key.trim()] = data.customSlots[key];
          });

          setSlotInputs(cleaned);
          setBlockedDates(data.blockedDates || []);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  // SAVE SETTINGS
  const saveSettings = async () => {
    if (defaultCapacity < 1) {
      alert("Capacity must be at least 1");
      return;
    }

    try {
      const ref = doc(db, "slotSettings", "global");

      const cleanedSlots: any = {};
      Object.keys(slotInputs).forEach((key) => {
        cleanedSlots[key.trim()] = Number(slotInputs[key]);
      });

      await setDoc(ref, {
        defaultCapacity,
        customSlots: cleanedSlots,
        blockedDates,
      });

      alert("Settings updated ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update ❌");
    }
  };

  // UPDATE STATUS
  const updateStatus = async (
    id: string,
    newStatus: string,
    reason?: string
  ) => {
    try {
      const ref = doc(db, "bookings", id);

      await updateDoc(ref, {
        status: newStatus,
        ...(reason && { rejectionReason: reason }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-32 p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <a
          href="/admin/analytics"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
        >
          View Analytics
        </a>
      </div>

      {/* SLOT SETTINGS */}
      <div className="mb-10 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4">Slot Settings</h2>

        {/* DEFAULT CAPACITY */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-400">Default Capacity</p>
          <input
            type="number"
            value={defaultCapacity}
            onChange={(e) => setDefaultCapacity(Number(e.target.value))}
            className="p-3 rounded-lg bg-white/10 border border-white/20 w-40"
          />
        </div>

        {/* SLOT CAPACITY */}
        <div className="mb-6">
          <p className="mb-3 text-sm text-gray-400">Custom Slot Capacity</p>

          {times.map((t) => (
            <div key={t} className="flex items-center gap-3 mb-2">
              <span className="w-24">{t}</span>
              <input
                type="number"
                value={slotInputs[t] || ""}
                onChange={(e) =>
                  setSlotInputs({
                    ...slotInputs,
                    [t.trim()]: Number(e.target.value),
                  })
                }
                className="p-2 rounded bg-white/10 border border-white/20 w-24"
              />
            </div>
          ))}
        </div>

        {/* BLOCK DATES */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-400">Blocked Dates</p>

          <div className="flex gap-3 mb-3">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="p-2 rounded bg-white/10 border border-white/20"
            />

            <button
              onClick={() => {
                if (!newDate) return;
                if (blockedDates.includes(newDate)) return;

                setBlockedDates([...blockedDates, newDate]);
                setNewDate("");
              }}
              className="px-4 py-2 bg-red-600 rounded"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {blockedDates.map((d) => (
              <span
                key={d}
                onClick={() =>
                  setBlockedDates(blockedDates.filter((x) => x !== d))
                }
                className="px-2 py-1 bg-red-500/20 rounded cursor-pointer"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Save Settings
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "completed", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f
                ? "bg-blue-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name, phone, service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full md:w-1/3 p-3 rounded-lg bg-white/10 border border-white/20"
      />

      {/* BOOKINGS */}
      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {bookings
            .filter((b) => {
              const matchesFilter =
                filter === "all"
                  ? true
                  : (b.status || "pending") === filter;

              const matchesSearch =
                b.name.toLowerCase().includes(search.toLowerCase()) ||
                b.phone.includes(search) ||
                b.service.toLowerCase().includes(search.toLowerCase());

              return matchesFilter && matchesSearch;
            })
            .map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md"
              >
                <div className="space-y-1 text-sm">
                  <p><strong>Service:</strong> {b.service}</p>
                  <p><strong>Package:</strong> {b.package}</p>
                  <p><strong>Time:</strong> {b.time}</p>
                  <p><strong>Name:</strong> {b.name}</p>
                  <p><strong>Phone:</strong> {b.phone}</p>
                </div>

                <p className="mt-2 text-sm text-gray-400">{b.address}</p>

                <p className="mt-3">
                  <strong>Status:</strong> {b.status || "pending"}
                </p>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(b.id, "confirmed")}
                    className="px-3 py-1 bg-blue-600 rounded-lg text-sm"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(b.id, "completed")}
                    className="px-3 py-1 bg-green-600 rounded-lg text-sm"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt("Reason?");
                      if (!reason) return;
                      updateStatus(b.id, "rejected", reason);
                    }}
                    className="px-3 py-1 bg-red-600 rounded-lg text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}