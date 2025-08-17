import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreateListingModal } from "@/components/CreateListingModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  user_id: string;
  item_title: string;
  item_description: string | null;
  asking_price: number | null;
  reward_percentage: number | null;
  max_degrees: number;
  status: string;
  created_at: string;
  updated_at: string;
  item_images?: any[] | null;
}

interface ListingsSectionProps {
  userId: string | null;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  statsByListing: Record<string, { count: number; avgDegree: number }>;
  loading: boolean;
}

export const ListingsSection = ({ 
  userId, 
  listings, 
  setListings, 
  statsByListing, 
  loading 
}: ListingsSectionProps) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState<Listing | null>(null);

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message });
    setListings(prev => prev.filter(l => l.id !== id));
    toast({ title: "Listing deleted" });
  };

  const handleListingCreated = () => {
    // Refresh listings after creation
    window.location.reload();
  };

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      item_title: String(fd.get("item_title") || editing.item_title),
      item_description: String(fd.get("item_description") || ""),
      asking_price: Number(fd.get("asking_price") || 0),
      reward_percentage: Number(fd.get("reward_percentage") || 0),
      max_degrees: 6, // Always 6 degrees
      status: String(fd.get("status") || editing.status),
    };
    const { error, data } = await supabase.from("listings").update(payload).eq("id", editing.id).select().maybeSingle();
    if (error) return toast({ title: "Update failed", description: error.message });
    setListings(prev => prev.map(l => l.id === editing.id ? { ...l, ...(data as any) } : l));
    setEditing(null);
    toast({ title: "Listing updated" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-[hsl(var(--brand-academic))]">My Course Listings</h2>
        <CreateListingModal onListingCreated={handleListingCreated} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Edit, delete, and review performance stats.</CardDescription>
        </CardHeader>
      <CardContent>
        {!userId && (
          <div className="text-sm text-muted-foreground">Please sign in to view your listings.</div>
        )}
        {userId && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Asking Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Avg Degree</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
              ) : listings.length ? (
                listings.map(l => {
                  const s = statsByListing[l.id] || { count: 0, avgDegree: 0 };
                  return (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.item_title}</TableCell>
                      <TableCell>{l.asking_price ? `$${l.asking_price.toFixed(0)}` : 'No price'}</TableCell>
                      <TableCell>{l.status}</TableCell>
                      <TableCell>{s.count}</TableCell>
                      <TableCell>{s.avgDegree ? s.avgDegree.toFixed(1) : "-"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setEditing(l)}>Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Listing</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={onSave} className="grid gap-3">
                              <div>
                                <Label htmlFor="item_title">Title</Label>
                                <Input id="item_title" name="item_title" defaultValue={l.item_title} />
                              </div>
                              <div>
                                <Label htmlFor="item_description">Description</Label>
                                <Input id="item_description" name="item_description" defaultValue={l.item_description ?? ""} />
                              </div>
                              <div>
                                <Label htmlFor="asking_price">Asking Price</Label>
                                <Input id="asking_price" name="asking_price" type="number" defaultValue={l.asking_price ?? 0} />
                              </div>
                              <div>
                                <Label htmlFor="reward_percentage">Reward % (All courses use 6 degrees)</Label>
                                <Input id="reward_percentage" name="reward_percentage" type="number" defaultValue={l.reward_percentage ?? 0} />
                              </div>
                              <div>
                                <Label htmlFor="status">Status</Label>
                                <Input id="status" name="status" defaultValue={l.status} />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(l.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow><TableCell colSpan={6}>No listings yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Total Section */}
      {userId && listings.length > 0 && (
        <div className="border-t p-4 bg-muted/30">
          <div className="flex justify-between items-center font-semibold">
            <span>Total Value of All Listings:</span>
            <span className="text-lg text-[hsl(var(--brand-academic))]">
              ${listings.reduce((total, listing) => total + (listing.asking_price || 0), 0).toFixed(0)}
            </span>
          </div>
        </div>
      )}
    </Card>
    </div>
  );
};