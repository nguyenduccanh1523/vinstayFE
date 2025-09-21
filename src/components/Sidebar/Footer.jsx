import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white font-semibold">
              VS
            </span>
            <span className="text-lg font-semibold">VinnStay</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            City-center comfort with ocean-inspired design. Experience stays
            that feel like home—elevated.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href="#rooms" className="hover:underline">
                Rooms & Suites
              </a>
            </li>
            <li>
              <a href="#dining" className="hover:underline">
                Dining
              </a>
            </li>
            <li>
              <a href="#spa" className="hover:underline">
                Spa & Wellness
              </a>
            </li>
            <li>
              <a href="#events" className="hover:underline">
                Events
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="#policy" className="hover:underline">
                Policies
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Newsletter</h4>
          <p className="mt-3 text-sm text-slate-600">
            Be first to know about flash deals and seasonal offers.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="h-10 flex-1 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
            />
            <button className="h-10 rounded-xl bg-slate-900 px-4 text-white text-sm font-medium hover:bg-slate-800">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} VinnStay. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
