import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Prompt Chains" table="llm_prompt_chains" readOnly searchField="name" fields={[
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
