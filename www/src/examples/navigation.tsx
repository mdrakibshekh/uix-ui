import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Breadcrumb } from "../components/ui/breadcrumb";
import { Pagination } from "../components/ui/pagination";
import { Navbar } from "../components/ui/navbar";
import { Sidebar, SidebarItem } from "../components/ui/sidebar-item";
import { Stepper, Step } from "../components/ui/stepper";
import { Menu, MenuItem, MenuSeparator } from "../components/ui/menu";
import { BottomNav, BottomNavItem } from "../components/ui/bottom-nav";
import { Tree, TreeItem } from "../components/ui/tree-view";
import { Footer } from "../components/ui/footer";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/ui/avatar";
import { Copy, House, Inbox, Search, Star, User } from "../components/ui/icons";

/* ---------- tabs ---------- */
function TabsDefault() {
  const [tab, setTab] = React.useState("details");
  return (
    <Tabs value={tab} onValueChange={setTab} style={{ width: 360 }}>
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="brewing">Brewing</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="details">First flush Darjeeling, picked in March and packed in Dhaka.</TabsContent>
      <TabsContent value="brewing">Use water just off the boil and steep for three minutes.</TabsContent>
      <TabsContent value="reviews">128 reviews, 4.8 on average.</TabsContent>
    </Tabs>
  );
}

function TabsAppearances() {
  const [a, setA] = React.useState("all");
  const [b, setB] = React.useState("all");
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Tabs appearance="pill" value={a} onValueChange={setA}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="green">Green</TabsTrigger>
          <TabsTrigger value="black">Black</TabsTrigger>
        </TabsList>
        <TabsContent value="all">All 14 teas</TabsContent>
        <TabsContent value="green">5 green teas</TabsContent>
        <TabsContent value="black">6 black teas</TabsContent>
      </Tabs>
      <Tabs appearance="boxed" value={b} onValueChange={setB}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="green">Green</TabsTrigger>
          <TabsTrigger value="black">Black</TabsTrigger>
        </TabsList>
        <TabsContent value="all">All 14 teas</TabsContent>
        <TabsContent value="green">5 green teas</TabsContent>
        <TabsContent value="black">6 black teas</TabsContent>
      </Tabs>
    </div>
  );
}

function TabsIconsAndCounts() {
  const [tab, setTab] = React.useState("orders");
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="orders" leadingIcon={<Inbox />} count={12}>Orders</TabsTrigger>
        <TabsTrigger value="saved" leadingIcon={<Star />} count={3}>Saved</TabsTrigger>
        <TabsTrigger value="account" leadingIcon={<User />}>Account</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">12 orders this month.</TabsContent>
      <TabsContent value="saved">3 saved teas.</TabsContent>
      <TabsContent value="account">Nusrat Jahan, Mirpur.</TabsContent>
    </Tabs>
  );
}

/* ---------- breadcrumb ---------- */
function BreadcrumbDefault() {
  return <Breadcrumb items={[{ label: "Shop", href: "#shop" }, { label: "Tea", href: "#tea" }, { label: "Sylhet green" }]} />;
}

/* ---------- pagination ---------- */
function PaginationDefault() {
  const [page, setPage] = React.useState(3);
  return <Pagination page={page} pageCount={9} onPageChange={setPage} />;
}

/* ---------- navbar ---------- */
function NavbarDefault() {
  return (
    <div style={{ width: "100%" }}>
      <Navbar
        brand={<b className="text-label-large">Shapla Tea</b>}
        links={[{ label: "Shop", href: "#shop", current: true }, { label: "Gifts", href: "#gifts" }, { label: "Stories", href: "#stories" }]}
        actions={<><Button size="sm" variant="ghost">Sign in</Button><Button size="sm">Cart (2)</Button></>}
      />
    </div>
  );
}

function NavbarDark() {
  return (
    <div style={{ width: "100%" }}>
      <Navbar
        theme="dark"
        brand={<b className="text-label-large">Shapla Tea</b>}
        links={[{ label: "Shop", href: "#shop", current: true }, { label: "Gifts", href: "#gifts" }]}
        actions={<Avatar size="sm" initials="NJ" />}
      />
    </div>
  );
}

/* ---------- sidebar ---------- */
function SidebarItemDefault() {
  const [here, setHere] = React.useState("orders");
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setHere(id); };
  return (
    <Sidebar style={{ width: 240 }}>
      <SidebarItem href="#home" icon={<House />} active={here === "home"} onClick={go("home")}>Home</SidebarItem>
      <SidebarItem href="#orders" icon={<Inbox />} badge={12} active={here === "orders"} onClick={go("orders")}>Orders</SidebarItem>
      <SidebarItem href="#customers" icon={<User />} trailingChevron active={here === "customers"} onClick={go("customers")}>Customers</SidebarItem>
      <SidebarItem href="#reports" icon={<Star />} disabled>Reports</SidebarItem>
    </Sidebar>
  );
}

/* ---------- stepper ---------- */
function StepperDefault() {
  return (
    <Stepper>
      <Step status="complete" title="Cart" description="3 items" />
      <Step status="current" index={2} title="Address" description="Where to?" />
      <Step status="upcoming" index={3} title="Payment" description="bKash or card" />
    </Stepper>
  );
}

function StepperInteractive() {
  const [step, setStep] = React.useState(2);
  const steps = ["Cart", "Address", "Payment", "Done"];
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Stepper>
        {steps.map((s, i) => <Step key={s} index={i + 1} title={s} status={i + 1 < step ? "complete" : i + 1 === step ? "current" : "upcoming"} />)}
      </Stepper>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button>
        <Button size="sm" disabled={step === 5} onClick={() => setStep(step + 1)}>Next</Button>
      </div>
    </div>
  );
}

/* ---------- menu ---------- */
function MenuDefault() {
  const [grid, setGrid] = React.useState(true);
  return (
    <Menu style={{ width: 240 }} aria-label="Order actions">
      <MenuItem icon={<Copy />} shortcut="⌘C">Copy order number</MenuItem>
      <MenuItem icon={<Search />}>Find similar</MenuItem>
      <MenuItem checked={grid} onClick={() => setGrid(!grid)}>Show as grid</MenuItem>
      <MenuSeparator />
      <MenuItem type="destructive">Cancel order</MenuItem>
    </Menu>
  );
}

/* ---------- bottom nav ---------- */
function BottomNavDefault() {
  const [tab, setTab] = React.useState("shop");
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setTab(id); };
  return (
    <div style={{ width: 360 }}>
      <BottomNav>
        <BottomNavItem href="#shop" icon={<House />} active={tab === "shop"} onClick={go("shop")}>Shop</BottomNavItem>
        <BottomNavItem href="#search" icon={<Search />} active={tab === "search"} onClick={go("search")}>Search</BottomNavItem>
        <BottomNavItem href="#saved" icon={<Star />} active={tab === "saved"} onClick={go("saved")}>Saved</BottomNavItem>
        <BottomNavItem href="#me" icon={<User />} active={tab === "me"} onClick={go("me")}>Me</BottomNavItem>
      </BottomNav>
    </div>
  );
}

/* ---------- tree view ---------- */
function TreeViewDefault() {
  const [open, setOpen] = React.useState(true);
  const [sel, setSel] = React.useState("green.md");
  return (
    <Tree style={{ width: 280 }} aria-label="Product files">
      <TreeItem expanded={open} onClick={() => setOpen(!open)}>teas</TreeItem>
      {open ? (
        <>
          <TreeItem level="2" selected={sel === "green.md"} onClick={() => setSel("green.md")}>sylhet-green.md</TreeItem>
          <TreeItem level="2" selected={sel === "chai.md"} onClick={() => setSel("chai.md")}>masala-chai.md</TreeItem>
        </>
      ) : null}
      <TreeItem selected={sel === "readme"} onClick={() => setSel("readme")}>README.md</TreeItem>
    </Tree>
  );
}

/* ---------- footer ---------- */
function FooterDefault() {
  return (
    <div style={{ width: "100%" }}>
      <Footer
        type="simple"
        brand={<b className="text-label-large">Shapla Tea</b>}
        links={[{ label: "Shipping", href: "#shipping" }, { label: "Returns", href: "#returns" }, { label: "Contact", href: "#contact" }]}
        copyright="© 2026 Shapla Tea, Dhanmondi, Dhaka"
      />
    </div>
  );
}

function FooterColumns() {
  return (
    <div style={{ width: "100%" }}>
      <Footer
        type="columns"
        brand={<b className="text-label-large">Shapla Tea</b>}
        tagline="Small-batch tea from Sylhet and Darjeeling."
        columns={[
          { title: "Shop", links: [{ label: "Green tea", href: "#green" }, { label: "Black tea", href: "#black" }, { label: "Gift boxes", href: "#gifts" }] },
          { title: "Help", links: [{ label: "Delivery", href: "#delivery" }, { label: "Returns", href: "#returns" }, { label: "Contact", href: "#contact" }] },
        ]}
        copyright="© 2026 Shapla Tea"
      />
    </div>
  );
}

export const navigation = {
  tabs: [
    { title: "Default", Demo: TabsDefault },
    { title: "Pill and boxed", Demo: TabsAppearances },
    { title: "Icons and counts", Demo: TabsIconsAndCounts },
  ],
  breadcrumb: [{ title: "Default", Demo: BreadcrumbDefault }],
  pagination: [{ title: "Default", Demo: PaginationDefault }],
  navbar: [{ title: "Default", Demo: NavbarDefault }, { title: "Dark theme", Demo: NavbarDark }],
  "sidebar-item": [{ title: "Default", Demo: SidebarItemDefault }],
  stepper: [{ title: "Default", Demo: StepperDefault }, { title: "Moving through steps", Demo: StepperInteractive }],
  menu: [{ title: "Default", Demo: MenuDefault }],
  "bottom-nav": [{ title: "Default", Demo: BottomNavDefault }],
  "tree-view": [{ title: "Default", Demo: TreeViewDefault }],
  footer: [{ title: "Simple", Demo: FooterDefault }, { title: "Columns", Demo: FooterColumns }],
};
