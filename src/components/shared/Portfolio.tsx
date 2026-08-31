import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import ImageLightbox from "@/components/locations/ssr/ImageLightbox";
import ba1 from "@/assets/before-after-1.png.asset.json";
import ba2 from "@/assets/before-after-2.png.asset.json";
import ba3 from "@/assets/before-after-3.png.asset.json";
import ba4 from "@/assets/before-after-4.png.asset.json";
const beforeAfterPhotos = [
  { src: ba1.url, alt: "Before and after hardwood floor refinishing in a foyer with staircase" },
  { src: ba2.url, alt: "Before and after hardwood floor sanding and refinishing in a living room" },
  { src: ba3.url, alt: "Before and after hardwood floor restoration in a bedroom" },
  { src: ba4.url, alt: "Before and after hardwood floor refinishing in a kitchen" },
];
const portfolioItems = [{
  id: 1,
  title: "Modern Hardwood Installation",
  category: "Hardwood",
  image: "/api/placeholder/400/300",
  description: "Premium oak flooring installation in contemporary home"
}, {
  id: 2,
  title: "Luxury Vinyl Transformation",
  category: "Vinyl",
  image: "/api/placeholder/400/300",
  description: "Waterproof luxury vinyl plank installation"
}, {
  id: 3,
  title: "Floor Refinishing Project",
  category: "Refinishing",
  image: "/api/placeholder/400/300",
  description: "Complete hardwood floor restoration and refinishing"
}, {
  id: 4,
  title: "Commercial Flooring",
  category: "Commercial",
  image: "/api/placeholder/400/300",
  description: "Large-scale commercial flooring installation"
}];
const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Hardwood", "Vinyl", "Refinishing", "Commercial"];
  const filteredItems = selectedCategory === "All" ? portfolioItems : portfolioItems.filter(item => item.category === selectedCategory);
  return <section className="py-12 sm:py-16 lg:py-20 bg-grey-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-navy mb-4 sm:mb-6 px-2">
             See what the right process can reveal.
          </h2>
          <p className="text-base sm:text-lg text-grey max-w-3xl mx-auto leading-relaxed px-2">
            Every floor below started as someone's "we've been meaning to fix that." Browse recent projects from homes across Monmouth County and beyond.
          </p>
        </div>

        {/* Before & After Grid */}
        <div className="mb-12 sm:mb-16">
          <ImageLightbox
            images={beforeAfterPhotos}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            itemClassName="relative overflow-hidden rounded-xl aspect-[2/1] bg-grey-light cursor-zoom-in shadow-elegant"
          />
        </div>



        {/* Category Filters */}
        <div className="mb-8 sm:mb-12">
          
        </div>


        {/* View More Button */}
        <div className="text-center px-4 sm:px-0">
          <Button asChild className="gold-gradient hover:scale-105 transition-bounce min-h-[48px] px-6 sm:px-8">
            <Link to="/gallery" className="flex items-center justify-center gap-2 text-sm sm:text-base">
              View Complete Gallery
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default Portfolio;