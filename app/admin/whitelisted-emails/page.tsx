import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Whitelisted Emails" table="whitelisted_emails" searchField="email" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "email", label: "Email" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
