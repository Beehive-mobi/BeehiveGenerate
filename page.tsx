import { ArrowRight, Check, Star } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 lg:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Professional Solutions for Modern Businesses
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                We provide expert services tailored to help your business grow and succeed in today's competitive
                marketplace.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="bg-beehive-yellow rounded-md px-6 py-3 text-beehive-black font-semibold shadow-md hover:bg-beehive-hover transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="#services"
                  className="border border-gray-300 rounded-md px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="ACME Inc. Professional Services"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
            <p className="text-lg text-gray-600">
              At ACME Inc., we've been delivering excellence for over 15 years. Our mission is to help businesses of all
              sizes achieve their goals.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-4">Our Story</h3>
              <p className="text-gray-600 mb-4">
                Founded in 2009, ACME Inc. started with a vision to provide businesses with the professional services
                they need to thrive. Over the years, we've grown from a small team of experts to an industry leader.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of experienced professionals is dedicated to delivering high-quality solutions that meet the
                unique needs of each client. We take pride in our work and are committed to helping businesses succeed.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-beehive-yellow font-bold text-3xl mb-2">15+</div>
                  <div className="text-gray-700">Years Experience</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-beehive-yellow font-bold text-3xl mb-2">500+</div>
                  <div className="text-gray-700">Happy Clients</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-beehive-yellow font-bold text-3xl mb-2">50+</div>
                  <div className="text-gray-700">Team Members</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-beehive-yellow font-bold text-3xl mb-2">100%</div>
                  <div className="text-gray-700">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="Our team at work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">
              We offer a comprehensive range of professional services to help your business thrive.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Service 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beehive-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-beehive-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Service 1</h3>
              <p className="text-gray-600 mb-4">
                A comprehensive solution designed to help businesses optimize their operations and improve efficiency.
              </p>
              <a href="#" className="text-beehive-yellow hover:underline font-semibold flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beehive-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-beehive-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Service 2</h3>
              <p className="text-gray-600 mb-4">
                Expert consulting services to help businesses develop effective strategies and achieve their goals.
              </p>
              <a href="#" className="text-beehive-yellow hover:underline font-semibold flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beehive-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-beehive-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Service 3</h3>
              <p className="text-gray-600 mb-4">
                Innovative solutions to protect your business assets and ensure long-term growth and stability.
              </p>
              <a href="#" className="text-beehive-yellow hover:underline font-semibold flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beehive-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-beehive-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Service 4</h3>
              <p className="text-gray-600 mb-4">
                Professional assistance to help businesses manage their resources effectively and maximize returns.
              </p>
              <a href="#" className="text-beehive-yellow hover:underline font-semibold flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beehive-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-beehive-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3h2c1.66 0 3 1.34 3 3v1H8v-1z"></path>
                  <circle cx="12" cy="9" r="2"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Service 5</h3>
              <p className="text-gray-600 mb-4">
                Specialized services tailored to meet the unique needs of businesses in various industries.
              </p>
              <a href="#" className="text-beehive-yellow hover:underline font-semibold flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beehive-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-beehive-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Service 6</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive support to help businesses address challenges and capitalize on opportunities.
              </p>
              <a href="#" className="text-beehive-yellow hover:underline font-semibold flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it. Here's what our clients have to say about our services.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-beehive-yellow">
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "ACME Inc. has been instrumental in helping our business grow. Their professional services are
                top-notch, and their team is always responsive and helpful."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  <Image src="/placeholder.svg?height=100&width=100" alt="Client" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-sm text-gray-500">CEO, Company A</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-beehive-yellow">
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "We've been working with ACME Inc. for over five years, and they've consistently delivered excellent
                results. Their team is knowledgeable, professional, and a pleasure to work with."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  <Image src="/placeholder.svg?height=100&width=100" alt="Client" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">COO, Company B</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-beehive-yellow">
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                  <Star className="inline-block h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "ACME Inc.'s services have exceeded our expectations. They understand our business needs and have
                provided solutions that have helped us achieve our goals."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  <Image src="/placeholder.svg?height=100&width=100" alt="Client" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-sm text-gray-500">Director, Company C</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="py-16 md:py-24 bg-beehive-light">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">
              When you partner with ACME Inc., you benefit from our extensive experience and commitment to excellence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-beehive-yellow mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Experienced Team</h3>
              <p className="text-gray-600">
                Our team of experienced professionals has the knowledge and skills to deliver exceptional results.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-beehive-yellow mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customized Solutions</h3>
              <p className="text-gray-600">
                We develop tailored solutions that address the unique needs and challenges of your business.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-beehive-yellow mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Service</h3>
              <p className="text-gray-600">
                We're committed to delivering high-quality service that exceeds your expectations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-beehive-yellow mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Timely Delivery</h3>
              <p className="text-gray-600">
                We understand the importance of deadlines and strive to deliver on time, every time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-beehive-yellow mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">
                We offer competitive pricing without compromising on the quality of our services.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-beehive-yellow mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ongoing Support</h3>
              <p className="text-gray-600">
                We provide continuous support to ensure your long-term success and satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-6">
                Ready to take your business to the next level? Contact us today to schedule a consultation.
              </p>

              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-beehive-yellow focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-beehive-yellow focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-beehive-yellow focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-beehive-yellow focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-beehive-yellow rounded-md px-6 py-3 text-beehive-black font-semibold shadow-md hover:bg-beehive-hover transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-3 text-beehive-yellow mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-gray-600">123 Main Street, New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 text-beehive-yellow mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 text-beehive-yellow mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-600">info@acmeinc.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 text-beehive-yellow mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 h-[300px] rounded-lg overflow-hidden shadow-sm">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Map"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-beehive-black text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter to receive updates, news, and valuable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-md text-gray-900 w-full sm:w-auto sm:flex-1 max-w-md"
              />
              <button className="bg-beehive-yellow text-beehive-black font-semibold px-6 py-3 rounded-md hover:bg-beehive-hover transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </>
  )
}

