import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Allowed Signup Domains" table="allowed_signup_domains" searchField="domain" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "domain", label: "Domain" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
