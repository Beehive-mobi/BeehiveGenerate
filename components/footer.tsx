import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-beehive-black text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="text-2xl font-bold font-heading">
              ACME Inc.
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              Providing top-quality professional services to businesses of all sizes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Service 1
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Service 2
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Service 3
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-beehive-yellow transition-colors">
                  Service 4
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-gray-300">
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">info@acmeinc.com</p>
              <p>(123) 456-7890</p>
            </address>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-beehive-yellow transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-beehive-yellow transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-beehive-yellow transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-beehive-yellow transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ACME Inc. All rights reserved.</p>
          <p className="mt-2">
            Website designed by{" "}
            <a href="#" className="text-beehive-yellow hover:underline">
              Beehive
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

