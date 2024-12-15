import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

const options = [
  { key: "online", label: "Online" },
  { key: "stop", label: "Stop" },
  { key: "pause", label: "Pause" },
];

const getBoxColor = (status: string) => {
  switch (status) {
    case "online":
      return "success";
    case "stop":
      return "danger";
    case "pause":
      return "default";
    default:
      return "default";
  }
};

const StatusRow = ({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (newValue: string) => void;
}) => {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor={id} className="text-lg text-nowrap w-28">
        {label}
      </label>
      <Select
        className="max-w-xs"
        aria-labelledby={id}
        color={getBoxColor(value)}
        selectedKeys={[value]}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <SelectItem key={option.key} aria-label={option.label}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default function Status() {
  const [values, setValues] = useState({
    id: "",
    spot: "",
    ninety_nine_nine: "",
    ninety_six_fifty: "",
  });

  const handleChange = async (key: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
    if (!values.id) return;

    const res = await fetch("/api/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: values.id, [key]: newValue }),
    });
    if (!res.ok) return alert("Failed to update status");
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (!res.ok) return;
      setValues(data.response);
    })();
  }, []);

  return (
    <div className="flex flex-col p-6 gap-6 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto mt-4">
      <h1 className="text-3xl font-semibold text-center">STATUS</h1>
      <StatusRow
        id="gold-spot"
        label="Gold Spot"
        value={values.spot}
        onChange={(newValue) => handleChange("spot", newValue)}
      />
      <StatusRow
        id="gold-96"
        label="Gold 96.50%"
        value={values.ninety_six_fifty}
        onChange={(newValue) => handleChange("ninety_six_fifty", newValue)}
      />
      <StatusRow
        id="gold-99"
        label="Gold 99.99%"
        value={values.ninety_nine_nine}
        onChange={(newValue) => handleChange("ninety_nine_nine", newValue)}
      />
    </div>
  );
}
