"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";
import Header from "../components/header";
import Venture from "@/components/ventures/Venture";

export default function VenturesClientPage({ ventures }) {
  if (ventures.length === 0) {
    return (
      <div>
        <h1>Ventures are empty</h1>
      </div>
    );
  }

  // const ventures = dbVentures?.map((venture) => ({
  //   slug: venture.slug || venture.id,
  //   name: venture.name,
  //   tagline: venture.tagline || venture.shortDescription,
  //   description: venture.description,
  //   category: venture.category || venture.industry || "Tech",
  //   status: venture.status || "Active",
  //   founded: venture?.foundedYear,
  //   team: venture.teamSize ? `${venture.teamSize} people` : "Team",
  //   growth: venture.growth || "Growing",
  //   image:
  //     venture.featuredImage?.url ||
  //     venture.image ||
  //     "/placeholder.svg?height=400&width=600&text=Venture",
  //   website: venture.website || "#",
  // }));

  return (
    <>
      <Header />
      <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden -mt-[140px] pt-[160px]">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30" />
        <div className="absolute inset-0 bg-primary/8" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />

        <div className="pt-2 pb-8 relative z-10 w-full">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-[1600px]">
            <div className="text-center mb-12 max-w-6xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pot-black mb-6 font-syne">
                Our Ventures
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connected is home to a growing portfolio of ventures across
                tech, media, lifestyle, and digital services. Each brand is
                built with purpose, backed by strategy, and designed to shape
                the future. This is where ideas turn into impact.
              </p>
            </div>
          </div>

          <section className="py-8 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ventures.length === 0 ? (
                  <div className="col-span-full text-center text-lg text-gray-500 font-medium py-12">
                    No ventures available at this moment.
                  </div>
                ) : (
                  ventures?.map((venture) => (
                    <Venture
                      key={venture?._id || venture?.slug}
                      ventureData={venture}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
