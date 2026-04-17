"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

type Booking = {
  service: string;
  date: string;
  time: string;
  package: string;
  status?: string;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [stats, setStats] = useState<any>({});

  // 🔥 FETCH BOOKINGS
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const bookings = snapshot.docs.map((doc) => doc.data()) as Booking[];

      setData(bookings);
      setFiltered(bookings);
    };

    fetchData();
  }, []);

  // 🔥 FILTER BY DATE
  useEffect(() => {
    if (!fromDate || !toDate) {
      setFiltered(data);
      return;
    }

    const filteredData = data.filter(
      (b) => b.date >= fromDate && b.date <= toDate
    );

    setFiltered(filteredData);
  }, [fromDate, toDate, data]);

  // 🔥 ANALYTICS CALCULATION
  useEffect(() => {
    const serviceMap: any = {};
    const dateMap: any = {};
    const timeMap: any = {};

    let revenue = 0;
    let pending = 0;

    filtered.forEach((b) => {
      // service
      if (!serviceMap[b.service]) serviceMap[b.service] = 0;
      serviceMap[b.service]++;

      // date
      if (!dateMap[b.date]) dateMap[b.date] = 0;
      dateMap[b.date]++;

      // time
      if (!timeMap[b.time]) timeMap[b.time] = 0;
      timeMap[b.time]++;

      // status
      if ((b.status || "pending") === "pending") pending++;

      // revenue (simple extraction)
      const priceMatch = b.package?.match(/\d+/);
      if (priceMatch) {
        revenue += Number(priceMatch[0]);
      }
    });

    const topService =
      Object.keys(serviceMap).sort(
        (a, b) => serviceMap[b] - serviceMap[a]
      )[0] || "N/A";

    const peakTime =
      Object.keys(timeMap).sort(
        (a, b) => timeMap[b] - timeMap[a]
      )[0] || "N/A";

    const peakDay =
      Object.keys(dateMap).sort(
        (a, b) => dateMap[b] - dateMap[a]
      )[0] || "N/A";

    setStats({
      total: filtered.length,
      revenue,
      pending,
      serviceMap,
      dateMap,
      timeMap,
      topService,
      peakTime,
      peakDay,
    });
  }, [filtered]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* BACK */}
      <Link href="/admin" className="text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Admin
      </Link>

      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      {/* 🔥 DATE FILTER */}
      <div className="flex gap-4 mb-10 flex-wrap">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="p-3 rounded bg-white/10 border border-white/20"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="p-3 rounded bg-white/10 border border-white/20"
        />
      </div>

      {/* 🔥 TOP STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-white/10 border border-white/20 rounded-xl">
          <p className="text-gray-400 text-sm">Total</p>
          <h2 className="text-2xl font-bold">{stats.total || 0}</h2>
        </div>

        <div className="p-6 bg-white/10 border border-white/20 rounded-xl">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold">₹{stats.revenue || 0}</h2>
        </div>

        <div className="p-6 bg-white/10 border border-white/20 rounded-xl">
          <p className="text-gray-400 text-sm">Pending</p>
          <h2 className="text-2xl font-bold">{stats.pending || 0}</h2>
        </div>

        <div className="p-6 bg-white/10 border border-white/20 rounded-xl">
          <p className="text-gray-400 text-sm">Top Service</p>
          <h2 className="text-lg font-bold capitalize">
            {stats.topService?.replace("-", " ")}
          </h2>
        </div>
      </div>

      {/* 🔥 SERVICE BREAKDOWN */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Service Breakdown</h2>
        {Object.entries(stats.serviceMap || {}).map(([key, val]: any) => (
          <div key={key} className="flex justify-between mb-2">
            <span className="capitalize">{key.replace("-", " ")}</span>
            <span>{val}</span>
          </div>
        ))}
      </div>

      {/* 🔥 BOOKINGS PER DAY */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Bookings Per Day</h2>
        {Object.entries(stats.dateMap || {}).map(([key, val]: any) => (
          <div key={key} className="flex justify-between mb-2">
            <span>{key}</span>
            <span>{val}</span>
          </div>
        ))}
      </div>

      {/* 🔥 PEAK TIMES */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Peak Insights</h2>

        <p className="text-gray-400">
          🔥 Peak Day: <span className="text-white">{stats.peakDay}</span>
        </p>

        <p className="text-gray-400">
          🔥 Peak Time: <span className="text-white">{stats.peakTime}</span>
        </p>
      </div>

    </div>
  );
}