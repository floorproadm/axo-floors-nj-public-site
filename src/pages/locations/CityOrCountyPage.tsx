import { useParams, Navigate } from "react-router-dom";
import CityServiceAreaPage from "@/components/locations/CityServiceAreaPage";
import CountyHub from "./CountyHub";
import { getLocationBySlug } from "@/data/njLocations";

/**
 * Resolves `/service-areas/new-jersey/:slug` to either a county-hub page
 * (when the slug ends with `-county`) or a city page.
 */
const CityOrCountyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/service-areas/new-jersey" replace />;

  if (slug.endsWith("-county")) {
    return <CountyHub />;
  }

  const location = getLocationBySlug(slug);
  if (!location) return <Navigate to="/service-areas/new-jersey" replace />;
  return <CityServiceAreaPage location={location} />;
};

export default CityOrCountyPage;
