import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Terms" table="terms" searchField="term" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "term", label: "Term" },
    { key: "definition", label: "Definition", type: "textarea" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
