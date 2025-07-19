"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Activity,
  BicepsFlexed,
  HandHeart,
  Lightbulb,
  PartyPopper,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Footer from "../components/footer";
import Header from "../components/header";
import OfficesGallerySection from "../components/offices-gallery-section";

function page() {
  const resources = [
    {
      title: "Inspiration",
      description:
        "At Connected, you aren’t just following a roadmap, you help define it. We empower you to envision bold ideas and turn them into reality, driving revolutions that matter.",
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      title: "Momentum",
      description:
        "Your ideas deserve more than a slow lane. Here, you’ll move fast, learn fast, and scale what works with the trust and resources to make it happen.",
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "Belonging",
      description:
        "No revolution happens alone. You’ll work with people who amplify your strengths, share your ambition, and stand with you through every breakthrough.",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const core = [
    {
      title: "Be Bold, Stay Humble",
      description:
        "Dare to imagine what others won’t, but stay grounded enough to learn, listen, and adapt.",
      icon: <BicepsFlexed className="w-5 h-5" />,
    },
    {
      title: "Engineer the Extraordinary",
      description:
        "Don’t settle for “good enough.” Build solutions that challenge the limits of what’s possible.",
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "Empower the Collective",
      description:
        "Trust and amplify every voice. We lift each other up because revolutions are never solo acts.",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Act with Velocity",
      description:
        "Time is rocket fuel. Move decisively, experiment fearlessly, and keep momentum alive.",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: "Own the Mission",
      description:
        "Treat every challenge like it’s yours to solve. Accountability turns good intentions into real outcomes.",
      icon: <Rocket className="w-5 h-5" />,
    },
    {
      title: "Stay Transparent, Stay Trusted",
      description:
        "Open minds. Open doors. We believe radical transparency earns trust, even in uncomfortable moments.",
      icon: <HandHeart className="w-5 h-5" />,
    },
    {
      title: "Evolve Relentlessly",
      description:
        "Change is our default. We adapt, improve, and grow, because standing still is never an option.",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Think Like Owners",
      description:
        "Act with care, courage, and commitment, every decision should be worthy of your name on it.",
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      title: "Celebrate the Climb",
      description:
        "Progress is never easy, but every step forward deserves recognition. We honor effort as much as results.",
      icon: <PartyPopper className="w-5 h-5" />,
    },
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30 -top-[120px] pt-[120px] text-black bg-white">
      <Header />

      <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
        <div className="absolute inset-y-0 left-0 h-full w-px bg-white">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-white">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-white"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 text-center mx-auto max-w-4xl px-4 mt-24"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
            You could be the next revolution.
          </h1>
          <p className="text-lg sm:text-xl md:text-1xl text-gray-700 leading-relaxed">
            Turn your ambition into action, your ideas into impact, and your skills into the spark that transforms industries. At Connected, you’re not just building a career - you’re launching a legacy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 rounded-lg bg-purple-500 px-6 py-2 font-medium text-white transition hover:-translate-y-0.5 hover:bg-gray-800">
            <Link href="/careers">See All Jobs</Link>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 mt-20 rounded-3xl border border-gray-200 bg-white p-4 shadow-md"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-200">
            <Image
              src="/connected_office.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
              priority
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center"
      >
        <h3 className="text-5xl font-bold mb-4">Why Connected</h3>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Join a team that believes bold dreams deserve bold execution. Let’s shape what’s next, together.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4 md:px-8 max-w-7xl mx-auto">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl border border-gray-300 bg-white shadow-xl hover:shadow-2xl transition duration-300 ease-in-out flex flex-col items-start">
              <div className="mb-6">
                <div className="p-3 rounded-full bg-gray-100">{resource.icon}</div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">{resource.title}</h4>
              <p className="text-base text-gray-600 leading-relaxed">{resource.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center"
      >
        <h3 className="text-6xl font-black mb-12">Our Core Values</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4 md:px-8 max-w-7xl mx-auto">
        {core.map((coreItem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl flex flex-col items-start bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
              <div className="mb-6">
                <div className="p-3 rounded-full bg-gray-100">{coreItem.icon}</div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">{coreItem.title}</h4>
              <p className="text-base text-gray-600 leading-relaxed">{coreItem.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <OfficesGallerySection />
      <Footer />
    </div>
  );
}

export default page;
