"use client";

import { useParams } from "next/navigation";
import { TravelDesigner } from "@/components/travel/TravelDesigner";

export default function AccountTravelEditPage() {
  const params = useParams();
  const reference = params.reference as string;

  return (
    <div className="py-2">
      <TravelDesigner reference={reference} redirectBase="/account/travel" />
    </div>
  );
}
