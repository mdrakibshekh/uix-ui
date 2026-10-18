import * as React from "react";
import { Modal } from "../components/ui/modal";
import { Popover } from "../components/ui/popover";
import { Drawer } from "../components/ui/drawer";
import { Sheet } from "../components/ui/sheet";
import { CommandPalette } from "../components/ui/command-palette";
import { Button } from "../components/ui/button";
import { Kbd } from "../components/ui/kbd";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Copy, Inbox, Search, Star, TriangleAlert, Zap } from "../components/ui/icons";

/* ---------- modal ---------- */
function ModalDefault() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Place order</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Place this order?"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Not yet</Button><Button onClick={() => setOpen(false)}>Place order</Button></>}
      >
        2 tins of Darjeeling and a clay cup, ৳1,260 in total. We will send it to House 14, Dhanmondi.
      </Modal>
    </>
  );
}

function ModalDanger() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Cancel order</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        headerIcon={<TriangleAlert />}
        title="Cancel order #1042?"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Keep it</Button><Button variant="destructive" onClick={() => setOpen(false)}>Cancel order</Button></>}
      >
        The tea has already been packed. You will get your money back to bKash in 2 days.
      </Modal>
    </>
  );
}

function ModalForm() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Add a gift note</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Gift note"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save note</Button></>}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <Input label="To" placeholder="Israt Jahan" />
          <Input label="Message" placeholder="Happy birthday!" />
          <Checkbox label="Hide the price on the receipt" defaultChecked />
        </div>
      </Modal>
    </>
  );
}

/* ---------- popover ---------- */
function PopoverDefault() {
  return (
    <Popover
      trigger={<Button variant="outline">Delivery details</Button>}
      title="Delivery to Dhanmondi"
      actions={<Button size="sm">Change address</Button>}
    >
      Arrives Thursday between 10 am and 1 pm.
    </Popover>
  );
}

/* ---------- drawer ---------- */
function DrawerDefault() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open filters</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Reset</Button><Button onClick={() => setOpen(false)}>Show 14 teas</Button></>}>
        <div style={{ display: "grid", gap: 12 }}>
          <Checkbox label="Green tea" defaultChecked />
          <Checkbox label="Black tea" />
          <Checkbox label="Under ৳500" />
        </div>
      </Drawer>
    </>
  );
}

/* ---------- sheet ---------- */
function SheetDefault() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>More actions</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Order #1042"
        actions={[
          { label: "Copy order number", icon: <Copy /> },
          { label: "Save for later", icon: <Star /> },
          { label: "Cancel order", icon: <Zap />, destructive: true },
        ]}
      />
    </>
  );
}

/* ---------- command palette ---------- */
function CommandPaletteDefault() {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState("");
  return (
    <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
      <Button variant="soft" onClick={() => setOpen(true)}>Search <Kbd size="sm">⌘K</Kbd></Button>
      {last ? <span className="text-body-small text-fg-secondary">You picked: {last}</span> : null}
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={[
          { heading: "Go to", items: [{ id: "orders", label: "Orders", icon: <Inbox />, onSelect: () => setLast("Orders") }, { id: "search", label: "Find a tea", icon: <Search />, shortcut: ["⌘", "F"], onSelect: () => setLast("Find a tea") }] },
          { heading: "Actions", items: [{ id: "new", label: "New order", icon: <Zap />, shortcut: ["⌘", "N"], onSelect: () => setLast("New order") }] },
        ]}
      />
    </div>
  );
}

export const overlays = {
  modal: [
    { title: "Default", Demo: ModalDefault },
    { title: "Warning with an icon", Demo: ModalDanger },
    { title: "Large, with a form", Demo: ModalForm },
  ],
  popover: [{ title: "Default", Demo: PopoverDefault }],
  drawer: [{ title: "Default", Demo: DrawerDefault }],
  sheet: [{ title: "Default", Demo: SheetDefault }],
  "command-palette": [{ title: "Default", Demo: CommandPaletteDefault }],
};
