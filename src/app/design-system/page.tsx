"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  CalendarCheck,
  Compass,
  Heart,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DropdownMenu,
  EmptyState,
  Input,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  Select,
  Sheet,
  Skeleton,
  SkeletonText,
  Spinner,
  StatCard,
  StatusBadge,
  Switch,
  Tabs,
  Tooltip,
  TooltipProvider,
  toast,
} from "@/components/ui";
import {
  CheckboxField,
  RadioGroupField,
  SelectField,
  SubmitButton,
  TextField,
  TextareaField,
} from "@/components/forms";

const swatches = [
  { name: "primary", classes: "bg-primary" },
  { name: "primary-light", classes: "bg-primary-light" },
  { name: "primary-dark", classes: "bg-primary-dark" },
  { name: "secondary", classes: "bg-secondary" },
  { name: "accent", classes: "bg-accent" },
  { name: "success", classes: "bg-success" },
  { name: "warning", classes: "bg-warning" },
  { name: "danger", classes: "bg-danger" },
  { name: "info", classes: "bg-info" },
];

const bookingSchema = Yup.object({
  fullName: Yup.string().min(3, "At least 3 characters").required("Full name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9\s-]{9,15}$/, "Enter a valid phone number")
    .required("Phone is required"),
  tour: Yup.string().required("Choose a tour"),
  travelers: Yup.string().required("Choose a group size"),
  notes: Yup.string().max(300, "Keep it under 300 characters"),
  terms: Yup.boolean().oneOf([true], "You must accept the cancellation policy"),
});

function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-bold text-text-primary">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-text-secondary">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [page, setPage] = useState(3);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [plan, setPlan] = useState("standard");
  const [tab, setTab] = useState("components");

  return (
    <TooltipProvider>
      <div className="pattern-surface min-h-dvh">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
          <header>
            <Badge variant="primary" dot>Internal — component reference</Badge>
            <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
              AS Tour &amp; Travel Design System
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Brand-aware UI kit powering the public site, traveler portal, and admin
              dashboard. Every component below reads its colors, radii, and typography
              from the design tokens in <code className="rounded bg-primary/8 px-1.5 py-0.5 text-xs text-primary">globals.css</code>.
            </p>
          </header>

          <DemoSection title="Color tokens">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
              {swatches.map((swatch) => (
                <div key={swatch.name}>
                  <div className={`h-14 rounded-xl shadow-inner ${swatch.classes}`} />
                  <p className="mt-1.5 text-[11px] font-medium text-text-secondary">
                    {swatch.name}
                  </p>
                </div>
              ))}
            </div>
          </DemoSection>

          <DemoSection title="Buttons" description="Variants × sizes, loading and disabled states.">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Search"><Search className="size-4" /></Button>
              <Button loading>Processing…</Button>
              <Button disabled>Disabled</Button>
            </div>
          </DemoSection>

          <DemoSection title="Badges & status" description="Generic badges plus the booking/payment lifecycle StatusBadge.">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="accent">Featured</Badge>
              <Badge variant="success" dot>Paid</Badge>
              <Badge variant="warning" dot>Awaiting payment</Badge>
              <Badge variant="danger" dot>Overdue</Badge>
              <Badge variant="info">12 seats left</Badge>
              <Badge variant="outline">Draft</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {(["confirmed", "pending", "active", "completed", "cancelled", "refunded", "failed", "draft"] as const).map(
                (status) => <StatusBadge key={status} status={status} />,
              )}
            </div>
          </DemoSection>

          <DemoSection title="Stat cards" description="KPI cards with delta indicators and sparklines for dashboards.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Revenue" value="$31,200" icon={Wallet} tone="primary" delta={16.4} trend={[8, 11, 9, 14, 12, 19, 27, 31]} />
              <StatCard label="Bookings" value="57" icon={CalendarCheck} tone="accent" delta={9.8} trend={[4, 7, 6, 10, 9, 14, 16]} />
              <StatCard label="Wishlist saves" value="483" icon={Heart} tone="info" delta={31.5} trend={[120, 180, 210, 260, 340, 410, 483]} />
              <StatCard label="Tours live" value="4" icon={Compass} tone="success" />
            </div>
          </DemoSection>

          <DemoSection title="Formik + Yup form kit" description="Field-level validation rendered next to each control (touch a field and leave it empty).">
            <Card static className="max-w-2xl">
              <CardContent>
                <Formik
                  initialValues={{ fullName: "", email: "", phone: "", tour: "", travelers: "2", notes: "", terms: false }}
                  validationSchema={bookingSchema}
                  onSubmit={async (values, { resetForm }) => {
                    await new Promise((resolve) => setTimeout(resolve, 900));
                    toast.success("Demo booking submitted", { description: `Thanks ${values.fullName}, this will hit the API in Phase 1.` });
                    resetForm();
                  }}
                >
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <TextField name="fullName" label="Full name" required placeholder="Amina Kedir" />
                      <TextField name="email" label="Email" required type="email" placeholder="you@example.com" startAdornment={<Mail />} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <TextField name="phone" label="Phone" required type="tel" inputMode="tel" placeholder="+251 9…" startAdornment={<Phone />} hint="Include your country code" />
                      <SelectField
                        name="tour"
                        label="Tour"
                        required
                        placeholder="Choose a tour"
                        options={[
                          { value: "north", label: "Historic North Circuit" },
                          { value: "danakil", label: "Danakil Expedition" },
                          { value: "omo", label: "Omo Valley Culture" },
                        ]}
                      />
                    </div>
                    <RadioGroupField
                      name="travelers"
                      label="Group size"
                      appearance="cards"
                      orientation="horizontal"
                      options={[
                        { value: "1", label: "Solo", description: "1 traveler" },
                        { value: "2", label: "Couple", description: "2 travelers" },
                        { value: "4", label: "Family", description: "3–5 travelers" },
                      ]}
                    />
                    <TextareaField name="notes" label="Special requests" placeholder="Dietary needs, accessibility, pickup point…" />
                    <CheckboxField name="terms" label="I accept the cancellation policy" description="Free cancellation up to 14 days before departure." />
                    <div className="flex justify-end">
                      <SubmitButton>Submit booking</SubmitButton>
                    </div>
                  </Form>
                </Formik>
              </CardContent>
            </Card>
          </DemoSection>

          <DemoSection title="Standalone controls" description="Uncontrolled-friendly primitives used outside Formik.">
            <div className="grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
              <Input placeholder="Search tours…" startAdornment={<Search />} />
              <Select
                placeholder="Filter by status"
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "pending", label: "Pending" },
                ]}
              />
              <Checkbox checked={checked} onCheckedChange={setChecked} label="Email me trip reminders" description="7 days and 1 day before departure." />
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} label="SMS notifications" description="Requires a verified phone number." />
            </div>
            <RadioGroup
              value={plan}
              onValueChange={setPlan}
              orientation="horizontal"
              appearance="cards"
              options={[
                { value: "standard", label: "Standard", description: "Shared rooms" },
                { value: "comfort", label: "Comfort", description: "Private rooms" },
                { value: "premium", label: "Premium", description: "4★ hotels + private car" },
              ]}
            />
          </DemoSection>

          <DemoSection title="Overlays" description="Dialog, sheet, dropdown, popover, tooltip, and toasts.">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
              <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open sheet</Button>
              <DropdownMenu
                trigger={<Button variant="secondary">Row actions <MoreHorizontal className="size-4" /></Button>}
                items={[
                  { type: "label", label: "Booking AST-1042" },
                  { label: "Edit", icon: Pencil, onSelect: () => toast.info("Edit action") },
                  { type: "separator" },
                  { label: "Cancel booking", icon: Trash2, destructive: true, onSelect: () => toast.error("Cancelled (demo)") },
                ]}
              />
              <Popover trigger={<Button variant="secondary">Popover</Button>}>
                <p className="text-sm font-semibold text-text-primary">Departure details</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  Aug 14, 2026 · 12 of 20 seats sold · meeting point Bole International Airport.
                </p>
              </Popover>
              <Tooltip content="Seats remaining on this departure">
                <Button variant="ghost">Hover me</Button>
              </Tooltip>
              <Button variant="soft" onClick={() => toast.success("Payment received", { description: "Booking AST-1042 confirmed — invoice sent." })}>
                Success toast
              </Button>
              <Button variant="soft" onClick={() => toast.error("Payment failed", { description: "Telebirr session expired. The seat hold is kept for 10 more minutes." })}>
                Error toast
              </Button>
            </div>

            <Dialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              title="Cancel booking AST-1042?"
              description="The traveler will be notified and the refund processed per the cancellation policy."
              footer={
                <>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>Keep booking</Button>
                  <Button variant="danger" onClick={() => { setDialogOpen(false); toast.success("Booking cancelled (demo)"); }}>
                    Cancel booking
                  </Button>
                </>
              }
            >
              <p className="text-sm leading-relaxed text-text-secondary">
                2 travelers · Historic North Circuit · departs Aug 14, 2026. Refundable
                amount: <span className="font-semibold text-text-primary">$2,502 (90%)</span>.
              </p>
            </Dialog>

            <Sheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              title="Booking AST-1042"
              description="Quick view"
              footer={<Button fullWidth onClick={() => setSheetOpen(false)}>Done</Button>}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name="Amina Kedir" size="lg" />
                  <div>
                    <p className="font-heading text-sm font-semibold text-text-primary">Amina Kedir</p>
                    <p className="text-xs text-text-secondary">amina@example.com</p>
                  </div>
                </div>
                <StatusBadge status="confirmed" />
                <SkeletonText lines={4} />
              </div>
            </Sheet>
          </DemoSection>

          <DemoSection title="Tabs, progress & pagination">
            <Tabs
              value={tab}
              onValueChange={setTab}
              items={[
                { value: "components", label: "Pills style", content: <p className="text-sm text-text-secondary">Pill tabs for portal and marketing surfaces.</p> },
                { value: "usage", label: "Usage", content: <p className="text-sm text-text-secondary">Import from <code className="text-primary">@/components/ui</code>.</p> },
                { value: "tokens", label: "Tokens", content: <p className="text-sm text-text-secondary">All colors come from CSS variables in globals.css.</p> },
              ]}
            />
            <Tabs
              appearance="underline"
              items={[
                { value: "a", label: "Underline style", content: <p className="text-sm text-text-secondary">Underline tabs for dense admin screens.</p> },
                { value: "b", label: "Details", content: <p className="text-sm text-text-secondary">Second panel.</p> },
              ]}
            />
            <div className="max-w-md space-y-4">
              <Progress value={68} label="Seats sold" showValue />
              <Progress value={92} tone="warning" label="Danakil departure almost full" showValue />
            </div>
            <Pagination page={page} pageCount={12} onPageChange={setPage} summary={`Showing ${(page - 1) * 10 + 1}–${page * 10} of 118`} />
          </DemoSection>

          <DemoSection title="Loading & empty states">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card static>
                <CardContent className="space-y-3">
                  <Skeleton className="h-32 w-full rounded-2xl" />
                  <SkeletonText lines={3} />
                </CardContent>
              </Card>
              <Card static>
                <CardContent className="flex h-full min-h-48 items-center justify-center">
                  <Spinner size="lg" label="Loading bookings…" />
                </CardContent>
              </Card>
              <EmptyState
                icon={Search}
                title="No tours match your filters"
                description="Try widening the date range or removing the budget filter."
                action={<Button variant="soft" size="sm">Clear filters</Button>}
              />
            </div>
          </DemoSection>

          <DemoSection title="Cards & misc">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader actions={<Badge variant="accent">Featured</Badge>}>
                  <CardTitle>Glass card</CardTitle>
                  <CardDescription>Default surface with hover lift.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-secondary">Used for tour cards, portal panels, and marketing content.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="soft">Action</Button>
                </CardFooter>
              </Card>
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Gradient border</CardTitle>
                  <CardDescription>For highlighted content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Amina Kedir" />
                    <Avatar name="Mohammed Al-Rashid" />
                    <Avatar name="Sara Tesfaye" src="/images/nonexistent.jpg" />
                  </div>
                </CardContent>
              </Card>
              <Card variant="solid" static>
                <CardHeader>
                  <CardTitle>Solid card</CardTitle>
                  <CardDescription>Opaque surface for dense admin panels.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Breadcrumbs items={[{ label: "Admin", href: "#" }, { label: "Tours", href: "#" }, { label: "Historic North Circuit" }]} />
                </CardContent>
              </Card>
            </div>
          </DemoSection>

          <footer className="border-t border-border/60 pb-4 pt-6">
            <p className="text-xs text-text-secondary">
              Live compositions:{" "}
              <a href="/admin" className="font-semibold text-primary hover:underline">/admin</a>
              {" · "}
              <a href="/account" className="font-semibold text-primary hover:underline">/account</a>
              {" · "}
              <a href="/auth/login" className="font-semibold text-primary hover:underline">/auth/login</a>
            </p>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
