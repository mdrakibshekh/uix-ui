import * as React from "react";
import { Alert } from "../components/ui/alert";
import { Banner } from "../components/ui/banner";
import { Toast } from "../components/ui/toast";
import { Tooltip } from "../components/ui/tooltip";
import { Progress } from "../components/ui/progress";
import { ProgressCircle } from "../components/ui/progress-circle";
import { Spinner } from "../components/ui/spinner";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { Notification } from "../components/ui/notification";
import { CookieBanner } from "../components/ui/cookie-banner";
import { Button } from "../components/ui/button";
import { IconButton } from "../components/ui/icon-button";
import { Avatar } from "../components/ui/avatar";
import { Info, Inbox } from "../components/ui/icons";

/* ---------- alert ---------- */
function AlertDefault() {
  return (
    <div style={{ width: 440 }}>
      <Alert type="info" title="Your parcel is on its way">Nusrat, the courier will call before arriving.</Alert>
    </div>
  );
}

function AlertTypes() {
  return (
    <div style={{ width: 440, display: "grid", gap: 12 }}>
      <Alert type="info" title="Heads up">Orders after 4 pm ship tomorrow.</Alert>
      <Alert type="success" title="Order placed">We have sent the receipt to your phone.</Alert>
      <Alert type="warning" title="Low stock">Only 3 tins of Darjeeling are left.</Alert>
      <Alert type="error" title="Payment failed">Your bKash payment did not go through.</Alert>
    </div>
  );
}

function AlertAppearances() {
  return (
    <div style={{ width: 440, display: "grid", gap: 12 }}>
      <Alert appearance="subtle" type="info" title="Subtle">Soft background, the default.</Alert>
      <Alert appearance="accent" type="info" title="Accent">A coloured edge on the side.</Alert>
      <Alert appearance="solid" type="info" title="Solid">Full colour for the most important notes.</Alert>
      <Alert appearance="outline" type="info" title="Outline">Only a border, no fill.</Alert>
    </div>
  );
}

function AlertActions() {
  const [open, setOpen] = React.useState(true);
  if (!open) return <Button variant="outline" onClick={() => setOpen(true)}>Show the alert again</Button>;
  return (
    <div style={{ width: 440 }}>
      <Alert type="warning" title="Your cart expires soon" onClose={() => setOpen(false)} actions={<Button size="sm" variant="outline">Check out</Button>}>
        Items are held for 15 minutes.
      </Alert>
    </div>
  );
}

/* ---------- banner ---------- */
function BannerDefault() {
  return (
    <div style={{ width: "100%" }}>
      <Banner type="brand" action={<Button size="sm" variant="outline">See the list</Button>}>Eid sale: 15% off every gift box until Friday.</Banner>
    </div>
  );
}

/* ---------- toast ---------- */
function ToastDefault() {
  return <Toast action={<Button size="sm" variant="ghost">Undo</Button>}>Darjeeling tin added to your cart.</Toast>;
}

function ToastTypes() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Toast>Saved to your wishlist.</Toast>
      <Toast type="success">Order placed. Thank you, Nusrat!</Toast>
      <Toast type="warning">Only 2 tins left in stock.</Toast>
      <Toast type="error">We could not reach bKash. Try again.</Toast>
      <Toast theme="dark" type="success">Dark toast: parcel delivered.</Toast>
    </div>
  );
}

function ToastDismiss() {
  const [items, setItems] = React.useState(["Sylhet green added.", "Masala chai added."]);
  return (
    <div style={{ display: "grid", gap: 12, width: 360 }}>
      {items.map(t => <Toast key={t} type="success" action={<Button size="sm" variant="ghost" onClick={() => setItems(s => s.filter(x => x !== t))}>Dismiss</Button>}>{t}</Toast>)}
      {items.length === 0 ? <Button variant="outline" onClick={() => setItems(["Sylhet green added.", "Masala chai added."])}>Bring them back</Button> : null}
    </div>
  );
}

/* ---------- tooltip ---------- */
function TooltipDefault() {
  return (
    <Tooltip content="Shows in the next 3 days">
      <Button variant="outline">Delivery</Button>
    </Tooltip>
  );
}

function TooltipPlacements() {
  return (
    <div className="flex flex-wrap items-center gap-6" style={{ padding: "36px 56px" }}>
      <Tooltip placement="top" content="Top"><Button variant="outline" size="sm">Top</Button></Tooltip>
      <Tooltip placement="bottom" content="Bottom"><Button variant="outline" size="sm">Bottom</Button></Tooltip>
      <Tooltip placement="left" content="Left"><Button variant="outline" size="sm">Left</Button></Tooltip>
      <Tooltip placement="right" content="Right"><Button variant="outline" size="sm">Right</Button></Tooltip>
    </div>
  );
}

function TooltipLight() {
  return (
    <Tooltip theme="light" content="Copy the order number">
      <IconButton aria-label="Copy order number" variant="outline"><Info /></IconButton>
    </Tooltip>
  );
}

/* ---------- progress ---------- */
function ProgressDefault() {
  return (
    <div style={{ width: 320 }}>
      <Progress value={64} aria-label="Order progress" />
    </div>
  );
}

function ProgressLive() {
  const [v, setV] = React.useState(20);
  return (
    <div style={{ width: 320, display: "grid", gap: 12 }}>
      <Progress value={v} aria-label="Packing your order" />
      <div className="flex items-center justify-between">
        <span className="text-body-small text-fg-secondary">{v}% packed</span>
        <Button size="sm" variant="outline" onClick={() => setV(x => (x >= 100 ? 0 : x + 20))}>{v >= 100 ? "Start over" : "Pack more"}</Button>
      </div>
    </div>
  );
}

function ProgressSteps() {
  return (
    <div style={{ width: 320, display: "grid", gap: 16 }}>
      <Progress value={0} aria-label="Not started" />
      <Progress value={35} aria-label="A third done" />
      <Progress value={100} aria-label="Complete" />
    </div>
  );
}

/* ---------- progress circle ---------- */
function ProgressCircleDefault() {
  return <ProgressCircle value={72} aria-label="Daily goal" />;
}

/* ---------- spinner ---------- */
function SpinnerDefault() {
  return (
    <div className="flex items-center gap-5">
      <Spinner size="sm" label="Loading" />
      <Spinner size="md" label="Loading" />
      <Spinner size="lg" label="Loading" />
    </div>
  );
}

/* ---------- skeleton ---------- */
function SkeletonDefault() {
  return (
    <div style={{ width: 320, display: "flex", gap: 12, alignItems: "center" }}>
      <Skeleton type="avatar" />
      <div style={{ flex: 1, display: "grid", gap: 8 }}>
        <Skeleton type="text" />
        <Skeleton type="text" style={{ width: "60%" }} />
      </div>
    </div>
  );
}

/* ---------- empty state ---------- */
function EmptyStateDefault() {
  return (
    <EmptyState
      icon={<Inbox />}
      title="Your cart is empty"
      description="Pick a tea you like and it will wait for you here."
      actions={<Button>Browse teas</Button>}
    />
  );
}

/* ---------- notification ---------- */
function NotificationDefault() {
  return (
    <div style={{ width: 440, display: "grid", gap: 4 }}>
      <Notification avatar={<Avatar size="sm" initials="NJ" />} name="Nusrat Jahan" action="reviewed" target="Sylhet green" time="2 min ago" />
      <Notification status="read" avatar={<Avatar size="sm" initials="IJ" />} name="Israt Jahan" action="shipped" target="Order #1042" time="Yesterday" />
    </div>
  );
}

/* ---------- cookie banner ---------- */
function CookieBannerDefault() {
  const [done, setDone] = React.useState("");
  if (done) return <span className="text-body-medium text-fg-secondary">You chose: {done}. <Button variant="link" onClick={() => setDone("")}>Ask again</Button></span>;
  return (
    <div style={{ width: "100%" }}>
      <CookieBanner layout="bar" onAccept={() => setDone("accept all")} onReject={() => setDone("reject all")} onSettings={() => setDone("custom settings")}>
        We use a few cookies to remember your cart. Nothing is shared with advertisers.
      </CookieBanner>
    </div>
  );
}

export const feedback = {
  alert: [
    { title: "Default", Demo: AlertDefault },
    { title: "Types", Demo: AlertTypes },
    { title: "Appearances", Demo: AlertAppearances },
    { title: "With an action and a close button", Demo: AlertActions },
  ],
  banner: [{ title: "Default", Demo: BannerDefault }],
  toast: [
    { title: "Default", Demo: ToastDefault },
    { title: "Types and themes", Demo: ToastTypes },
    { title: "Dismissing", Demo: ToastDismiss },
  ],
  tooltip: [
    { title: "Default", Demo: TooltipDefault },
    { title: "Placements", Demo: TooltipPlacements },
    { title: "Light theme on an icon button", Demo: TooltipLight },
  ],
  progress: [
    { title: "Default", Demo: ProgressDefault },
    { title: "Live", Demo: ProgressLive },
    { title: "Empty to full", Demo: ProgressSteps },
  ],
  "progress-circle": [{ title: "Default", Demo: ProgressCircleDefault }],
  spinner: [{ title: "Default", Demo: SpinnerDefault }],
  skeleton: [{ title: "Default", Demo: SkeletonDefault }],
  "empty-state": [{ title: "Default", Demo: EmptyStateDefault }],
  notification: [{ title: "Default", Demo: NotificationDefault }],
  "cookie-banner": [{ title: "Default", Demo: CookieBannerDefault }],
};
