import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Responses" table="llm_responses" readOnly fields={[
    { key: "id", label: "ID" },
    { key: "llm_model_id", label: "Model ID" },
    { key: "prompt_chain_id", label: "Chain ID" },
    { key: "input_tokens", label: "Input Tokens", type: "number" },
    { key: "output_tokens", label: "Output Tokens", type: "number" },
    { key: "response_text", label: "Response" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
