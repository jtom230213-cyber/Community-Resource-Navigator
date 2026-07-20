import type { Resource } from "../types";

interface ResourceDetailProps {
  resource?: Resource;
  onClose: () => void;
}

export function ResourceDetail({ resource, onClose }: ResourceDetailProps) {
  if (!resource) {
    return <div className="detail-placeholder"><span className="placeholder-symbol" aria-hidden="true">+</span><h3>Choose a service</h3><p>Open a listing to see contact details, hours, and eligibility.</p></div>;
  }

  return (
    <article className="detail-content" aria-labelledby="resource-detail-title">
      <div className="detail-topline"><div><p className="detail-category">{resource.category}</p><h3 id="resource-detail-title">{resource.name}</h3></div><button className="detail-close" type="button" aria-label="Close resource details" onClick={onClose}>&times;</button></div>
      <p className="detail-address">{resource.address}</p>
      <dl className="detail-meta"><div><dt>Phone</dt><dd><a href={`tel:${resource.phone.replace(/[^\d+]/g, "")}`}>{resource.phone}</a></dd></div><div><dt>Website</dt><dd><a href={resource.website} target="_blank" rel="noreferrer">Visit service website</a></dd></div><div><dt>Eligibility</dt><dd>{resource.eligibility}</dd></div><div><dt>Hours</dt><dd>{resource.hours}</dd></div></dl>
    </article>
  );
}