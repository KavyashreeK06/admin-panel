import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Humor Flavor Steps" table="humor_flavor_steps" readOnly fields={[
    { key: "id", label: "ID" },
    { key: "humor_flavor_id", label: "Flavor ID" },
    { key: "step_number", label: "Step #" },
    { key: "instruction", label: "Instruction" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
