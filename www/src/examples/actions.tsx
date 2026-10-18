import * as React from "react";
import { Button } from "../components/ui/button";
import { IconButton } from "../components/ui/icon-button";
import { ButtonGroup, ButtonGroupItem } from "../components/ui/button-group";
import { Link } from "../components/ui/link";
import { Avatar } from "../components/ui/avatar";
import { ArrowRight, Plus, Search, Star, User, Zap } from "../components/ui/icons";

function ButtonDefault() {
  return <Button>Order Darjeeling tea</Button>;
}

function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Order now</Button>
      <Button variant="secondary">Save for later</Button>
      <Button variant="soft">Gift wrap</Button>
      <Button variant="outline">View menu</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="destructive">Cancel order</Button>
      <Button variant="link">Track parcel</Button>
    </div>
  );
}

function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

function ButtonIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon={<Plus />}>Add to cart</Button>
      <Button variant="outline" trailingIcon={<ArrowRight />}>Checkout</Button>
      <Button variant="soft" badge={3}>Cart</Button>
      <Button variant="outline" avatar={<Avatar size="xs" initials="NJ" />}>Nusrat Jahan</Button>
    </div>
  );
}

function ButtonStates() {
  const [busy, setBusy] = React.useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1800); }}>{busy ? "Placing order" : "Place order"}</Button>
      <Button disabled>Out of stock</Button>
      <Button variant="outline" disabled>Sold out</Button>
    </div>
  );
}

function IconButtonDefault() {
  return <IconButton aria-label="Search the menu" variant="outline"><Search /></IconButton>;
}

function IconButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton aria-label="Add" variant="primary"><Plus /></IconButton>
      <IconButton aria-label="Favourite" variant="soft"><Star /></IconButton>
      <IconButton aria-label="Account" variant="ghost"><User /></IconButton>
      <IconButton aria-label="Notifications, new" variant="outline" badgeDot><Zap /></IconButton>
    </div>
  );
}

function ButtonGroupDefault() {
  const [size, setSize] = React.useState("250g");
  return (
    <ButtonGroup aria-label="Tin size">
      {["100g", "250g", "500g"].map(s => <ButtonGroupItem key={s} pressed={size === s} onClick={() => setSize(s)}>{s}</ButtonGroupItem>)}
    </ButtonGroup>
  );
}

function LinkDefault() {
  return <Link href="#shipping">Delivery times and charges</Link>;
}

function LinkColors() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Link href="#menu" color="brand">Brand link</Link>
      <Link href="#menu" color="neutral">Neutral link</Link>
      <Link href="#menu" color="danger">Danger link</Link>
      <Link href="#menu" showIcon>With arrow</Link>
    </div>
  );
}

export const actions = {
  button: [
    { title: "Default", Demo: ButtonDefault },
    { title: "Variants", Demo: ButtonVariants },
    { title: "Sizes", Demo: ButtonSizes },
    { title: "With icons, avatar and count", Demo: ButtonIcons },
    { title: "Loading and disabled", Demo: ButtonStates },
  ],
  "icon-button": [{ title: "Default", Demo: IconButtonDefault }, { title: "Variants", Demo: IconButtonVariants }],
  "button-group": [{ title: "Default", Demo: ButtonGroupDefault }],
  link: [{ title: "Default", Demo: LinkDefault }, { title: "Colours and arrow", Demo: LinkColors }],
};
