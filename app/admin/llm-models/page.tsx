import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Models" table="llm_models" searchField="name" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "name", label: "Name" },
    { key: "llm_provider_id", label: "Provider ID" },
    { key: "model_string", label: "Model String" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "max_tokens", label: "Max Tokens", type: "number" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
