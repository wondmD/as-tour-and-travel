"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  SubmitButton,
  SwitchField,
  TextField,
  TextareaField,
} from "@/components/forms";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  EmptyState,
  Spinner,
  toast,
} from "@/components/ui";
import { useAddJournalEntry, useJournal } from "@/lib/hooks/use-travel-data";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Write something about this memory"),
  location: Yup.string(),
  isPublic: Yup.boolean(),
});

export default function JournalPage() {
  const { data, isLoading } = useJournal();
  const addEntry = useAddJournalEntry();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Travel journal"
        description="Document memories by trip — private or shared publicly."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> New entry
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading journal…" />
      ) : !data?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No journal entries"
          description="Capture photos and notes from your adventures."
          action={<Button size="sm" onClick={() => setOpen(true)}>Write first entry</Button>}
        />
      ) : (
        <div className="space-y-3">
          {data.map((entry) => (
            <Card key={entry.id} static>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-heading font-semibold text-text-primary">{entry.title}</p>
                    {entry.location && (
                      <p className="text-xs text-text-secondary">{entry.location}</p>
                    )}
                  </div>
                  <Badge variant={entry.isPublic ? "success" : "neutral"}>
                    {entry.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{entry.body}</p>
                <p className="mt-2 text-xs text-text-secondary/70">
                  {new Date(entry.createdAt).toLocaleDateString()}
                  {entry.photoCount > 0 && ` · ${entry.photoCount} photos`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen} title="New journal entry">
        <Formik
          initialValues={{ title: "", body: "", location: "", isPublic: false }}
          validationSchema={schema}
          onSubmit={async (values, { resetForm }) => {
            await addEntry.mutateAsync(values);
            toast.success("Entry saved");
            resetForm();
            setOpen(false);
          }}
        >
          <Form className="space-y-4">
            <TextField name="title" label="Title" required />
            <TextField name="location" label="Location" placeholder="Lalibela, Gondar…" />
            <TextareaField name="body" label="Your story" required rows={5} />
            <SwitchField name="isPublic" label="Share publicly" description="Subject to moderation before appearing on the site." />
            <SubmitButton fullWidth>Save entry</SubmitButton>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
}
