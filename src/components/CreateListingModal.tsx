import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Plus, Upload, X, ArrowLeft } from "lucide-react";
import { PaymentSelector } from "@/components/PaymentSelector";

const PRICING_TIERS = [
  { range: "Up to $500", fee: 5 },
  { range: "$501 - $2,000", fee: 15 },
  { range: "$2,001 - $10,000", fee: 35 },
  { range: "$10,001+", fee: 75 },
];

const DEPARTMENTS = [
  "Technology",
  "Academic", 
  "Furniture",
  "Automotive",
  "Fashion & Accessories",
  "Sports & Recreation",
  "Arts & Collectibles",
  "Home & Garden",
  "Health & Beauty",
  "General"
];

interface CreateListingModalProps {
  onListingCreated?: () => void;
  variant?: "button" | "card";
}

export const CreateListingModal = ({ onListingCreated, variant = "button" }: CreateListingModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    askingPrice: "",
    rewardPercentage: "20",
    location: "",
    department: "",
    images: [] as string[]
  });

  const navigate = useNavigate();

  const calculateListingFee = (price: number) => {
    if (price <= 500) return 5;
    if (price <= 2000) return 15;
    if (price <= 10000) return 35;
    return 75;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImage(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < Math.min(files.length, 5 - formData.images.length); i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        
        // For now, we'll store images locally in the assets folder
        // In a real app, you'd upload to Supabase Storage
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === Math.min(files.length, 5 - formData.images.length)) {
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
              }));
              setUploadingImage(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      toast({
        title: "Image Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a listing.",
        variant: "destructive",
      });
      return;
    }

    const askingPrice = parseFloat(formData.askingPrice);

    if (askingPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid asking price.",
        variant: "destructive",
      });
      return;
    }

    // Show payment screen instead of creating listing directly
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const askingPrice = parseFloat(formData.askingPrice);

      const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        item_title: formData.title,
        item_description: formData.description || null,
        asking_price: askingPrice,
        reward_percentage: parseFloat(formData.rewardPercentage),
        max_degrees: 6, // Always 6 degrees
        general_location: formData.location || null,
        department: formData.department,
        status: "active",
        item_images: formData.images,
      });

      if (error) throw error;

      toast({
        title: "Course Listed Successfully! 📚",
        description: `Your ${formData.title} is now in the Course Catalog.`,
      });

      setOpen(false);
      setShowPayment(false);
      setFormData({
        title: "",
        description: "",
        askingPrice: "",
        rewardPercentage: "20",
        location: "",
        department: "",
        images: []
      });

      if (onListingCreated) {
        onListingCreated();
      }

    } catch (error: any) {
      toast({
        title: "Error Creating Listing",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const TriggerComponent = variant === "card" ? (
    <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:border-primary transition-colors cursor-pointer">
      <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <h3 className="text-base font-semibold mb-1">Create New Course Listing</h3>
      <p className="text-xs text-muted-foreground">Add an item to the Course Catalog</p>
    </div>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Create Listing
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {TriggerComponent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display mobile-h3 text-[hsl(var(--brand-academic))]">
            {showPayment ? "💳 Payment Required" : "📚 Create Course Listing"}
          </DialogTitle>
        </DialogHeader>

        {showPayment ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Complete payment to list your course in the catalog
              </p>
            </div>
            
            <PaymentSelector
              amount={calculateListingFee(parseFloat(formData.askingPrice))}
              description={`Listing fee for "${formData.title}"`}
              paymentType="listing_fee"
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
            
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setShowPayment(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="mobile-form-group">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., 2019 MacBook Pro - Mint Condition"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="mobile-input"
              />
            </div>

            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="All the juicy details about your item..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="images">Item Images (up to 5)</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage || formData.images.length >= 5}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <Button type="button" variant="outline" size="sm" disabled={uploadingImage || formData.images.length >= 5}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingImage ? "Uploading..." : "Upload"}
                  </Button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="askingPrice">Asking Price *</Label>
              <Input
                id="askingPrice"
                type="number"
                placeholder="1200"
                value={formData.askingPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
                required
                min="1"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">General Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco Bay Area"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="rewardPercentage">Professor Rewards (% of sale)</Label>
                <Select value={formData.rewardPercentage} onValueChange={(value) => setFormData(prev => ({ ...prev, rewardPercentage: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20% (Recommended)</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="30">30%</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {formData.askingPrice && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm font-medium mb-1">Listing Fee</div>
                <div className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                  ${calculateListingFee(parseFloat(formData.askingPrice))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  6 degrees of separation • 
                  {formData.rewardPercentage}% referral pool (${((parseFloat(formData.askingPrice) || 0) * (parseFloat(formData.rewardPercentage) / 100)).toFixed(0)})
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !formData.department}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};