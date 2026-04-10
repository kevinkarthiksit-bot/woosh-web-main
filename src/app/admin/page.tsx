"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
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

  // ✅ UPDATE STATUS
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

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, status: newStatus, rejectionReason: reason }
            : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(data);
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-32 p-6 md:p-10">
      
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* FILTER BUTTONS */}
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

      {/* SEARCH INPUT */}
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
                className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-lg hover:shadow-blue-500/10 transition"
              >
                {/* INFO */}
                <div className="space-y-1 text-sm">
                  <p><strong>Service:</strong> {b.service}</p>
                  <p><strong>Package:</strong> {b.package}</p>
                  <p><strong>Time:</strong> {b.time}</p>
                  <p><strong>Name:</strong> {b.name}</p>
                  <p><strong>Phone:</strong> {b.phone}</p>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {b.address}
                </p>

                {/* STATUS */}
                <p className="mt-3">
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm capitalize ${
                      (b.status || "pending") === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : b.status === "confirmed"
                        ? "bg-blue-500/20 text-blue-400"
                        : b.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {b.status || "pending"}
                  </span>
                </p>

                {/* REJECTION REASON */}
                {b.status === "rejected" && b.rejectionReason && (
                  <p className="text-sm text-red-400 mt-2">
                    Reason: {b.rejectionReason}
                  </p>
                )}

                {/* ACTION BUTTONS */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(b.id, "confirmed")}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(b.id, "completed")}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt("Reason for rejection?");
                      if (!reason) return;
                      updateStatus(b.id, "rejected", reason);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
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