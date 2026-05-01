import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Providers" table="llm_providers" searchField="name" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "name", label: "Name" },
    { key: "api_base_url", label: "API Base URL" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
