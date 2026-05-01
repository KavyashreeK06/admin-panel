import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Captions" table="captions" readOnly searchField="content" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "content", label: "Content", type: "textarea" },
    { key: "like_count", label: "Likes", type: "number" },
    { key: "is_featured", label: "Featured", type: "boolean" },
    { key: "is_public", label: "Public", type: "boolean" },
    { key: "profile_id", label: "Profile ID" },
    { key: "image_id", label: "Image ID" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
