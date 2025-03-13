import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-beehive-black text-white py-16 md:py-24 lg:py-32">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">Our Services</h1>
            <p className="text-lg md:text-xl text-gray-300">
              We offer a comprehensive range of professional services designed to help your business thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Help Businesses</h2>
            <p className="text-lg text-gray-600">
              Our services are designed to address the unique needs and challenges of businesses in various industries.
            </p>
          </div>

          <div className="grid gap-12 md:gap-16">
            {/* Service 1 */}
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold mb-4">Service 1</h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive solution designed to help businesses optimize their operations and improve efficiency.
                  Our team of experts works closely with you to identify areas for improvement and implement effective
                  strategies.
                </p>
                <p className="text-gray-600 mb-6">
                  Our approach is data-driven and focused on delivering measurable results. We use industry best
                  practices and innovative techniques to ensure that our solutions are effective and sustainable.
                </p>
                <a href="#" className="inline-flex items-center text-beehive-yellow hover:underline font-semibold">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              <div className="order-1 lg:order-2 relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src="/placeholder.svg?height=800&width=1200" alt="Service 1" fill className="object-cover" />
              </div>
            </div>

            {/* Service 2 */}
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src="/placeholder.svg?height=800&width=1200" alt="Service 2" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Service 2</h3>
                <p className="text-gray-600 mb-4">
                  Expert consulting services to help businesses develop effective strategies and achieve their goals. We
                  provide insights and recommendations based on thorough analysis and industry knowledge.
                </p>
                <p className="text-gray-600 mb-6">
                  Our consultants work closely with your team to understand your business objectives and create tailored
                  strategies that drive growth and success.
                </p>
                <a href="#" className="inline-flex items-center text-beehive-yellow hover:underline font-semibold">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Service 3 */}
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold mb-4">Service 3</h3>
                <p className="text-gray-600 mb-4">
                  Innovative solutions to protect your business assets and ensure long-term growth and stability. Our
                  comprehensive approach addresses various aspects of your business to minimize risks.
                </p>
                <p className="text-gray-600 mb-6">
                  We develop customized solutions that take into account your specific industry, business model, and
                  objectives, ensuring that our services are aligned with your needs.
                </p>
                <a href="#" className="inline-flex items-center text-beehive-yellow hover:underline font-semibold">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              <div className="order-1 lg:order-2 relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src="/placeholder.svg?height=800&width=1200" alt="Service 3" fill className="object-cover" />
              </div>
            </div>

            {/* Service 4 */}
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src="/placeholder.svg?height=800&width=1200" alt="Service 4" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Service 4</h3>
                <p className="text-gray-600 mb-4">
                  Professional assistance to help businesses manage their resources effectively and maximize returns. We
                  provide expert guidance on resource allocation and optimization.
                </p>
                <p className="text-gray-600 mb-6">
                  Our team works with you to develop and implement strategies that improve efficiency, reduce costs, and
                  enhance productivity across your organization.
                </p>
                <a href="#" className="inline-flex items-center text-beehive-yellow hover:underline font-semibold">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Pricing</h2>
            <p className="text-lg text-gray-600">
              We offer flexible pricing options to meet the needs of businesses of all sizes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
                <p className="text-gray-600 mb-4">Perfect for small businesses</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$499</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Service 1 Basic Features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Service 2 Basic Features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Email Support</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Service 3 Features</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Priority Support</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <a
                  href="#"
                  className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-md transition-colors"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-beehive-yellow transform scale-105">
              <div className="bg-beehive-yellow text-center py-2">
                <span className="text-sm font-semibold text-beehive-black">MOST POPULAR</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Professional Plan</h3>
                <p className="text-gray-600 mb-4">Ideal for growing businesses</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$999</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Service 1 Advanced Features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Service 2 Advanced Features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Service 3 Basic Features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Email & Phone Support</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Dedicated Account Manager</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <a
                  href="#"
                  className="block text-center bg-beehive-yellow hover:bg-beehive-hover text-beehive-black font-semibold py-3 rounded-md transition-colors"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Enterprise Plan</h3>
                <p className="text-gray-600 mb-4">For large organizations</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$1,999</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>All Services Premium Features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Custom Solutions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Priority Support 24/7</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Dedicated Account Manager</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-beehive-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Quarterly Business Reviews</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <a
                  href="#"
                  className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-md transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-600">
            <p>
              Need a custom solution?{" "}
              <a href="#" className="text-beehive-yellow hover:underline">
                Contact us
              </a>{" "}
              for personalized pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-beehive-black text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Contact us today to schedule a consultation and learn how our services can benefit your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="bg-beehive-yellow text-beehive-black font-semibold px-8 py-3 rounded-md hover:bg-beehive-hover transition-colors"
              >
                Schedule a Consultation
              </a>
              <a
                href="#"
                className="border border-white text-white font-semibold px-8 py-3 rounded-md hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

