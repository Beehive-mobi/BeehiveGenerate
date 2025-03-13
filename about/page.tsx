import { BarChart, BookOpen, BriefcaseBusiness, HandshakeIcon, HeartHandshake, Target } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-beehive-black text-white py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-30">
          <Image src="/placeholder.svg?height=1080&width=1920" alt="About ACME Inc." fill className="object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">About ACME Inc.</h1>
            <p className="text-lg md:text-xl text-gray-300">
              Founded with a vision to transform professional services, ACME Inc. has been a trusted partner to
              businesses for over 15 years.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                ACME Inc. was founded in 2009 with a clear mission: to provide businesses with the professional services
                they need to thrive in an increasingly competitive marketplace.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What started as a small team of dedicated professionals has grown into an industry-leading company with
                a proven track record of success. Over the years, we've helped hundreds of businesses achieve their
                goals and realize their potential.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to build on our foundation of excellence, constantly innovating and improving our
                services to meet the evolving needs of our clients.
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="The ACME Inc. team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              These principles guide everything we do and shape our approach to serving our clients.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Value 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-block p-3 bg-beehive-light rounded-full text-beehive-yellow mb-4">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We conduct business with honesty and transparency, building trust with our clients and partners.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-block p-3 bg-beehive-light rounded-full text-beehive-yellow mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, constantly raising the bar to deliver exceptional results.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-block p-3 bg-beehive-light rounded-full text-beehive-yellow mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace innovation and creative thinking to develop cutting-edge solutions for our clients.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-block p-3 bg-beehive-light rounded-full text-beehive-yellow mb-4">
                <HandshakeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                We work closely with our clients, fostering partnerships built on mutual respect and understanding.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-block p-3 bg-beehive-light rounded-full text-beehive-yellow mb-4">
                <BriefcaseBusiness className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Professionalism</h3>
              <p className="text-gray-600">
                We maintain the highest standards of professionalism in all our interactions and deliverables.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-block p-3 bg-beehive-light rounded-full text-beehive-yellow mb-4">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Results-Driven</h3>
              <p className="text-gray-600">
                We focus on achieving measurable results that help our clients grow and succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Our success is driven by our talented team of professionals who are dedicated to helping our clients
              succeed.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">John Doe</h3>
              <p className="text-beehive-yellow font-medium mb-2">CEO & Founder</p>
              <p className="text-gray-600">
                With over 20 years of experience, John leads our team with vision and expertise.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Jane Smith</h3>
              <p className="text-beehive-yellow font-medium mb-2">COO</p>
              <p className="text-gray-600">
                Jane oversees our operations, ensuring we deliver exceptional service to our clients.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Michael Johnson</h3>
              <p className="text-beehive-yellow font-medium mb-2">Director of Services</p>
              <p className="text-gray-600">
                Michael leads our service delivery team, focusing on quality and client satisfaction.
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Sarah Williams</h3>
              <p className="text-beehive-yellow font-medium mb-2">Client Success Manager</p>
              <p className="text-gray-600">
                Sarah ensures our clients receive the support they need to achieve their goals.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center text-beehive-yellow hover:underline font-semibold">
              View All Team Members
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-beehive-yellow">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-beehive-black">Ready to Work With Us?</h2>
            <p className="text-lg text-beehive-black mb-8">
              Contact us today to learn how we can help your business grow and succeed.
            </p>
            <a
              href="/contact"
              className="inline-block bg-beehive-black text-white font-semibold px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

