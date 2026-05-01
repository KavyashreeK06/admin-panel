import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Caption Examples" table="caption_examples" searchField="content" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "content", label: "Content", type: "textarea" },
    { key: "image_id", label: "Image ID" },
    { key: "humor_flavor_id", label: "Humor Flavor ID" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
