import { notFound } from "next/navigation"

// import { getService } from "@/lib/data"
// import ServicePageContent from "@/components/service-page-content"
// import { getService } from "@/app/lib/data"
import ServicePageContent from "@/app/components/service-page-content"
import { getServiceBySlug, getServices } from "@/app/lib/data"

export async function generateStaticParams() {
  // Replace with your actual service slugs
  return [
    { slug: "web-development" },
    { slug: "mobile-app-development" },
    { slug: "ui-ux-design" },
    { slug: "digital-marketing" },
  ]
}

export async function generateMetadata({ params }) {
  const service = await getServices(params.slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: service.title,
    description: service.description,
  }
}

export default async function ServicePage({ params }) {
  const service = await getServices(params.slug)

  if (!service) {
    notFound()
  }

  return <ServicePageContent service={service} />
}
