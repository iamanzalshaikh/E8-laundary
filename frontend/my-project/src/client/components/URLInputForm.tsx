import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Button } from "@/client/components/ui/button";
import { Globe, MapPin, ArrowRight } from "lucide-react";

interface URLInputFormProps {
  onNext: (data: { website: string; googleMapsUrl: string }) => void;
  initialData?: { website: string; googleMapsUrl: string };
}

export function URLInputForm({ onNext, initialData }: URLInputFormProps) {
  const [website, setWebsite] = useState(initialData?.website || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialData?.googleMapsUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ website, googleMapsUrl });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Start with your URLs</CardTitle>
        <CardDescription>
          Provide your website and Google Maps location to help our AI gather basic information about your laundromat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-secondary" />
              Website URL
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourlaundromat.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-dark/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsUrl" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Google Maps URL
            </Label>
            <Input
              id="googleMapsUrl"
              type="url"
              placeholder="https://maps.google.com/..."
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="bg-dark/50 border-white/10"
            />
          </div>

          <Button type="submit" className="w-full btn-premium">
            Continue to Form
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
