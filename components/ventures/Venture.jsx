"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";
import { Users } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Venture = ({ ventureData }) => {
  const {
    id,
    slug,
    name,
    tagline,
    description,
    shortDescription,
    category,
    industry,
    founded,
    teamSize,
    growth,
    featuredImage,
    image,
    website,
  } = ventureData || {};

  console.log("from venture", ventureData)

  return (
    <Card
      key={slug || id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          src={
            featuredImage?.url ||
            image ||
            "/placeholder.svg?height=400&width=600&text=Venture"
          }
          alt={name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            {status || "Active"}
          </Badge>
          <Badge className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {category || industry || "Tech"}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="px-4 pt-4 pb-2 flex flex-col flex-grow">
        <CardTitle className="text-xl font-semibold text-gray-900 mb-1">
          {name}
        </CardTitle>
        <p className="text-sm text-primary font-medium mb-2">
          {tagline || shortDescription}
        </p>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {description}
        </CardDescription>
      </CardHeader>

      {/* Stats and Button */}
      <CardContent className="px-4 pt-0 pb-4 mt-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{founded}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{teamSize ? `${teamSize} people` : "Team"}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{growth || "Growing" || "+150%"}</span>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full text-sm font-semibold"
        >
          <Link href={`/ventures/${slug}`}>
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Venture;
