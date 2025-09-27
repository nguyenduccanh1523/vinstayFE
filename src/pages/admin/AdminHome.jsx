import React, { useState, useEffect, useMemo } from "react";
import { Skeleton, message } from "antd";
import { bookingApi } from "../../apis/bookingApi";
import dayjs from "dayjs";

const Stat = ({ label, value, delta, hint, loading = false }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex items-center justify-between text-sm text-slate-600">
      <span>{label}</span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
    <div className="mt-2 flex items-baseline gap-2">
      {loading ? (
        <Skeleton.Input style={{ width: 80, height: 32 }} active />
      ) : (
        <>
          <div className="text-2xl font-semibold">{value}</div>
          <div
            className={`text-xs ${
              String(delta).startsWith("+")
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {delta}
          </div>
        </>
      )}
    </div>
  </div>
);

const RevenueBookingsChart = ({ bookings, loading, range }) => {
  const chartData = useMemo(() => {
    if (!bookings.length) return [];

    const now = dayjs();
    let startDate;
    let format = "MMM DD";
    let groupBy = "day";

    switch (range) {
      case "today":
        startDate = now.startOf("day");
        format = "HH:mm";
        groupBy = "hour";
        break;
      case "last_7":
        startDate = now.subtract(7, "days");
        format = "MMM DD";
        groupBy = "day";
        break;
      case "last_30":
        startDate = now.subtract(30, "days");
        format = "MMM DD";
        groupBy = "day";
        break;
      case "last_90":
        startDate = now.subtract(90, "days");
        format = "MMM DD";
        groupBy = "week";
        break;
      default:
        startDate = now.subtract(30, "days");
    }

    const filteredBookings = bookings.filter((booking) =>
      dayjs(booking.created_at).isAfter(startDate)
    );

    // Group bookings by time period
    const grouped = {};
    filteredBookings.forEach((booking) => {
      const key = dayjs(booking.created_at).startOf(groupBy).format(format);
      if (!grouped[key]) {
        grouped[key] = { revenue: 0, bookings: 0 };
      }
      grouped[key].bookings += 1;
      if (booking.status === "confirmed" || booking.status === "completed") {
        grouped[key].revenue += booking.total_price || 0;
      }
    });

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        bookings: data.bookings,
      }))
      .slice(-10); // Last 10 data points
  }, [bookings, range]);

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const maxBookings = Math.max(...chartData.map((d) => d.bookings), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 h-72">
      <div className="flex items-center justify-between">
        <div className="font-medium">Revenue & Bookings</div>
        <button className="text-xs px-2 py-1 rounded-lg border hover:bg-slate-50">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="mt-4 h-56 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div className="mt-4 h-56 relative">
          {chartData.length > 0 ? (
            <div className="h-full flex items-end justify-between gap-2 px-2">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end"
                >
                  {/* Revenue Bar */}
                  <div className="relative w-full flex justify-center mb-1">
                    <div
                      className="bg-blue-500 rounded-t-sm transition-all duration-1000 ease-out"
                      style={{
                        height: `${(item.revenue / maxRevenue) * 140}px`,
                        width: "8px",
                        minHeight: item.revenue > 0 ? "4px" : "0px",
                      }}
                      title={`Revenue: $${item.revenue.toLocaleString()}`}
                    />
                    <div
                      className="bg-green-500 rounded-t-sm ml-1 transition-all duration-1000 ease-out"
                      style={{
                        height: `${(item.bookings / maxBookings) * 140}px`,
                        width: "8px",
                        minHeight: item.bookings > 0 ? "4px" : "0px",
                      }}
                      title={`Bookings: ${item.bookings}`}
                    />
                  </div>

                  {/* Date Label */}
                  <div className="text-xs text-slate-500 text-center transform -rotate-45 origin-center mt-2">
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No data for selected period
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-0 right-0 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Bookings</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GaugePlaceholder = ({ label, value, loading = false }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="font-medium">{label}</div>
    <div className="mt-4 grid place-items-center h-52 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm">
      {loading ? (
        <Skeleton.Input style={{ width: 120, height: 24 }} active />
      ) : (
        `Occupancy ${value}% (gauge placeholder)`
      )}
    </div>
  </div>
);

const BookingRow = ({ guest, hotel, room, checkin, nights, status, price }) => (
  <tr className="border-t">
    <td className="px-5 py-3">
      <div>
        <div className="font-medium">{guest}</div>
        <div className="text-xs text-slate-500">{hotel}</div>
      </div>
    </td>
    <td className="px-5 py-3">{room}</td>
    <td className="px-5 py-3">{checkin}</td>
    <td className="px-5 py-3">{nights}</td>
    <td className="px-5 py-3">
      <span
        className={`px-2 py-1 rounded-lg text-xs font-medium border
${
  status === "confirmed"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : status === "completed"
    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : status === "cancelled"
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-amber-50 text-amber-700 border-amber-200"
}`}
      >
        {status?.toUpperCase()}
      </span>
    </td>
    <td className="px-5 py-3 font-medium">${price?.toLocaleString()}</td>
  </tr>
);

const ChannelsCard = ({ bookings, loading }) => {
  const channelData = useMemo(() => {
    if (!bookings.length) return [];

    // Group by hotel to simulate different channels
    const hotelRevenue = {};
    bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .forEach((booking) => {
        const hotelName = booking.hotel_id?.name || "Unknown Hotel";
        if (!hotelRevenue[hotelName]) {
          hotelRevenue[hotelName] = 0;
        }
        hotelRevenue[hotelName] += booking.total_price || 0;
      });

    return Object.entries(hotelRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([hotel, revenue]) => [
        hotel,
        `$${revenue.toLocaleString()}`,
        "+5%",
      ]);
  }, [bookings]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="font-medium">Revenue by Hotel</div>
      {loading ? (
        <div className="mt-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} active paragraph={{ rows: 1 }} />
          ))}
        </div>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {channelData.map((c, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900" />
                <span className="text-slate-700">{c[0]}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{c[1]}</span>
                <span className="text-xs text-emerald-600">{c[2]}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const QuickActions = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="font-medium">Quick Actions</div>
    <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
      <a
        href="/admin/bookings"
        className="h-10 rounded-xl bg-slate-900 text-white grid place-items-center font-medium hover:bg-slate-800"
      >
        View Bookings
      </a>
      <a
        href="/admin/hotels"
        className="h-10 rounded-xl border border-slate-300 grid place-items-center hover:bg-slate-50"
      >
        Manage Hotels
      </a>
      <a
        href="/admin/customers"
        className="h-10 rounded-xl border border-slate-300 grid place-items-center hover:bg-slate-50"
      >
        Manage Customers
      </a>
      <a
        href="/admin/reports"
        className="h-10 rounded-xl border border-slate-300 grid place-items-center hover:bg-slate-50"
      >
        Reports
      </a>
    </div>
  </div>
);

const BookingSuccessGauge = ({ value, loading }) => {
  const circumference = 2 * Math.PI * 70;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getColor = (value) => {
    if (value >= 80) return "#10b981"; // green
    if (value >= 60) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="font-medium">Booking Success Rate</div>
      <div className="mt-4 flex items-center justify-center h-52 relative">
        {loading ? (
          <Skeleton.Avatar size={140} active />
        ) : (
          <>
            <svg
              className="w-36 h-36 transform -rotate-90"
              viewBox="0 0 160 160"
            >
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={getColor(value)}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-2000 ease-out"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {value}%
                </div>
                <div className="text-sm text-slate-500">Success Rate</div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < Math.floor(value / 20) ? "bg-current" : "bg-slate-200"
                    }`}
                    style={{ color: getColor(value) }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AdminHome = () => {
  const [range, setRange] = useState("last_30");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAllBookings();
      setBookings(res.bookings || []);
    } catch (error) {
      message.error("Failed to load booking data");
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Calculate statistics based on date range
  const stats = useMemo(() => {
    if (!bookings.length)
      return {
        revenue: "$0",
        totalBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        occupancyRate: 0,
        cancellationRate: "0%",
      };

    const now = dayjs();
    let startDate;

    switch (range) {
      case "today":
        startDate = now.startOf("day");
        break;
      case "last_7":
        startDate = now.subtract(7, "days");
        break;
      case "last_30":
        startDate = now.subtract(30, "days");
        break;
      case "last_90":
        startDate = now.subtract(90, "days");
        break;
      default:
        startDate = now.subtract(30, "days");
    }

    const filteredBookings = bookings.filter((booking) =>
      dayjs(booking.created_at).isAfter(startDate)
    );

    const totalRevenue = filteredBookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.total_price || 0), 0);

    const totalBookings = filteredBookings.length;
    const confirmedBookings = filteredBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const cancelledBookings = filteredBookings.filter(
      (b) => b.status === "cancelled"
    ).length;
    const completedBookings = filteredBookings.filter(
      (b) => b.status === "completed"
    ).length;

    const cancellationRate =
      totalBookings > 0
        ? ((cancelledBookings / totalBookings) * 100).toFixed(1)
        : "0";

    // Calculate occupancy rate (simplified - confirmed + completed / total)
    const occupancyRate =
      totalBookings > 0
        ? Math.round(
            ((confirmedBookings + completedBookings) / totalBookings) * 100
          )
        : 0;

    return {
      revenue: `$${totalRevenue.toLocaleString()}`,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      occupancyRate,
      cancellationRate: `${cancellationRate}%`,
    };
  }, [bookings, range]);

  // Get recent bookings for table
  const recentBookings = useMemo(() => {
    return bookings
      .sort((a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix())
      .slice(0, 10);
  }, [bookings]);

  const getRangeLabel = (range) => {
    switch (range) {
      case "today":
        return "today";
      case "last_7":
        return "last 7 days";
      case "last_30":
        return "last 30 days";
      case "last_90":
        return "last 90 days";
      default:
        return "last 30 days";
    }
  };

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
          <button
            onClick={loadBookings}
            className="h-10 rounded-xl border border-slate-300 px-3 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Revenue"
          value={stats.revenue}
          delta="+8.2%"
          hint={getRangeLabel(range)}
          loading={loading}
        />
        <Stat
          label="Bookings"
          value={stats.totalBookings}
          delta="+3.4%"
          hint="total bookings"
          loading={loading}
        />
        <Stat
          label="Confirmed"
          value={stats.confirmedBookings}
          delta="+2.1%"
          hint="confirmed bookings"
          loading={loading}
        />
        <Stat
          label="Cancellation Rate"
          value={stats.cancellationRate}
          delta="-0.6%"
          hint="of total bookings"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueBookingsChart
            bookings={bookings}
            loading={loading}
            range={range}
          />
        </div>
        <BookingSuccessGauge value={stats.occupancyRate} loading={loading} />
      </div>

      {/* Middle cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ChannelsCard bookings={bookings} loading={loading} />
        <QuickActions />
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="font-medium">System Stats</div>
          {loading ? (
            <div className="mt-3 space-y-3">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <span className="font-medium">Total Platform Bookings:</span>{" "}
                {bookings.length}
              </li>
              <li>
                <span className="font-medium">Confirmed Bookings:</span>{" "}
                {bookings.filter((b) => b.status === "confirmed").length}
              </li>
              <li>
                <span className="font-medium">Total Revenue:</span> ${" "}
                {bookings
                  .filter(
                    (b) => b.status === "confirmed" || b.status === "completed"
                  )
                  .reduce((sum, b) => sum + (b.total_price || 0), 0)
                  .toLocaleString()}
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="font-medium">Recent Bookings</div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/bookings"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              View All →
            </a>
          </div>
        </div>
        {loading ? (
          <div className="p-5">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 text-left">Guest & Hotel</th>
                  <th className="px-5 py-3 text-left">Room</th>
                  <th className="px-5 py-3 text-left">Check-in</th>
                  <th className="px-5 py-3 text-left">Nights</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <BookingRow
                      key={booking._id}
                      guest={booking.user_id?.username || "N/A"}
                      hotel={booking.hotel_id?.name || "N/A"}
                      room={`${booking.room_id?.room_type} ${booking.room_id?.room_number}`}
                      checkin={dayjs(booking.check_in_date).format(
                        "MMM DD, YYYY"
                      )}
                      nights={dayjs(booking.check_out_date).diff(
                        dayjs(booking.check_in_date),
                        "day"
                      )}
                      status={booking.status}
                      price={booking.total_price}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
