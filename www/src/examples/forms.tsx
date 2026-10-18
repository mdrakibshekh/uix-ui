import * as React from "react";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { SearchField } from "../components/ui/search-field";
import { NumberInput } from "../components/ui/number-input";
import { OtpInput } from "../components/ui/otp-input";
import { Combobox } from "../components/ui/combobox";
import { Checkbox } from "../components/ui/checkbox";
import { Radio } from "../components/ui/radio";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Segmented } from "../components/ui/segmented";
import { Chip } from "../components/ui/chip";
import { TagInput } from "../components/ui/tag-input";
import { Toggle, ToggleGroup } from "../components/ui/toggle";
import { SelectionCard } from "../components/ui/selection-card";
import { DatePicker } from "../components/ui/date-picker";
import { FileUpload } from "../components/ui/file-upload";
import { Rating } from "../components/ui/rating";
import { Inbox, Star, Zap } from "../components/ui/icons";

/* ---------- input ---------- */
function InputDefault() {
  return (
    <div style={{ width: 320 }}>
      <Input label="Your name" placeholder="Nusrat Jahan" helper="We print this on the parcel." />
    </div>
  );
}

function InputAppearances() {
  return (
    <div style={{ width: 320, display: "grid", gap: 16 }}>
      <Input appearance="outline" label="Outline" placeholder="Phone number" />
      <Input appearance="filled" label="Filled" placeholder="Phone number" />
      <Input appearance="underline" label="Underline" placeholder="Phone number" />
    </div>
  );
}

function InputSizes() {
  return (
    <div style={{ width: 320, display: "grid", gap: 12 }}>
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="md" placeholder="Medium" aria-label="Medium" />
      <Input size="lg" placeholder="Large" aria-label="Large" />
    </div>
  );
}

function InputExtras() {
  return (
    <div style={{ width: 320, display: "grid", gap: 16 }}>
      <Input label="Email" secondaryLabel="Optional" leadingIcon={<Inbox />} placeholder="israt@shapla.example" />
      <Input label="Price per tin" prefix="৳" suffix="BDT" defaultValue="480" />
      <Input label="Postcode" defaultValue="12" error="Enter a 4 digit postcode." />
      <Input label="Coupon" disabled defaultValue="SHAPLA10" />
    </div>
  );
}

/* ---------- select ---------- */
function SelectDefault() {
  return (
    <div style={{ width: 320 }}>
      <Select label="Tea" defaultValue="darjeeling">
        <option value="darjeeling">Darjeeling tin</option>
        <option value="green">Sylhet green</option>
        <option value="chai">Masala chai</option>
      </Select>
    </div>
  );
}

function SelectPlaceholder() {
  return (
    <div style={{ width: 320 }}>
      <Select label="Delivery area" placeholder="Choose an area" defaultValue="">
        <option value="dhanmondi">Dhanmondi</option>
        <option value="gulshan">Gulshan</option>
        <option value="mirpur">Mirpur</option>
      </Select>
    </div>
  );
}

function SelectStates() {
  return (
    <div style={{ width: 320, display: "grid", gap: 16 }}>
      <Select appearance="filled" label="Filled" defaultValue="1"><option value="1">Same day</option><option value="2">Next day</option></Select>
      <Select label="Courier" error="Pick a courier to continue." defaultValue="" placeholder="Choose a courier"><option value="pathao">Pathao</option><option value="redx">RedX</option></Select>
      <Select label="Disabled" disabled defaultValue="1"><option value="1">Pickup only</option></Select>
    </div>
  );
}

/* ---------- textarea ---------- */
function TextareaDefault() {
  return (
    <div style={{ width: 360 }}>
      <Textarea label="Gift note" placeholder="Write a few words for the card." rows={3} />
    </div>
  );
}

function TextareaStates() {
  return (
    <div style={{ width: 360, display: "grid", gap: 16 }}>
      <Textarea appearance="filled" label="Delivery note" defaultValue="Please ring the bell twice." rows={2} />
      <Textarea label="Review" error="Tell us a little more (20 characters at least)." defaultValue="Nice." rows={2} />
    </div>
  );
}

/* ---------- search field ---------- */
function SearchFieldDefault() {
  const [q, setQ] = React.useState("");
  return (
    <div style={{ width: 320 }}>
      <SearchField placeholder="Search teas" aria-label="Search teas" value={q} onChange={e => setQ(e.target.value)} onClear={() => setQ("")} />
    </div>
  );
}

/* ---------- number input ---------- */
function NumberInputDefault() {
  return (
    <div style={{ width: 200 }}>
      <NumberInput label="Tins" defaultValue={2} min={1} max={12} />
    </div>
  );
}

/* ---------- otp ---------- */
function OtpInputDefault() {
  const [done, setDone] = React.useState("");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <OtpInput length="6" aria-label="Verification code" onComplete={setDone} />
      <span className="text-body-small text-fg-secondary">{done ? `Code entered: ${done}` : "We sent a 6 digit code to 01712 345678."}</span>
    </div>
  );
}

/* ---------- combobox ---------- */
function ComboboxDefault() {
  const [value, setValue] = React.useState("");
  return (
    <div style={{ width: 320 }}>
      <Combobox
        label="District"
        placeholder="Start typing"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "dhaka", label: "Dhaka" },
          { value: "chattogram", label: "Chattogram" },
          { value: "sylhet", label: "Sylhet" },
          { value: "rajshahi", label: "Rajshahi" },
          { value: "khulna", label: "Khulna" },
        ]}
      />
    </div>
  );
}

/* ---------- checkbox ---------- */
function CheckboxDefault() {
  return <Checkbox label="Send me the weekly tea list" defaultChecked />;
}

function CheckboxStates() {
  const [items, setItems] = React.useState({ tin: true, cup: false });
  const all = items.tin && items.cup;
  const some = items.tin || items.cup;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox label="Add everything" checked={all} indeterminate={some && !all} onChange={e => setItems({ tin: e.target.checked, cup: e.target.checked })} />
      <div style={{ display: "grid", gap: 12, paddingLeft: 28 }}>
        <Checkbox label="Darjeeling tin" checked={items.tin} onChange={e => setItems({ ...items, tin: e.target.checked })} />
        <Checkbox label="Clay cup" checked={items.cup} onChange={e => setItems({ ...items, cup: e.target.checked })} />
      </div>
      <Checkbox label="Gift wrap (not available)" disabled />
    </div>
  );
}

/* ---------- radio ---------- */
function RadioDefault() {
  const [pick, setPick] = React.useState("home");
  return (
    <div role="radiogroup" aria-label="Delivery" style={{ display: "grid", gap: 12 }}>
      <Radio name="delivery" label="Home delivery" checked={pick === "home"} onChange={() => setPick("home")} />
      <Radio name="delivery" label="Pick up from Shapla" checked={pick === "shop"} onChange={() => setPick("shop")} />
      <Radio name="delivery" label="Courier hub" checked={pick === "hub"} onChange={() => setPick("hub")} />
    </div>
  );
}

function RadioStates() {
  return (
    <div role="radiogroup" aria-label="Payment" style={{ display: "grid", gap: 12 }}>
      <Radio name="pay" label="bKash" defaultChecked />
      <Radio name="pay" label="Cash on delivery" />
      <Radio name="pay" label="Card (coming soon)" disabled />
    </div>
  );
}

/* ---------- switch ---------- */
function SwitchDefault() {
  const [on, setOn] = React.useState(true);
  return <Switch label="Order updates by SMS" checked={on} onChange={e => setOn(e.target.checked)} />;
}

function SwitchSizes() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Switch size="sm" label="Small" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
      <Switch label="Disabled" disabled />
    </div>
  );
}

/* ---------- slider ---------- */
function SliderDefault() {
  const [v, setV] = React.useState(480);
  return (
    <div style={{ width: 320, display: "grid", gap: 8 }}>
      <label htmlFor="budget" className="text-label-medium text-fg-primary">Budget: ৳{v}</label>
      <Slider id="budget" min={100} max={1000} step={10} value={v} onChange={e => setV(Number(e.target.value))} />
    </div>
  );
}

function SliderStates() {
  return (
    <div style={{ width: 320, display: "grid", gap: 20 }}>
      <Slider aria-label="Sweetness" defaultValue={30} />
      <Slider aria-label="Strength" defaultValue={80} />
      <Slider aria-label="Locked" defaultValue={50} disabled />
    </div>
  );
}

/* ---------- segmented ---------- */
function SegmentedDefault() {
  const [v, setV] = React.useState("month");
  return (
    <Segmented
      aria-label="Billing"
      value={v}
      onValueChange={setV}
      options={[{ value: "week", label: "Weekly" }, { value: "month", label: "Monthly" }, { value: "year", label: "Yearly" }]}
    />
  );
}

function SegmentedSizes() {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <Segmented size="sm" aria-label="Small" defaultValue="tin" options={[{ value: "tin", label: "Tin" }, { value: "bag", label: "Bag" }]} />
      <Segmented size="md" aria-label="Medium" defaultValue="bag" options={[{ value: "tin", label: "Tin" }, { value: "bag", label: "Bag" }, { value: "box", label: "Box", disabled: true }]} />
    </div>
  );
}

/* ---------- chip ---------- */
function ChipDefault() {
  const [on, setOn] = React.useState(["green"]);
  const toggle = (k: string) => setOn(s => (s.includes(k) ? s.filter(x => x !== k) : [...s, k]));
  return (
    <div className="flex flex-wrap gap-2">
      {[["green", "Green tea"], ["black", "Black tea"], ["herbal", "Herbal"], ["chai", "Masala chai"]].map(([k, label]) => (
        <Chip key={k} selected={on.includes(k)} onClick={() => toggle(k)}>{label}</Chip>
      ))}
    </div>
  );
}

function ChipAppearances() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip appearance="filled">Filled</Chip>
      <Chip appearance="outline">Outline</Chip>
      <Chip appearance="soft">Soft</Chip>
      <Chip appearance="outline" disabled>Disabled</Chip>
    </div>
  );
}

function ChipRemovable() {
  const [tags, setTags] = React.useState(["Sylhet", "Organic", "Under ৳500"]);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(t => <Chip key={t} appearance="soft" onRemove={() => setTags(s => s.filter(x => x !== t))}>{t}</Chip>)}
      {tags.length === 0 ? <span className="text-body-small text-fg-secondary">No filters</span> : null}
    </div>
  );
}

/* ---------- tag input ---------- */
function TagInputDefault() {
  return (
    <div style={{ width: 360 }}>
      <TagInput label="Invite the team" defaultValue={["israt@shapla.example"]} helper="Press Enter after each email." />
    </div>
  );
}

/* ---------- toggle ---------- */
function ToggleDefault() {
  const [fav, setFav] = React.useState(false);
  return <Toggle variant="outline" pressed={fav} onPressedChange={setFav} icon={<Star />}>{fav ? "Saved" : "Save"}</Toggle>;
}

function ToggleGroupDemo() {
  return (
    <ToggleGroup attached aria-label="Text style">
      <Toggle variant="outline" defaultPressed>Hot</Toggle>
      <Toggle variant="outline">Iced</Toggle>
      <Toggle variant="outline">Cold brew</Toggle>
    </ToggleGroup>
  );
}

/* ---------- selection card ---------- */
function SelectionCardDefault() {
  const [plan, setPlan] = React.useState("monthly");
  return (
    <div style={{ width: 360, display: "grid", gap: 12 }} role="radiogroup" aria-label="Tea club plan">
      <SelectionCard name="plan" checked={plan === "monthly"} onChange={() => setPlan("monthly")} title="Monthly tin" description="One 250g tin each month." price="৳480 / month" />
      <SelectionCard name="plan" checked={plan === "yearly"} onChange={() => setPlan("yearly")} icon={<Zap />} title="Yearly club" description="Twelve tins, one free." price="৳5,280 / year" />
    </div>
  );
}

/* ---------- date picker ---------- */
function DatePickerDefault() {
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({ from: new Date(2026, 9, 18) });
  return <DatePicker type="single" month={new Date(2026, 9, 1)} value={range} onValueChange={setRange} />;
}

function DatePickerRange() {
  return <DatePicker type="range" month={new Date(2026, 9, 1)} defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 16) }} weekStartsOn={0} />;
}

/* ---------- file upload ---------- */
function FileUploadDefault() {
  const [name, setName] = React.useState("");
  return (
    <div style={{ width: 360 }}>
      <FileUpload onFiles={files => setName(files[0]?.name ?? "")} helper={name ? `Added: ${name}` : "PNG or SVG, up to 2 MB."} />
    </div>
  );
}

/* ---------- rating ---------- */
function RatingDefault() {
  const [stars, setStars] = React.useState(4);
  return (
    <div style={{ display: "grid", gap: 6, justifyItems: "center" }}>
      <Rating aria-label="Rate Sylhet green" value={stars} onValueChange={setStars} />
      <span className="text-body-small text-fg-secondary">{stars} of 5 for Sylhet green</span>
    </div>
  );
}

export const forms = {
  input: [
    { title: "Default", Demo: InputDefault },
    { title: "Appearances", Demo: InputAppearances },
    { title: "Sizes", Demo: InputSizes },
    { title: "Icon, prefix, error and disabled", Demo: InputExtras },
  ],
  select: [
    { title: "Default", Demo: SelectDefault },
    { title: "With a placeholder", Demo: SelectPlaceholder },
    { title: "Filled, error and disabled", Demo: SelectStates },
  ],
  textarea: [{ title: "Default", Demo: TextareaDefault }, { title: "Filled and error", Demo: TextareaStates }],
  "search-field": [{ title: "Default", Demo: SearchFieldDefault }],
  "number-input": [{ title: "Default", Demo: NumberInputDefault }],
  "otp-input": [{ title: "Default", Demo: OtpInputDefault }],
  combobox: [{ title: "Default", Demo: ComboboxDefault }],
  checkbox: [{ title: "Default", Demo: CheckboxDefault }, { title: "Mixed, nested and disabled", Demo: CheckboxStates }],
  radio: [{ title: "Default", Demo: RadioDefault }, { title: "Default choice and disabled", Demo: RadioStates }],
  switch: [{ title: "Default", Demo: SwitchDefault }, { title: "Sizes and disabled", Demo: SwitchSizes }],
  slider: [{ title: "Default", Demo: SliderDefault }, { title: "Values and disabled", Demo: SliderStates }],
  segmented: [{ title: "Default", Demo: SegmentedDefault }, { title: "Sizes and a disabled option", Demo: SegmentedSizes }],
  chip: [
    { title: "Default", Demo: ChipDefault },
    { title: "Appearances", Demo: ChipAppearances },
    { title: "Removable", Demo: ChipRemovable },
  ],
  "tag-input": [{ title: "Default", Demo: TagInputDefault }],
  toggle: [{ title: "Default", Demo: ToggleDefault }, { title: "Toggle group", Demo: ToggleGroupDemo }],
  "selection-card": [{ title: "Default", Demo: SelectionCardDefault }],
  "date-picker": [{ title: "Default", Demo: DatePickerDefault }, { title: "Date range", Demo: DatePickerRange }],
  "file-upload": [{ title: "Default", Demo: FileUploadDefault }],
  rating: [{ title: "Default", Demo: RatingDefault }],
};
