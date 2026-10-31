import { useEffect } from "react";
import { META_PIXEL_ID, initializeMetaPixel } from "@/lib/meta-pixel";

export default function MetaPixel() {
  useEffect(() => {
    initializeMetaPixel(META_PIXEL_ID);
  }, []);
  return null;
}
