// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, ChevronLeft, ChevronRight, X, MapPin, Play, ArrowLeft, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PublicFeedPost {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  tags: string[];
  created_at: string;
  images: { id: string; file_url: string; file_type?: string; display_order: number }[];
}

// Import before and after images
import beforeAfter1 from "@/assets/before-after/before-after-1.png";
import beforeAfter2 from "@/assets/before-after/before-after-2.png";
import beforeAfter3 from "@/assets/before-after/before-after-3.png";
import beforeAfter4 from "@/assets/before-after/before-after-4.png";
import beforeAfter5 from "@/assets/before-after/before-after-5.png";
import beforeAfter6 from "@/assets/before-after/before-after-6.png";
import beforeAfter7 from "@/assets/before-after/before-after-7.png";
import beforeAfter8 from "@/assets/before-after/before-after-8.png";
import beforeAfter9 from "@/assets/before-after/before-after-9.png";
import beforeAfter10 from "@/assets/before-after/before-after-10.png";
import beforeAfter11 from "@/assets/before-after/before-after-11.png";
import beforeAfter12 from "@/assets/before-after/before-after-12.png";
import albumCover from "@/assets/before-after/album-cover.png";

interface GalleryProject {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image_url: string;
  display_order: number;
  is_featured: boolean;
  folder_name?: string;
  parent_folder_id?: string;
}

interface GalleryFolder {
  id: string;
  name: string;
  description: string;
  cover_image_url: string;
  display_order: number;
  project_count?: number;
}

// Image mapping for local imports
const imageMap: Record<string, string> = {
  "before-after-1.png": beforeAfter1,
  "before-after-2.png": beforeAfter2,
  "before-after-3.png": beforeAfter3,
  "before-after-4.png": beforeAfter4,
  "before-after-5.png": beforeAfter5,
  "before-after-6.png": beforeAfter6,
  "before-after-7.png": beforeAfter7,
  "before-after-8.png": beforeAfter8,
  "before-after-9.png": beforeAfter9,
  "before-after-10.png": beforeAfter10,
  "before-after-11.png": beforeAfter11,
  "before-after-12.png": beforeAfter12,
  "album-cover.png": albumCover,
};

const resolveImage = (url?: string) => (url ? imageMap[url] || url : "");

const Gallery = () => {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  // Album drilldown: "all" = every photo, otherwise folder id
  const [activeAlbum, setActiveAlbum] = useState<"all" | string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<GalleryProject[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [publicPosts, setPublicPosts] = useState<PublicFeedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<PublicFeedPost | null>(null);
  const [postImageIndex, setPostImageIndex] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFoldersAndProjects();
    fetchPublicFeedPosts();
  }, []);

  // Keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      switch (event.key) {
        case "Escape":
          handleCloseLightbox();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handlePreviousImage();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNextImage();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, lightboxImages.length]);

  // Keep active thumbnail visible in the strip
  useEffect(() => {
    if (!isLightboxOpen || !thumbStripRef.current) return;
    const active = thumbStripRef.current.children[currentImageIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentImageIndex, isLightboxOpen]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (isLightboxOpen || selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, selectedPost]);

  const fetchFoldersAndProjects = async () => {
    try {
      const { data: foldersData, error: foldersError } = await supabase
        .from("gallery_folders")
        .select("*")
        .order("display_order", { ascending: true });

      const { data: projectsData, error: projectsError } = await supabase
        .from("gallery_projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (foldersError) throw foldersError;
      if (projectsError) throw projectsError;

      const foldersWithCounts = (foldersData || []).map((folder) => ({
        ...folder,
        description:
          folder.name === "Before and After"
            ? "Stunning transformations from our floor refinishing projects"
            : folder.description,
        project_count: (projectsData || []).filter((project) => project.parent_folder_id === folder.id).length,
      }));

      setFolders(foldersWithCounts);
      setProjects(projectsData || []);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPublicFeedPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from("feed_posts")
        .select("id, title, description, location, category, tags, created_at")
        .eq("visibility", "public")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;

      const postIds = (posts || []).map((p) => p.id);
      let images: { id: string; file_url: string; file_type: string; feed_post_id: string; display_order: number }[] = [];
      if (postIds.length > 0) {
        const { data: imgData } = await supabase
          .from("feed_post_images")
          .select("id, file_url, file_type, feed_post_id, display_order")
          .in("feed_post_id", postIds)
          .order("display_order", { ascending: true });
        images = imgData || [];
      }

      setPublicPosts((posts || []).map((p) => ({ ...p, tags: p.tags || [], images: images.filter((img) => img.feed_post_id === p.id) })));
    } catch (err) {
      console.error("Error fetching public feed posts:", err);
    }
  };

  const albumImages = useMemo(() => {
    if (activeAlbum === "all") return projects;
    if (activeAlbum) return projects.filter((p) => p.parent_folder_id === activeAlbum);
    return [];
  }, [projects, activeAlbum]);

  const activeAlbumName = useMemo(() => {
    if (activeAlbum === "all") return "All Photos";
    return folders.find((f) => f.id === activeAlbum)?.name || "Album";
  }, [activeAlbum, folders]);

  const openLightbox = (images: GalleryProject[], index: number) => {
    setLightboxImages(images);
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setCurrentImageIndex(0);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
  };

  // Swipe support (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handlePreviousImage();
      else handleNextImage();
    }
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Gallery Intro + Folders / Album view */}
      <section className="pt-6 pb-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {activeAlbum === null ? (
            <>
              <div className="text-center max-w-3xl mx-auto mb-14">
                <h2 className="text-[1.75rem] leading-[1.35] sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-navy mb-4 px-1 py-1 overflow-visible">
                  The Work{" "}
                  <span className="text-gradient-gold italic inline-block px-0.5">Speaks</span>
                  <br className="hidden sm:block" />{" "}
                  <span className="text-gradient-gold italic inline-block px-0.5">for Itself</span>
                </h2>
                <p className="text-grey leading-relaxed text-base md:text-lg">
                  Albums organized by project type — refinishing, installations, and more.
                  <span className="block mt-1 text-navy/70 font-medium">Tap any album to explore the full set.</span>
                </p>
              </div>
              {isLoading ? (
                <div className="text-center py-20">
                  <p className="text-grey text-lg">Loading gallery...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* All Photos album */}
                  {projects.length > 0 && (
                    <Card
                      className="group hover:shadow-gold transition-smooth hover:-translate-y-2 overflow-hidden cursor-pointer"
                      onClick={() => setActiveAlbum("all")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={resolveImage(projects[0]?.image_url)}
                          alt="All Photos"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                        />
                        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <div className="text-white text-center">
                            <LayoutGrid className="w-12 h-12 mx-auto mb-2" />
                            <span className="font-medium text-lg">View All Photos</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-heading font-semibold text-navy mb-2 group-hover:text-gold transition-smooth">
                          All Photos
                        </h3>
                        <p className="text-grey leading-relaxed">
                          Browse our complete portfolio — {projects.length} photos in one place.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {folders.map((folder) => (
                    <Card
                      key={folder.id}
                      className="group hover:shadow-gold transition-smooth hover:-translate-y-2 overflow-hidden cursor-pointer"
                      onClick={() => setActiveAlbum(folder.id)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={resolveImage(folder.cover_image_url)}
                          alt={folder.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                        />
                        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <div className="text-white text-center">
                            <Image className="w-12 h-12 mx-auto mb-2" />
                            <span className="font-medium text-lg">View Photos</span>
                          </div>
                        </div>
                        {folder.project_count > 0 && (
                          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {folder.project_count} photos
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-heading font-semibold text-navy mb-2 group-hover:text-gold transition-smooth">
                          {folder.name}
                        </h3>
                        <p className="text-grey leading-relaxed">{folder.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Album drilldown — uniform grid */
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveAlbum(null)}
                  className="text-navy hover:text-gold"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> All Albums
                </Button>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-navy truncate">{activeAlbumName}</h2>
                  <p className="text-sm text-grey">{albumImages.length} photos — tap any photo to view it full screen.</p>
                </div>
              </div>

              {albumImages.length === 0 ? (
                <div className="text-center py-20">
                  <Image className="w-12 h-12 mx-auto text-grey/40 mb-3" />
                  <p className="text-grey">This album is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {albumImages.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      className="group relative aspect-square overflow-hidden rounded-lg bg-muted focus:outline-none focus:ring-2 focus:ring-gold"
                      onClick={() => openLightbox(albumImages, index)}
                      aria-label={`View photo ${index + 1}: ${project.title}`}
                    >
                      <img
                        src={resolveImage(project.image_url)}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                      />
                      <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-smooth" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {publicPosts.length > 0 && (
        <section className="py-20 bg-grey-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
                Recent <span className="text-gradient-gold">Project Updates</span>
              </h2>
              <p className="text-grey max-w-2xl mx-auto">
                See the latest work from our team — real projects, real results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group hover:shadow-gold transition-smooth hover:-translate-y-2 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedPost(post);
                    setPostImageIndex(0);
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {post.images.length > 0 ? (
                      (() => {
                        const firstImg = post.images[0];
                        const isVideo = firstImg?.file_type === "video";
                        return isVideo ? (
                          <>
                            <video
                              src={firstImg.file_url}
                              className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                              <div className="bg-black/60 rounded-full p-2">
                                <Play className="w-6 h-6 text-white fill-white" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={firstImg?.file_url}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                          />
                        );
                      })()
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Image className="w-16 h-16 text-muted-foreground/40" />
                      </div>
                    )}
                    {post.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {post.images.length} photos
                      </div>
                    )}
                    <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                      <div className="text-white text-center">
                        <Image className="w-12 h-12 mx-auto mb-2" />
                        <span className="font-medium text-lg">View Project</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-heading font-semibold text-navy mb-1 group-hover:text-gold transition-smooth truncate">
                      {post.title || "Project Update"}
                    </h3>
                    {post.location && (
                      <p className="text-sm text-grey flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{post.location}</span>
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feed Post Lightbox */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedPost(null)}
        >
          <div className="relative w-full h-full max-w-6xl flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setSelectedPost(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {selectedPost.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPostImageIndex((prev) => (prev > 0 ? prev - 1 : selectedPost.images.length - 1));
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPostImageIndex((prev) => (prev < selectedPost.images.length - 1 ? prev + 1 : 0));
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            <div className="flex flex-col items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const currentImg = selectedPost.images[postImageIndex];
                const isVideo = currentImg?.file_type === "video";
                return isVideo ? (
                  <video
                    src={currentImg.file_url}
                    controls
                    muted
                    playsInline
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img
                    src={currentImg?.file_url}
                    alt={selectedPost.title}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                  />
                );
              })()}
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-heading font-semibold">{selectedPost.title}</h3>
                {selectedPost.description && (
                  <p className="text-white/70 mt-1 max-w-xl">{selectedPost.description}</p>
                )}
                {selectedPost.images.length > 1 && (
                  <div className="mt-2 bg-black/50 inline-block px-3 py-1 rounded-full text-sm">
                    {postImageIndex + 1} / {selectedPost.images.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Album Lightbox — contained photo + thumbnail strip */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={handleCloseLightbox}
        >
          {/* Top bar: counter + close */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {lightboxImages.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleCloseLightbox}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Main photo — always contained within the viewport */}
          <div
            className="relative flex-1 min-h-0 flex items-center justify-center px-12 sm:px-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {lightboxImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousImage();
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}

            <img
              src={resolveImage(lightboxImages[currentImageIndex]?.image_url)}
              alt={lightboxImages[currentImageIndex]?.title}
              className="max-w-full max-h-full object-contain rounded-lg select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            {lightboxImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}
          </div>

          {/* Thumbnail strip — 64x64, tap to jump */}
          {lightboxImages.length > 1 && (
            <div className="shrink-0 py-3" onClick={(e) => e.stopPropagation()}>
              <div
                ref={thumbStripRef}
                className="flex gap-2 overflow-x-auto px-4 pb-1 justify-start sm:justify-center"
                style={{ scrollbarWidth: "thin" }}
              >
                {lightboxImages.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to photo ${index + 1}`}
                    className={`w-16 h-16 shrink-0 rounded-md overflow-hidden transition-all focus:outline-none ${
                      index === currentImageIndex
                        ? "ring-2 ring-gold opacity-100"
                        : "opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={resolveImage(img.image_url)}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
