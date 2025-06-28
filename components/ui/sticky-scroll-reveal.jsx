"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const StickyScroll = ({ content, contentClassName }) => {
        const [activeCard, setActiveCard] = useState(0);
        const triggerRef = useRef(null);

        const { scrollYProgress } = useScroll({
                target: triggerRef, // use full section for progress
                offset: ["start start", "end end"],
        });

        const cardLength = content.length;

        useMotionValueEvent(scrollYProgress, "change", (latest) => {
                const cardsBreakpoints = content.map((_, index) => index / cardLength);
                const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
                        const distance = Math.abs(latest - breakpoint);
                        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                                return index;
                        }
                        return acc;
                }, 0);
                setActiveCard(closestBreakpointIndex);
        });

        const linearGradients = [
                "linear-gradient(to bottom right, #06b6d4, #10b981)",
                "linear-gradient(to bottom right, #ec4899, #6366f1)",
                "linear-gradient(to bottom right, #f97316, #eab308)",
        ];

        const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

        useEffect(() => {
                setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
        }, [activeCard]);

        return (
                <section ref={triggerRef} className="bg-white py-20 max-w-7xl mx-auto overflow-hidden">
                        <div className="flex flex-col lg:flex-row gap-16 items-start px-6">
                                {/* Text Section */}
                                <div className="w-full lg:w-1/2">
                                        {content.map((item, index) => (
                                                <div key={item.title + index} className="my-28">
                                                        <motion.h2
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                                                className="text-4xl font-bold text-gray-900 transition-opacity duration-500"
                                                        >
                                                                {item.title}
                                                        </motion.h2>
                                                        <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                                                className="mt-6 text-lg text-gray-600 transition-opacity duration-500 max-w-lg"
                                                        >
                                                                {item.description}
                                                        </motion.p>
                                                </div>
                                        ))}
                                </div>

                                {/* Sticky Image Section */}
                                <div
                                        style={{ background: backgroundGradient }}
                                        className={cn(
                                                "sticky top-10 hidden lg:flex h-[420px] w-[520px] items-center justify-center rounded-2xl shadow-lg transition-all duration-500",
                                                contentClassName
                                        )}
                                >
                                        {content[activeCard].content ?? null}
                                </div>
                        </div>
                </section>
        );
};
