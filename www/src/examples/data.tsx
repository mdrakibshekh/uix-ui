import * as React from "react";
import { Badge } from "../components/ui/badge";
import { Avatar } from "../components/ui/avatar";
import { AvatarGroup } from "../components/ui/avatar-group";
import { Card, CardHeader, CardTitle, CardDescription, CardActions, CardFooter } from "../components/ui/card";
import { Stat } from "../components/ui/stat";
import { ListItem } from "../components/ui/list-item";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { Accordion, AccordionItem } from "../components/ui/accordion";
import { Divider } from "../components/ui/divider";
import { Kbd } from "../components/ui/kbd";
import { Timeline, TimelineItem } from "../components/ui/timeline";
import { DescriptionList } from "../components/ui/description-list";
import { CodeBlock } from "../components/ui/code-block";
import { Quote } from "../components/ui/quote";
import { Chart } from "../components/ui/chart";
import { Button } from "../components/ui/button";
import { Inbox, Star, Zap } from "../components/ui/icons";

/* ---------- badge ---------- */
function BadgeDefault() {
  return <Badge color="success">In stock</Badge>;
}

function BadgeColors() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge color="neutral">Draft</Badge>
      <Badge color="brand">New</Badge>
      <Badge color="success">Delivered</Badge>
      <Badge color="warning">Packing</Badge>
      <Badge color="error">Cancelled</Badge>
    </div>
  );
}

function BadgeAppearances() {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {(["subtle", "solid", "outline"] as const).map(a => (
        <div key={a} className="flex flex-wrap items-center gap-2">
          <Badge appearance={a} color="brand">{a}</Badge>
          <Badge appearance={a} color="neutral">Draft</Badge>
          <Badge appearance={a} color="error">Unpaid</Badge>
        </div>
      ))}
    </div>
  );
}

function BadgeExtras() {
  const [tags, setTags] = React.useState(["Sylhet", "Organic"]);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge dot color="success">Online</Badge>
      <Badge size="sm" color="brand" leadingIcon={<Star />}>Bestseller</Badge>
      {tags.map(t => <Badge key={t} color="neutral" onClose={() => setTags(s => s.filter(x => x !== t))}>{t}</Badge>)}
    </div>
  );
}

/* ---------- avatar ---------- */
function AvatarDefault() {
  return <Avatar initials="NJ" />;
}

function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map(s => <Avatar key={s} size={s} initials="IJ" />)}
    </div>
  );
}

function AvatarVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar shape="rounded" initials="TA" />
      <Avatar type="icon" aria-label="Guest" />
      <Avatar initials="SR" status />
      <Avatar initials="FK" badge={<span className="text-label-small">3</span>} />
    </div>
  );
}

/* ---------- avatar group ---------- */
function AvatarGroupDefault() {
  return (
    <AvatarGroup max={3}>
      <Avatar initials="NJ" />
      <Avatar initials="IJ" />
      <Avatar initials="RS" />
      <Avatar initials="TA" />
      <Avatar initials="SR" />
    </AvatarGroup>
  );
}

/* ---------- card ---------- */
function CardDefault() {
  return (
    <Card style={{ width: 340, maxWidth: "100%" }}>
      <CardHeader>
        <div>
          <CardTitle>Sylhet green</CardTitle>
          <CardDescription>Grassy and light, 100g loose leaf.</CardDescription>
        </div>
        <Badge color="success">In stock</Badge>
      </CardHeader>
      <CardActions>
        <Button size="sm">Add for ৳420</Button>
        <Button size="sm" variant="ghost">Details</Button>
      </CardActions>
    </Card>
  );
}

function CardAppearances() {
  return (
    <div className="flex flex-wrap gap-4">
      {(["outlined", "elevated", "filled"] as const).map(a => (
        <Card key={a} appearance={a} style={{ width: 200, maxWidth: "100%" }}>
          <CardTitle>{a}</CardTitle>
          <CardDescription>Masala chai, 250g.</CardDescription>
        </Card>
      ))}
    </div>
  );
}

function CardWithFooter() {
  return (
    <Card appearance="elevated" style={{ width: 340, maxWidth: "100%" }}>
      <CardHeader>
        <CardTitle>Order #1042</CardTitle>
        <Badge color="warning">Packing</Badge>
      </CardHeader>
      <CardDescription>2 tins of Darjeeling and a clay cup for Israt Jahan, Mirpur.</CardDescription>
      <CardFooter>Placed today at 10:20 am</CardFooter>
    </Card>
  );
}

/* ---------- stat ---------- */
function StatDefault() {
  return (
    <div style={{ width: 240, maxWidth: "100%" }}>
      <Stat label="Revenue" value="৳4,82,300" delta="+12.4%" caption="vs last week" />
    </div>
  );
}

/* ---------- list item ---------- */
function ListItemDefault() {
  const [on, setOn] = React.useState(true);
  return (
    <div style={{ width: 380, display: "grid", gap: 4 }}>
      <ListItem type="one-line" leading={<Inbox />} title="Orders" />
      <ListItem type="two-line" leading={<Zap />} title="Express delivery" subtitle="Dhaka, within 3 hours" />
      <ListItem type="avatar" initials="NJ" title="Nusrat Jahan" subtitle="Ordered 3 times" />
      <ListItem type="toggle" title="Low-stock alerts" subtitle="Email when under 10" checked={on} onCheckedChange={setOn} />
    </div>
  );
}

/* ---------- table ---------- */
function TableDefault() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>#1042</TableCell><TableCell>Nusrat Jahan</TableCell><TableCell><Badge color="warning">Packing</Badge></TableCell></TableRow>
        <TableRow><TableCell>#1041</TableCell><TableCell>Tanvir Ahmed</TableCell><TableCell><Badge color="success">Delivered</Badge></TableCell></TableRow>
        <TableRow><TableCell>#1040</TableCell><TableCell>Sadia Rahman</TableCell><TableCell><Badge color="error">Cancelled</Badge></TableCell></TableRow>
      </TableBody>
    </Table>
  );
}

function TableSelectable() {
  const [sel, setSel] = React.useState("1041");
  const rows = [["1042", "Nusrat Jahan", "৳1,260"], ["1041", "Tanvir Ahmed", "৳840"], ["1040", "Sadia Rahman", "৳2,100"]];
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([id, who, total]) => (
          <TableRow key={id} aria-selected={sel === id} onClick={() => setSel(id)} style={{ cursor: "pointer" }}>
            <TableCell>#{id}</TableCell><TableCell>{who}</TableCell><TableCell>{total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ---------- accordion ---------- */
function AccordionDefault() {
  return (
    <Accordion style={{ width: 400, maxWidth: "100%" }}>
      <AccordionItem title="How long does delivery take?" open>Inside Dhaka, one to two days. Other districts, three to five.</AccordionItem>
      <AccordionItem title="Can I return opened tea?">Yes, within seven days if you did not like it.</AccordionItem>
      <AccordionItem title="Do you ship abroad?">Not yet. We are working on it.</AccordionItem>
    </Accordion>
  );
}

function AccordionAppearances() {
  return (
    <div style={{ width: 400, display: "grid", gap: 16 }}>
      <Accordion><AccordionItem appearance="bordered" title="Bordered">Each item gets its own outline.</AccordionItem></Accordion>
      <Accordion><AccordionItem appearance="filled" title="Filled">A soft background behind the item.</AccordionItem></Accordion>
    </div>
  );
}

/* ---------- divider ---------- */
function DividerDefault() {
  return (
    <div style={{ width: 320, display: "grid", gap: 20 }}>
      <Divider />
      <Divider type="dashed" />
      <Divider type="with-label" label="or" />
      <Divider type="with-icon" icon={<Star />} />
    </div>
  );
}

/* ---------- kbd ---------- */
function KbdDefault() {
  return (
    <span className="text-body-medium text-fg-secondary">
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search the menu.
    </span>
  );
}

/* ---------- timeline ---------- */
function TimelineDefault() {
  return (
    <Timeline style={{ width: 320, maxWidth: "100%" }}>
      <TimelineItem status="done" title="Order placed" description="Nusrat Jahan, Mirpur" time="Mon 10:20 am" />
      <TimelineItem status="current" title="Packing" description="Wrapped in the gift box" time="Mon 2:00 pm" />
      <TimelineItem status="upcoming" title="Out for delivery" last />
    </Timeline>
  );
}

/* ---------- description list ---------- */
function DescriptionListDefault() {
  return (
    <DescriptionList
      style={{ width: 460, maxWidth: "100%" }}
      items={[
        { term: "Customer", detail: "Nusrat Jahan" },
        { term: "Address", detail: "House 14, Road 5, Dhanmondi, Dhaka" },
        { term: "Payment", detail: "bKash, paid" },
        { term: "Total", detail: "৳1,260" },
      ]}
    />
  );
}

/* ---------- code block ---------- */
function CodeBlockDefault() {
  return (
    <div style={{ width: 460, maxWidth: "100%" }}>
      <CodeBlock filename="add-tea.sh" code={"npx uix-ui@latest init\nnpx uix-ui@latest add button card"} />
    </div>
  );
}

/* ---------- quote ---------- */
function QuoteDefault() {
  return (
    <div style={{ width: 420, maxWidth: "100%" }}>
      <Quote author="Sadia Rahman" role="Regular customer, Gulshan" avatar={<Avatar initials="SR" />}>
        The Sylhet green is the first tea my mother asks about when I visit.
      </Quote>
    </div>
  );
}

/* ---------- chart ---------- */
function ChartDefault() {
  const data = [
    { label: "Sat", value: 32 }, { label: "Sun", value: 41 }, { label: "Mon", value: 28 }, { label: "Tue", value: 52 },
    { label: "Wed", value: 47 }, { label: "Thu", value: 61 }, { label: "Fri", value: 38 },
  ];
  return (
    <div style={{ width: 440, maxWidth: "100%" }}>
      <Chart type="bar" data={data} title="Orders this week" value="299" delta="+18%" highlight={5} />
    </div>
  );
}

export const dataDisplay = {
  badge: [
    { title: "Default", Demo: BadgeDefault },
    { title: "Colours", Demo: BadgeColors },
    { title: "Appearances", Demo: BadgeAppearances },
    { title: "Dot, icon and removable", Demo: BadgeExtras },
  ],
  avatar: [
    { title: "Default", Demo: AvatarDefault },
    { title: "Sizes", Demo: AvatarSizes },
    { title: "Shape, icon, status and badge", Demo: AvatarVariants },
  ],
  "avatar-group": [{ title: "Default", Demo: AvatarGroupDefault }],
  card: [
    { title: "Default", Demo: CardDefault },
    { title: "Appearances", Demo: CardAppearances },
    { title: "With a footer", Demo: CardWithFooter },
  ],
  stat: [{ title: "Default", Demo: StatDefault }],
  "list-item": [{ title: "Default", Demo: ListItemDefault }],
  table: [{ title: "Default", Demo: TableDefault }, { title: "Selectable rows", Demo: TableSelectable }],
  accordion: [{ title: "Default", Demo: AccordionDefault }, { title: "Bordered and filled", Demo: AccordionAppearances }],
  divider: [{ title: "Default", Demo: DividerDefault }],
  kbd: [{ title: "Default", Demo: KbdDefault }],
  timeline: [{ title: "Default", Demo: TimelineDefault }],
  "description-list": [{ title: "Default", Demo: DescriptionListDefault }],
  "code-block": [{ title: "Default", Demo: CodeBlockDefault }],
  quote: [{ title: "Default", Demo: QuoteDefault }],
  chart: [{ title: "Default", Demo: ChartDefault }],
};
