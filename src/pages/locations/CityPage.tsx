import { useParams, Navigate } from "react-router-dom";
import CityServiceAreaPage from "@/components/locations/CityServiceAreaPage";
import { getLocationBySlug } from "@/data/njLocations";

const CityPage = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const location = citySlug ? getLocationBySlug(citySlug) : undefined;
  if (!location) return <Navigate to="/service-areas/new-jersey" replace />;
  return <CityServiceAreaPage location={location} />;
};

export default CityPage;
