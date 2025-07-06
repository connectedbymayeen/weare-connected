"use client"
import { motion } from "framer-motion";
import Footer from "../components/footer";
import Header from "../components/header";
// Instead of direct import:
import { Activity, BicepsFlexed, HandHeart, Lightbulb, PartyPopper, Rocket, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import OfficesGallerySection from "../components/offices-gallery-section";
// Do this:




const content = [
        {
                title: "Collaborative Editing",
                description:
                        "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
                content: (
                        <div className="flex h-full w-full items-center justify-center text-white">
                                <img
                                        src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                                        width={300}
                                        height={300}
                                        className="h-full w-full object-cover"
                                        alt="linear board demo"
                                />
                        </div>
                ),
        },
        {
                title: "Real time changes",
                description:
                        "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
                content: (
                        <div className="flex h-full w-full items-center justify-center text-white">
                                <img
                                        src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                                        width={300}
                                        height={300}
                                        className="h-full w-full object-cover"
                                        alt="linear board demo"
                                />
                        </div>
                ),
        },
        {
                title: "Version control",
                description:
                        "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
                content: (
                        <div className="flex h-full w-full items-center justify-center text-white">
                                <img
                                        src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                                        width={300}
                                        height={300}
                                        className="h-full w-full object-cover"
                                        alt="linear board demo"
                                />
                        </div>
                ),
        },
        {
                title: "Running out of content",
                description:
                        "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
                content: (
                        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
                                Running out of content
                        </div>
                ),
        },
];
const departments = [
        {
                title: "Admin, Compliance & Corporate Affairs",
                description:
                        "Keeps the operations running smoothly, providing essential support across the organization.",
                imageUrl: "/your-image-path.jpg", // Replace with actual path
                link: "/jobs/admin",
        },
        {
                title: "Product Design",
                description:
                        "Crafts user-centric designs to ensure seamless experiences across all platforms.",
                imageUrl: "/your-image-path.jpg",
                link: "/jobs/design",
        },
        // Add more objects here as needed...
];
function page() {
        // Use dynamic content with fallbacks
        const contactData = content?.contact || {

                office: {
                        address: "Lotus Kamal Tower 2, 59-61, Gulshan South Avenue, Gulshan 1, 1212, Dhaka, Bangladesh",

                },
                emails: {
                        general: "hello@weareconnected.io",
                        business: "press@weareconnected.io",
                        careers: "careers@weareconnected.io",
                },
                phone: "+1 (415) 555-0123",
                hours: "Monday - Friday: 9:00 AM - 6:00 PM PST\nSaturday - Sunday: Closed",
        }
        const resources = [
                {
                        title: "Inspiration",
                        description: "At Connected, you aren’t just following a roadmap, you help define it. We empower you to envision bold ideas and turn them into reality, driving revolutions that matter.",
                        icon: <Lightbulb className="w-5 h-5" />,
                },
                {
                        title: "Momentum",
                        description: "Your ideas deserve more than a slow lane. Here, you’ll move fast, learn fast, and scale what works with the trust and resources to make it happen.",
                        icon: <Target className="w-5 h-5" />,
                },
                {
                        title: "Belonging",
                        description: "No revolution happens alone. You’ll work with people who amplify your strengths, share your ambition, and stand with you through every breakthrough.",
                        icon: < TrendingUp className="w-5 h-5" />,
                },

        ];
        const core = [
                {
                        title: "Be Bold, Stay Humble",
                        description: "Dare to imagine what others won’t, but stay grounded enough to learn, listen, and adapt.",
                        icon: <BicepsFlexed className="w-5 h-5" />,
                },
                {
                        title: "Engineer the Extraordinary",
                        description: "Don’t settle for “good enough.” Build solutions that challenge the limits of what’s possible.",
                        icon: <Target className="w-5 h-5" />,
                },
                {
                        title: "Empower the Collective",
                        description: "Trust and amplify every voice. We lift each other up because revolutions are never solo acts.",
                        icon: <TrendingUp className="w-5 h-5" />,
                },
                {
                        title: "Act with Velocity",
                        description: "Time is rocket fuel. Move decisively, experiment fearlessly, and keep momentum alive.",
                        icon: <Activity className="w-5 h-5" />,
                },
                {
                        title: "Own the Mission",
                        description: "Treat every challenge like it’s yours to solve. Accountability turns good intentions into real outcomes.",
                        icon: <Rocket className="w-5 h-5" />,
                },
                {
                        title: "Stay Transparent, Stay Trusted",
                        description: " Open minds. Open doors. We believe radical transparency earns trust, even in uncomfortable moments.",
                        icon: < HandHeart className="w-5 h-5" />,
                },
                {
                        title: "Evolve Relentlessly",
                        description: "Change is our default. We adapt, improve, and grow, because standing still is never an option.",
                        icon: < TrendingUp className="w-5 h-5" />,
                },
                {
                        title: "Think Like Owners",
                        description: "Act with care, courage, and commitment, every decision should be worthy of your name on it.",
                        icon: < Lightbulb className="w-5 h-5" />,
                },
                {
                        title: "Celebrate the Climb",
                        description: "Progress is never easy, but every step forward deserves recognition. We honor effort as much as results.",
                        icon: < PartyPopper className="w-5 h-5" />,
                },

        ];
        return (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30 -top-[120px] pt-[120px]">
                        <Header />
                        <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
                                <div className="absolute inset-y-0 left-0 h-full w-px bg-white dark:bg-neutral-800/80">
                                        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                                </div>
                                <div className="absolute inset-y-0 right-0 h-full w-px bg-white dark:bg-neutral-800/80">
                                        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-px w-full bg-white dark:bg-neutral-800/80"></div>
                                <div className="px-4 py-18 md:py-10">
                                        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-[58px] dark:text-slate-300">
                                                {"You could be the next revolution.".split(" ").map((word, index) => (
                                                        <motion.span
                                                                key={index}
                                                                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                                                transition={{
                                                                        duration: 0.3,
                                                                        delay: index * 0.1,
                                                                        ease: "easeInOut",
                                                                }}
                                                                className="mr-2 inline-block"
                                                        >
                                                                {word}
                                                        </motion.span>
                                                ))}
                                        </h1>
                                        <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.8 }}
                                                className="relative z-10 mx-auto max-w-[590px] py-5 mt-2 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
                                        >
                                                Turn your ambition into action, your ideas into impact, and your skills into the spark that transforms industries. At Connected, you’re not just building a career you’re launching a legacy.

                                        </motion.p>

                                        <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 1 }}
                                                className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
                                        >
                                                <button className="w-60 cursor:pointer transform rounded-lg bg-purple-500 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                                                        <Link href="careers">See All Jobs</Link>
                                                </button>
                                                <button className="w-60 cursor:pointer transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                                                        <Link href="/#">Life at Connected</Link>
                                                </button>
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 1.2 }}
                                                className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                                        >
                                                <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
                                                        <img
                                                                src="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D"
                                                                alt="Landing page preview"
                                                                className="aspect-[16/9] h-auto w-full object-cover"
                                                                height={1000}
                                                                width={1000}
                                                        />
                                                </div>
                                        </motion.div>
                                </div>
                        </div>

                        <h3 className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 px-4 md:px-8 max-w-7xl mx-auto text-5xl font-bold">
                                Why Connected
                        </h3>
                        <p className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 text-xl px-4 md:px-8 max-w-7xl mx-auto">
                                Join a team that believes bold dreams deserve bold execution. Let’s shape what’s next, together.

                        </p>

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
                                                <div className="h-full p-8 rounded-2xl border border-gray-300 bg-white/90 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out flex flex-col items-start">
                                                        <div className="mb-6">
                                                                <div className="p-3 rounded-full bg-gray-100">{resource.icon}</div>
                                                        </div>
                                                        <h4 className="text-2xl font-semibold text-gray-800 mb-4">{resource.title}</h4>
                                                        <p className="text-base text-gray-600 leading-relaxed">{resource.description}</p>
                                                </div>
                                        </motion.div>
                                ))}
                        </div>

                        {/* <div className="w-full py-4">
                                <StickyScroll content={content} />
                        </div> */}
                        <h3 className="py-6 px-4 md:px-8 max-w-[77rem] mx-auto text-6xl font-black">
                                Our Core Values
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4 md:px-8 max-w-7xl mx-auto">
                                {core.map((core, index) => (
                                        <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="group"
                                        >
                                                <div className="h-full p-8 rounded-2xl flex flex-col items-start">
                                                        <div className="mb-6">
                                                                <div className="p-3 rounded-full bg-gray-100">{core.icon}</div>
                                                        </div>
                                                        <h4 className="text-2xl font-semibold text-gray-800 mb-4">{core.title}</h4>
                                                        <p className="text-base text-gray-600 leading-relaxed">{core.description}</p>
                                                </div>
                                        </motion.div>
                                ))}
                        </div>

                        <OfficesGallerySection />


                        <Footer />
                </div>
        )
}

export default page
