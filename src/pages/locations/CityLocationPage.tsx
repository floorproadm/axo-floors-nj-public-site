import { useParams } from "react-router-dom";
import { getLocationBySlug } from "@/data/njLocations";
import CityServiceAreaPage from "@/components/locations/CityServiceAreaPage";
import NotFound from "@/pages/NotFound";

/**
 * Resolves `/service-areas/new-jersey/:slug` to the reusable city template.
 * Returns the site's existing 404 experience when the slug is unknown
 * OR when the location exists but is `published: false`.
 */
const CityLocationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = slug ? getLocationBySlug(slug) : undefined;
  if (!location || !location.published) {
    return <NotFound />;
  }
  return <CityServiceAreaPage location={location} />;
};

export default CityLocationPage;
