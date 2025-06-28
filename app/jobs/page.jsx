"use client"
import { motion } from "framer-motion";
import Footer from "../components/footer";
import Header from "../components/header";
// Instead of direct import:
import { Lightbulb, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
// Do this:

import { StickyScroll } from "../../components/ui/sticky-scroll-reveal";


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
        const resources = [
                {
                        title: "Discover",
                        description: "We identify powerful ideas, emerging trends, and untapped opportunities ready to scale.",
                        icon: <Lightbulb className="w-5 h-5" />,
                },
                {
                        title: "Build",
                        description: "We develop brands, products, and platforms with speed, precision, and bold execution.",
                        icon: <Target className="w-5 h-5" />,
                },
                {
                        title: "Elevate",
                        description: "We grow ventures through strategic design, marketing, and long-term vision.",
                        icon: <TrendingUp className="w-5 h-5" />,
                },

        ];
        const core = [
                {
                        title: "Invent & simplify",
                        description: "We believe in solving tough problems with simple, innovative solutions that change the game.",
                        icon: <Lightbulb className="w-5 h-5" />,
                },
                {
                        title: "Deliver best experiences",
                        description: "We put people at the heart of everything, creating experiences that truly matter for our team, clients, and traders.",
                        icon: <Target className="w-5 h-5" />,
                },
                {
                        title: "Elevate",
                        description: "We put people at the heart of everything, creating experiences that truly matter for our team, clients, and traders.",
                        icon: <TrendingUp className="w-5 h-5" />,
                },
                {
                        title: "Elevate",
                        description: "We put people at the heart of everything, creating experiences that truly matter for our team, clients, and traders.",
                        icon: <TrendingUp className="w-5 h-5" />,
                },
                {
                        title: "Elevate",
                        description: "We put people at the heart of everything, creating experiences that truly matter for our team, clients, and traders.",
                        icon: <TrendingUp className="w-5 h-5" />,
                },
                {
                        title: "Elevate",
                        description: "We do what is right, not what is easy. Honesty and integrity are our compass, even in the toughest moments.",
                        icon: < TrendingUp className="w-5 h-5" />,
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
                                        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-6xl dark:text-slate-300">
                                                {"Your Next Big Move Starts Here".split(" ").map((word, index) => (
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
                                                className="relative z-10 mx-auto max-w-xl py-5 mt-2 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
                                        >
                                                Work with passionate people, solve real-world problems, and shape the future together.
                                        </motion.p>

                                        <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 1 }}
                                                className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
                                        >
                                                <button className="w-60 transform rounded-lg bg-purple-500 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                                                        <Link href="/careers">See All Jobs</Link>
                                                </button>
                                                <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                                                        <Link href="/life-at">Life at Connected</Link>
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
                                                                src="https://scontent.fccu25-1.fna.fbcdn.net/v/t39.30808-6/499239771_122214119204139774_8275103925858929384_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG4WUlACy1-DDp1FH-JoU9YHT3b1VtCKHAdPdvVW0IocGlPCqtOz330oHEG1WBWPz0eEzDyXw9XP0asK763UNjE&_nc_ohc=-CcLa3xStUwQ7kNvwHcZYFE&_nc_oc=Adly82Wjk3kCnqDpdwSjFD_iyTr0qNaBj14dp_oMvLlGubBg39HO9pYPe7_X3hiw9c23k868Zkivhjwqp_pGcH9U&_nc_zt=23&_nc_ht=scontent.fccu25-1.fna&_nc_gid=_rZg1_B0zDCnJPT93UZ1CA&oh=00_AfPaxUF2L0613Ybxf_Cl9Ok5Mf8RCmeeLGv2BFb9E5TYBA&oe=6865B276"
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
                                Because it’s not just about landing the job. It’s about ensuring we’re the right fit for each other.
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

                        <div className="w-full py-4">
                                <StickyScroll content={content} />
                        </div>
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
                        <div>
                                <div className="rounded-[22px] grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4 md:px-8 max-w-7xl mx-auto border-2 max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                                        <img
                                                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Fettjl2rGDjHBlCYCXcWMRAoKDr_AQOoXQ&s`}
                                                alt="jordans"
                                                height="400"
                                                width="400"
                                                className="object-contain"
                                        />
                                        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                                                Air Jordan 4 Retro Reimagined
                                        </p>

                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
                                                February 17, 2024. Your best opportunity to get these right now is by
                                                entering raffles and waiting for the official releases.
                                        </p>
                                        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                                                <span>Buy now </span>
                                                <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                                                        $100
                                                </span>
                                        </button>
                                </div>
                        </div>

                        <Footer />
                </div>
        )
}

export default page
