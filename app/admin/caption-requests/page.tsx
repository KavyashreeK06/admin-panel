import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Caption Requests" table="caption_requests" readOnly searchField="status" fields={[
    { key: "id", label: "ID" },
    { key: "profile_id", label: "Profile ID" },
    { key: "image_id", label: "Image ID" },
    { key: "status", label: "Status" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
