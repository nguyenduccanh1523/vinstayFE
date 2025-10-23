import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // simple validation
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
      return;
    }
    setStatus("loading");
    try {
      // TODO: replace with real API call if available
      await new Promise((res) => setTimeout(res, 900));
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <main id="contact" className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            Contact VinnStay
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            We're ready to help — ask about bookings, partnerships, or share
            feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Subject
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="e.g. Booking issue"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                  placeholder="Describe your request..."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-60"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                <div className="text-sm">
                  {status === "success" && (
                    <span className="text-green-600">
                      Message sent successfully. Thank you!
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-red-600">
                      Please check your information.
                    </span>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Contact Info + Map */}
          <aside className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">
                Contact Information
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">
                    {/* location icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11.5a3 3 0 100-6 3 3 0 000 6z"
                      />
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s8-4.5 8-10.5S15.866 2 12 2 4 6 4 10.5 12 21 12 21z"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-800">
                      VinnStay Headquarters
                    </div>
                    <div>123 Le Loi, District 1, Ho Chi Minh City</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">
                    {/* phone icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5.5a2 2 0 012-2h2.2a1 1 0 01.98.804l.6 3.6a1 1 0 01-.27.89L7.6 10.7a11.042 11.042 0 005.7 5.7l2.406-1.22a1 1 0 01.892-.271l3.6.6a1 1 0 01.804.98V19.5a2 2 0 01-2 2H5a2 2 0 01-2-2V5.5z"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-800">
                      Booking Support
                    </div>
                    <div>+84 28 1234 5678</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">
                    {/* email icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8.25v7.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75v-7.5A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25z"
                      />
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25L12 13.5 3 8.25"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-800">Email</div>
                    <div>support@vinnstay.vn</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">
                    {/* clock icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l2 2"
                      />
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9 9 0 110-18 9 9 0 010 18z"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-800">
                      Business Hours
                    </div>
                    <div>Mon - Fri: 08:30 - 18:00</div>
                  </div>
                </li>
              </ul>

              <div className="mt-4 flex items-center gap-3">
                <a
                  aria-label="facebook"
                  href="#"
                  className="text-slate-600 hover:text-slate-800"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12H20l-1 3h-3v7A10 10 0 0022 12z" />
                  </svg>
                </a>
                <a
                  aria-label="instagram"
                  href="#"
                  className="text-slate-600 hover:text-slate-800"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 7.5A4 4 0 1016 13a4 4 0 00-4-3.5zM18.5 7a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* responsive map */}
              <div className="w-full aspect-[16/9]">
                <iframe
                  title="VinnStay location"
                  className="w-full h-full border-0"
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890123!2d106.700!3d10.777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTAw4oCmIDQzLCDQkdC10L3QuNGC0YDQutC4!5e0!3m2!1svi!2s!4v0000000000000"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
