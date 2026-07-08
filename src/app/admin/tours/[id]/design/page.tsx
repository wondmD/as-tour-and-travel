"use client";

import { useParams } from "next/navigation";
import { TourDesignStudio } from "@/components/admin/tour/design/TourDesignStudio";

export default function AdminTourDesignPage() {
  const params = useParams();
  const tourId = params.id as string;
  return <TourDesignStudio tourId={tourId} />;
}
