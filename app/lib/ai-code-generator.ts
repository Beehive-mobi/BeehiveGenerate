"use server"

import { generateObject } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import type { WebsiteDesign, WebsiteCode } from "./schema"

export async function generateWebsiteCode(design: WebsiteDesign): Promise<WebsiteCode> {
  try {
    // Define the schema for the website code
    const websiteCodeSchema = z.object({
      html: z.string(),
      css: z.string(),
      javascript: z.string().optional(),
      nextjs: z
        .object({
          pages: z.array(
            z.object({
              name: z.string(),
              code: z.string(),
            }),
          ),
          components: z.array(
            z.object({
              name: z.string(),
              code: z.string(),
            }),
          ),
          styles: z.array(
            z.object({
              name: z.string(),
              code: z.string(),
            }),
          ),
        })
        .optional()
        .default({
          pages: [],
          components: [],
          styles: [],
        }),
    })

    // Create a detailed prompt for the AI
    const prompt = `
    Generate complete website code based on the following design specifications:
    
    Design Name: ${design.name}
    Description: ${design.description}
    
    Color Palette:
    - Primary: ${design.colorPalette.primary}
    - Secondary: ${design.colorPalette.secondary}
    - Accent: ${design.colorPalette.accent}
    - Background: ${design.colorPalette.background}
    - Text: ${design.colorPalette.text}
    
    Typography:
    - Heading Font: ${design.typography.headingFont}
    - Body Font: ${design.typography.bodyFont}
    
    Layout:
    - Type: ${design.layout.type}
    - Sections: ${design.layout.sections.join(", ")}
    
    Features: ${design.features.join(", ")}
    
    Image Style: ${design.imageStyle}
    
    Please generate a complete website implementation with the following:
    
    1. HTML: A complete HTML file with proper structure
    2. CSS: Comprehensive styling that matches the color palette and typography
    3. JavaScript: Basic functionality for interactivity
    4. Next.js Implementation:
       - Pages: index.js, about.js, and _app.js
       - Components: Layout.js, Header.js, Footer.js, and components for each section
       - Styles: globals.css and tailwind.config.js
    
    Make sure the code is modern, responsive, accessible, and follows best practices.
    Make sure import componets and file name is imported correctly.
    Use Tailwind CSS for styling in the Next.js implementation.
    Include proper comments to explain the code.
    Ensure all components work together correctly.
    `

    // Generate the code using the AI
    const result = await generateObject({
      model: anthropic("claude-3-opus-20240229"),
      schema: websiteCodeSchema,
      prompt,
    })

    console.log(result.object)

    return result.object
  } catch (error) {
    console.error("Error generating website code:", error)
    // If there's an error, fall back to simulation for demo purposes
    return simulateCodeGeneration(design)
  }
}

// Fallback function to simulate code generation when API is not available
function simulateCodeGeneration(design: WebsiteDesign): WebsiteCode {
  const primaryColor = design.colorPalette.primary
  const secondaryColor = design.colorPalette.secondary
  const accentColor = design.colorPalette.accent
  const backgroundColor = design.colorPalette.background
  const textColor = design.colorPalette.text
  const headingFont = design.typography.headingFont
  const bodyFont = design.typography.bodyFont

  return {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${design.name}</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(" ", "+")}&family=${bodyFont.replace(" ", "+")}&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <div class="logo">Company Name</div>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <h1>Welcome to Our Website</h1>
      <p>A brief description of your company and what you offer.</p>
      <a href="#contact" class="btn">Get Started</a>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <h2>About Us</h2>
      <p>Information about your company, mission, and values.</p>
    </div>
  </section>

  <section id="services" class="services">
    <div class="container">
      <h2>Our Services</h2>
      <div class="services-grid">
        <div class="service-card">
          <h3>Service 1</h3>
          <p>Description of service 1.</p>
        </div>
        <div class="service-card">
          <h3>Service 2</h3>
          <p>Description of service 2.</p>
        </div>
        <div class="service-card">
          <h3>Service 3</h3>
          <p>Description of service 3.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2>Contact Us</h2>
      <form>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        <button type="submit" class="btn">Send Message</button>
      </form>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2023 Company Name. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,
    css: `/* Base styles */
:root {
  --primary-color: ${primaryColor};
  --secondary-color: ${secondaryColor};
  --accent-color: ${accentColor};
  --background-color: ${backgroundColor};
  --text-color: ${textColor};
  --heading-font: '${headingFont}', sans-serif;
  --body-font: '${bodyFont}', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--body-font);
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

ul {
  list-style: none;
}

img {
  max-width: 100%;
}

section {
  padding: 80px 0;
}

/* Header */
header {
  background-color: var(--background-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 100;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
}

.nav-links li {
  margin-left: 30px;
}

.nav-links a {
  color: var(--text-color);
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

/* Hero Section */
.hero {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 150px 0 100px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: var(--accent-color);
}

/* About Section */
.about {
  text-align: center;
}

/* Services Section */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.service-card {
  background-color: white;
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-10px);
}

/* Contact Section */
.contact {
  background-color: var(--accent-color);
}

form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

textarea {
  height: 150px;
}

/* Footer */
footer {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 30px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  section {
    padding: 60px 0;
  }
}`,
    javascript: `// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form submission
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Here you would typically send the data to a server
      console.log('Form submitted:', { name, email, message });
      
      // Reset form
      form.reset();
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon.');
    });
  }
});`,
    nextjs: {
      pages: [
        {
          name: "index.js",
          code: `import Head from 'next/head'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <div>
      <Head>
        <title>${design.name}</title>
        <meta name="description" content="${design.description}" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(" ", "+")}&family=${bodyFont.replace(" ", "+")}&display=swap" rel="stylesheet" />
      </Head>
      
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
    </div>
  )
}`,
        },
        {
          name: "about.js",
          code: `import Head from 'next/head'

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us | ${design.name}</title>
        <meta name="description" content="Learn more about our company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto px-4 py-20 mt-16">
        <h1 className="text-4xl font-bold mb-6">About Our Company</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
              Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
              rhoncus ut eleifend nibh porttitor.
            </p>
            <p className="mb-4">
              Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl 
              tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor 
              posuere. Praesent id metus massa, ut blandit odio.
            </p>
          </div>
          <div>
            <img src="/placeholder.svg?height=400&width=600" alt="About our company" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </main>
    </div>
  )
}`,
        },
        {
          name: "_app.js",
          code: `import '../styles/globals.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp`,
        },
      ],
      components: [
        {
          name: "Layout.js",
          code: `import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}`,
        },
        {
          name: "Header.js",
          code: `import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Company Name
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-800 hover:text-primary transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-primary transition">
              About
            </Link>
            <Link href="/services" className="text-gray-800 hover:text-primary transition">
              Services
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-primary transition">
              Contact
            </Link>
          </div>
          
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
        
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <Link href="/" className="block py-2 text-gray-800 hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="block py-2 text-gray-800 hover:text-primary">
              About
            </Link>
            <Link href="/services" className="block py-2 text-gray-800 hover:text-primary">
              Services
            </Link>
            <Link href="/contact" className="block py-2 text-gray-800 hover:text-primary">
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}`,
        },
        {
          name: "Hero.js",
          code: `import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-secondary text-white text-center py-32 pt-40">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          A brief description of your company and what you offer.
        </p>
        <Link href="/contact" className="bg-primary hover:bg-accent text-white font-bold py-3 px-8 rounded-lg transition duration-300">
          Get Started
        </Link>
      </div>
    </section>
  )
}`,
        },
        {
          name: "About.js",
          code: `export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">About Us</h2>
        <p className="max-w-2xl mx-auto text-lg">
          Information about your company, mission, and values. Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed 
          erat molestie vehicula.
        </p>
      </div>
    </section>
  )
}`,
        },
        {
          name: "Services.js",
          code: `export default function Services() {
  const services = [
    {
      title: 'Service 1',
      description: 'Description of service 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      title: 'Service 2',
      description: 'Description of service 2. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie.'
    },
    {
      title: 'Service 3',
      description: 'Description of service 3. Ut in nulla enim. Phasellus molestie magna non est bibendum.'
    }
  ]

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition transform hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`,
        },
        {
          name: "Contact.js",
          code: `import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
    setSubmitSuccess(true)

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section id="contact" className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Contact Us</h2>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-medium">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Thank you for your message! We will get back to you soon.
            </div>
          )}
        </form>
      </div>
    </section>
  )
}`,
        },
        {
          name: "Footer.js",
          code: `export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
      </div>
    </footer>
  )
}`,
        },
      ],
      styles: [
        {
          name: "globals.css",
          code: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: ${primaryColor};
  --secondary-color: ${secondaryColor};
  --accent-color: ${accentColor};
  --background-color: ${backgroundColor};
  --text-color: ${textColor};
}

@layer base {
  body {
    font-family: '${bodyFont}', sans-serif;
    color: var(--text-color);
    background-color: var(--background-color);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: '${headingFont}', sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition duration-300;
  }
}

/* Additional custom styles */
.container {
  @apply px-4 mx-auto;
  max-width: 1200px;
}`,
        },
        {
          name: "tailwind.config.js",
          code: `module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${primaryColor}',
        secondary: '${secondaryColor}',
        accent: '${accentColor}',
        background: '${backgroundColor}',
        text: '${textColor}',
      },
      fontFamily: {
        heading: ['${headingFont}', 'sans-serif'],
        body: ['${bodyFont}', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`,
        },
      ],
    },
  }
}

