import React, { useState } from "react";

const Stat = ({ label, value, delta, hint }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex items-center justify-between text-sm text-slate-600">
      <span>{label}</span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
    <div className="mt-2 flex items-baseline gap-2">
      <div className="text-2xl font-semibold">{value}</div>
      <div
        className={`text-xs ${
          String(delta).startsWith("+") ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {delta}
      </div>
    </div>
  </div>
);

const LineChartPlaceholder = ({ title }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 h-72">
    <div className="flex items-center justify-between">
      <div className="font-medium">{title}</div>
      <button className="text-xs px-2 py-1 rounded-lg border hover:bg-slate-50">
        Export CSV
      </button>
    </div>
    <div className="mt-4 grid h-56 place-items-center text-slate-500 text-sm border border-dashed border-slate-300 rounded-xl">
      Chart placeholder (plug in recharts later)
    </div>
  </div>
);

const GaugePlaceholder = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="font-medium">{label}</div>
    <div className="mt-4 grid place-items-center h-52 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm">
      Occupancy {value}% (gauge placeholder)
    </div>
  </div>
);

const BookingRow = ({ guest, room, checkin, nights, status }) => (
  <tr className="border-t">
    <td className="px-5 py-3">{guest}</td>
    <td className="px-5 py-3">{room}</td>
    <td className="px-5 py-3">{checkin}</td>
    <td className="px-5 py-3">{nights}</td>
    <td className="px-5 py-3">
      <span
        className={`px-2 py-1 rounded-lg text-xs font-medium border
${
  status === "Confirmed"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : status === "Checked-in"
    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : status === "Cancelled"
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-amber-50 text-amber-700 border-amber-200"
}`}
      >
        {status}
      </span>
    </td>
  </tr>
);

const ChannelsCard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="font-medium">Revenue by Channel</div>
    <ul className="mt-3 space-y-2 text-sm">
      {[
        ["Direct", "$18,420", "+9%"],
        ["Booking.com", "$12,310", "+4%"],
        ["Agoda", "$6,780", "+2%"],
        ["Expedia", "$4,870", "-1%"],
      ].map((c, i) => (
        <li key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900" />
            <span className="text-slate-700">{c[0]}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-medium">{c[1]}</span>
            <span
              className={`text-xs ${
                c[2].startsWith("+") ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {c[2]}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const QuickActions = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="font-medium">Quick Actions</div>
    <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
      <a
        href="/admin/bookings/create"
        className="h-10 rounded-xl bg-slate-900 text-white grid place-items-center font-medium hover:bg-slate-800"
      >
        New Booking
      </a>
      <a
        href="/admin/offers/create"
        className="h-10 rounded-xl border border-slate-300 grid place-items-center hover:bg-slate-50"
      >
        Create Offer
      </a>
      <a
        href="/admin/rooms"
        className="h-10 rounded-xl border border-slate-300 grid place-items-center hover:bg-slate-50"
      >
        Manage Rooms
      </a>
      <a
        href="/admin/settings"
        className="h-10 rounded-xl border border-slate-300 grid place-items-center hover:bg-slate-50"
      >
        Settings
      </a>
    </div>
  </div>
);

const AdminHome = () => {
  const [range, setRange] = useState("last_30");
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            aria-label="Select date range"
          >
            <option value="today">Today</option>
            <option value="last_7">Last 7 days</option>
            <option value="last_30">Last 30 days</option>
            <option value="last_90">Last 90 days</option>
          </select>
          <button className="h-10 rounded-xl border border-slate-300 px-3 text-sm hover:bg-slate-50">
            Refresh
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Revenue"
          value="$42,380"
          delta="+8.2%"
          hint={range.replaceAll("_", " ")}
        />
        <Stat label="Bookings" value="312" delta="+3.4%" hint="confirmed" />
        <Stat
          label="Avg. Occupancy"
          value="81%"
          delta="+2.1%"
          hint="rooms sold"
        />
        <Stat
          label="Cancellation Rate"
          value="3.2%"
          delta="-0.6%"
          hint="of total"
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartPlaceholder title="Revenue & Bookings" />
        </div>
        <GaugePlaceholder label="Today's Occupancy" value={84} />
      </div>

      {/* Middle cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ChannelsCard />
        <QuickActions />
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="font-medium">Activity</div>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <span className="font-medium">Alex M.</span> created booking{" "}
              <span className="font-mono">#BK-1042</span> • 2m ago
            </li>
            <li>
              <span className="font-medium">System</span> synced payments with
              Stripe • 18m ago
            </li>
            <li>
              <span className="font-medium">Asha P.</span> cancelled booking{" "}
              <span className="font-mono">#BK-1038</span> • 1h ago
            </li>
          </ul>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="font-medium">Recent Bookings</div>
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search…"
              className="h-9 w-48 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/40"
            />
            <select className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm">
              <option>All</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Checked-in</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 text-left">Guest</th>
                <th className="px-5 py-3 text-left">Room</th>
                <th className="px-5 py-3 text-left">Check-in</th>
                <th className="px-5 py-3 text-left">Nights</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <BookingRow
                guest="Alex Morgan"
                room="Deluxe King"
                checkin="2025-09-20"
                nights={2}
                status="Confirmed"
              />
              <BookingRow
                guest="Thanh Nguyen"
                room="Executive Suite"
                checkin="2025-09-22"
                nights={3}
                status="Pending"
              />
              <BookingRow
                guest="Asha Patel"
                room="Twin City View"
                checkin="2025-09-19"
                nights={1}
                status="Checked-in"
              />
              <BookingRow
                guest="Liam Chen"
                room="Deluxe King"
                checkin="2025-09-18"
                nights={2}
                status="Cancelled"
              />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
