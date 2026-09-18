import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-(--color-primary-900) dark:bg-(--color-primary-950) text-white pt-10 pb-5 mt-auto w-full border-t border-green-900/30">
      <div className="w-full px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-['Pacifico'] text-3xl text-(--color-warning-400) mb-4 tracking-wide">
              Rochetta
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Your go-to pharmacy marketplace for fast, reliable, and affordable
              healthcare products.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h2 className="uppercase font-bold mb-4 tracking-wider text-gray-100 text-lg">
              Quick Links
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-(--color-warning-400) hover:underline font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-300 hover:text-(--color-warning-400) hover:underline transition-colors font-medium"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-(--color-warning-400) hover:underline transition-colors font-medium"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/policy"
                  className="text-gray-300 hover:text-(--color-warning-400) hover:underline transition-colors font-medium flex items-center justify-center md:justify-start gap-1.5"
                >
                  Terms & Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/about-system"
                  className="text-gray-300 hover:text-(--color-warning-400) hover:underline transition-colors font-medium flex items-center justify-center md:justify-start gap-1.5"
                >
                  About System
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h2 className="uppercase font-bold mb-4 tracking-wider text-gray-100 text-lg">
              Contact Us
            </h2>
            <div className="space-y-3 text-gray-300 text-sm w-full">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Mail
                  className="w-5 h-5 text-(--color-warning-400)"
                  aria-hidden="true"
                />
                <span>support@rochetta.com</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Phone
                  className="w-5 h-5 text-(--color-warning-400)"
                  aria-hidden="true"
                />
                <span dir="ltr">+20 100 123 4567</span>
              </div>
            </div>

            <div className="flex gap-5 mt-6">
              <a
                href="#"
                aria-label="Visit our Facebook page"
                className="text-gray-300 hover:text-(--color-warning-400) transition-all transform hover:scale-110"
              >
                <Facebook className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="Visit our Twitter page"
                className="text-gray-300 hover:text-(--color-warning-400) transition-all transform hover:scale-110"
              >
                <Twitter className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="Visit our Instagram page"
                className="text-gray-300 hover:text-(--color-warning-400) transition-all transform hover:scale-110"
              >
                <Instagram className="w-6 h-6" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600/50 mt-8 pt-4 items-center gap-4 text-center">
          <p className="text-sm text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Rochetta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
