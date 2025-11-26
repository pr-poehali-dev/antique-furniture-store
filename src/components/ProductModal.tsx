import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  price: number;
  image_url: string;
  period?: string;
  description?: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.image_url 
    ? product.image_url.split(',').map(url => url.trim())
    : [];

  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-serif text-primary mb-4">
          {product.title}
        </DialogTitle>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={`${product.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={prevImage}
                    >
                      <Icon name="ChevronLeft" size={24} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={nextImage}
                    >
                      <Icon name="ChevronRight" size={24} />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-primary w-8'
                              : 'bg-background/50 hover:bg-background/75'
                          }`}
                          aria-label={`Перейти к изображению ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Icon name="Image" size={64} className="text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
              {product.period && (
                <div className="text-muted-foreground">
                  Период: {product.period}
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Описание</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <Button className="mt-auto" size="lg">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              Связаться с нами
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
