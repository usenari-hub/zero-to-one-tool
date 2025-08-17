import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <div 
            key={index} 
            className="relative cursor-pointer hover:opacity-80 transition-opacity aspect-square bg-muted rounded-md border overflow-hidden"
            onClick={() => setSelectedImage(index)}
          >
            <img 
              src={image} 
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-contain"
            />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 4} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex justify-center">
                      <img 
                        src={image} 
                        alt={`${title} - Image ${index + 1}`}
                        className="max-h-[80vh] max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};