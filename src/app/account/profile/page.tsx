"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/dashboard";
import {
  SelectField,
  SubmitButton,
  TextField,
} from "@/components/forms";
import { Card, CardContent, Spinner, toast } from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks/use-travel-data";
import { useAuthStore, useSession } from "@/lib/stores/auth";
import { mockDb } from "@/lib/mock/db";

const schema = Yup.object({
  fullName: Yup.string().required(),
  phone: Yup.string().required(),
  nationality: Yup.string().required(),
  preferredLanguage: Yup.string().required(),
  emergencyContactName: Yup.string(),
  emergencyContactPhone: Yup.string(),
  passportNumber: Yup.string(),
});

export default function ProfilePage() {
  const session = useSession();
  const updateProfile = useUpdateProfile();
  const authUpdate = useAuthStore((s) => s.updateProfile);

  if (!session) return null;

  const profile =
    mockDb.profiles.find((p) => p.userId === session.user.id) ?? session.profile;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Personal details used for bookings and emergency contact."
      />
      <Card static className="max-w-2xl">
        <CardContent>
          <Formik
            enableReinitialize
            initialValues={{
              fullName: session.user.fullName,
              phone: session.user.phone,
              nationality: profile?.nationality ?? "",
              preferredLanguage: profile?.preferredLanguage ?? "en",
              emergencyContactName: profile?.emergencyContactName ?? "",
              emergencyContactPhone: profile?.emergencyContactPhone ?? "",
              passportNumber: profile?.passportNumber ?? "",
            }}
            validationSchema={schema}
            onSubmit={async (values) => {
              await updateProfile.mutateAsync({
                nationality: values.nationality,
                preferredLanguage: values.preferredLanguage as "en",
                emergencyContactName: values.emergencyContactName,
                emergencyContactPhone: values.emergencyContactPhone,
                passportNumber: values.passportNumber,
              });
              authUpdate({
                nationality: values.nationality,
                preferredLanguage: values.preferredLanguage as "en",
                emergencyContactName: values.emergencyContactName,
                emergencyContactPhone: values.emergencyContactPhone,
                passportNumber: values.passportNumber,
              });
              toast.success("Profile saved (mock)");
            }}
          >
            <Form className="space-y-4">
              <TextField name="fullName" label="Full name" required disabled hint="Contact support to change legal name" />
              <TextField name="phone" label="Phone" required type="tel" />
              <TextField name="nationality" label="Nationality" required />
              <SelectField
                name="preferredLanguage"
                label="Preferred language"
                required
                options={[
                  { value: "en", label: "English" },
                  { value: "am", label: "Amharic" },
                  { value: "ar", label: "Arabic" },
                  { value: "fr", label: "French" },
                  { value: "zh", label: "Chinese" },
                ]}
              />
              <TextField name="emergencyContactName" label="Emergency contact name" />
              <TextField name="emergencyContactPhone" label="Emergency contact phone" type="tel" />
              <TextField
                name="passportNumber"
                label="Passport number (optional)"
                hint="Stored encrypted in production; speeds up flight bookings."
              />
              <SubmitButton>Save profile</SubmitButton>
            </Form>
          </Formik>
        </CardContent>
      </Card>
    </>
  );
}
