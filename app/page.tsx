"use client"

import Link from "next/link"
import { Database, Code, ArrowRight, Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a1120] text-white">
      {/* Navigation */}
      <nav className="border-b border-[#1e2a3b] bg-[#0a1120]/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mr-2">
              <Database className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Migrator Pro</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-gray-300 hover:text-white">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white">
              How It Works
            </Link>
            <Link href="/documentation" className="text-gray-300 hover:text-white">
              Documentation
            </Link>
            <Link href="/designer">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                Try Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Design Laravel Database Migrations{" "}
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
                  Visually
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Create, visualize, and generate Laravel migrations and models with an intuitive drag-and-drop interface.
                No more writing migrations by hand.
              </p>
              <div className="flex gap-4">
                <Link href="/designer">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  >
                    Try Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/documentation">
                  <Button size="lg" variant="outline" className="border-[#1e2a3b] hover:border-[#2e3a4b] text-gray-200">
                    Documentation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg border border-[#1e2a3b] overflow-hidden shadow-2xl">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Laravel Migration Designer Interface"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#0c1424]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Powerful Features for Laravel Developers</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Database Design</h3>
              <p className="text-gray-300">
                Design your database schema visually with an intuitive interface. Add tables, fields, and relationships
                with ease.
              </p>
            </div>

            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Code Generation</h3>
              <p className="text-gray-300">
                Generate Laravel migration files and model classes automatically from your visual design.
              </p>
            </div>

            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-pink-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Relationship Mapping</h3>
              <p className="text-gray-300">
                Define relationships between models with a few clicks. Supports all Laravel relationship types.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-pink-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 7L9 19L3 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Schema Visualization</h3>
              <p className="text-gray-300">
                Visualize your entire database schema with interactive diagrams showing tables and their relationships.
              </p>
            </div>

            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-pink-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Management</h3>
              <p className="text-gray-300">
                Organize your database designs into projects. Perfect for managing multiple applications or versions.
              </p>
            </div>

            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-pink-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 9L12 16L5 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Export & Import</h3>
              <p className="text-gray-300">
                Export your designs as Laravel migration files or import existing database schemas to visualize them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Your Schema</h3>
              <p className="text-gray-300">
                Create models, add fields, and define relationships using our intuitive visual designer. Drag and drop
                to organize your schema.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualize Relationships</h3>
              <p className="text-gray-300">
                See how your models connect with our interactive schema visualizer. Identify and fix design issues
                before writing any code.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Code</h3>
              <p className="text-gray-300">
                Export your design as Laravel migration and model files. Copy directly or download as a complete package
                ready to use in your project.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/designer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              >
                Start Designing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#0c1424]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What Developers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#1e2a3b] mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">Senior Laravel Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "This tool has saved me hours of writing migrations by hand. The visual approach makes it so much easier
                to design complex database schemas."
              </p>
            </div>

            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#1e2a3b] mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-400 text-sm">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The relationship visualization is a game-changer. I can see exactly how my models connect and catch
                design flaws early in the process."
              </p>
            </div>

            <div className="bg-[#131e2d] p-6 rounded-lg border border-[#1e2a3b]">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#1e2a3b] mr-4"></div>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-gray-400 text-sm">Laravel Consultant</p>
                </div>
              </div>
              <p className="text-gray-300">
                "I use this with all my clients now. It helps them understand database design without needing to know
                the technical details of Laravel migrations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Laravel Development?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Laravel developers who are designing database schemas visually and saving hours of
            development time.
          </p>
          <Link href="/designer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
            >
              Start Designing For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2a3b] py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mr-2">
                <Database className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Migrator Pro</span>
            </div>

            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="#features" className="text-gray-300 hover:text-white">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white">
                How It Works
              </Link>
              <Link href="/documentation" className="text-gray-300 hover:text-white">
                Documentation
              </Link>
              <Link href="/help" className="text-gray-300 hover:text-white">
                Help
              </Link>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#1e2a3b] text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Migrator Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
