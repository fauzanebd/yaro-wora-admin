import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGeneralPricingContent,
  usePricing,
  useUpdateGeneralPricingContent,
  useUpdatePricing,
  useUploadFile,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Info, Edit } from "lucide-react";
import GeneralPricingContentDialog from "@/components/GeneralPricingContentDialog";

const pricingSchema = z.object({
  type: z.string(),
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Title (Indonesian) is required"),
  subtitle: z.string().optional(),
  subtitle_id: z.string().optional(),
  adult_price: z
    .string()
    .min(1, "Adult price is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0;
    }, "Adult price must be a valid number >= 0"),
  infant_price: z
    .string()
    .min(1, "Infant price is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0;
    }, "Infant price must be a valid number >= 0"),
  currency: z.string(),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  thumbnail_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  color: z.string().optional(),
  start_gradient_color: z.string().optional(),
  end_gradient_color: z.string().optional(),
});

type PricingForm = z.infer<typeof pricingSchema>;

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("domestic");
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const isDataLoaded = useRef(false);

  // Query hooks
  const { data: pricingsData, isLoading } = usePricing();
  const {
    data: generalPricingContentData,
    isLoading: generalPricingContentLoading,
    error: generalPricingContentError,
  } = useGeneralPricingContent();

  // Ensure pricings is always an array
  const pricings = Array.isArray(pricingsData) ? pricingsData : [];

  // Mutation hooks
  const updatePricing = useUpdatePricing();
  const uploadFile = useUploadFile();

  const updateGeneralPricingContent = useUpdateGeneralPricingContent();

  const domesticForm = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      type: "domestic",
      title: "",
      title_id: "",
      subtitle: "",
      subtitle_id: "",
      adult_price: "",
      infant_price: "",
      currency: "IDR",
      description: "",
      image_url: "",
      thumbnail_url: "",
      color: "#000000",
      start_gradient_color: "#000000",
      end_gradient_color: "#FFFFFF",
    },
  });

  const localsForm = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      type: "locals_sumba",
      title: "",
      title_id: "",
      subtitle: "",
      subtitle_id: "",
      adult_price: "",
      infant_price: "",
      currency: "IDR",
      description: "",
      image_url: "",
      thumbnail_url: "",
      color: "#000000",
      start_gradient_color: "#000000",
      end_gradient_color: "#FFFFFF",
    },
  });

  const foreignerForm = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      type: "foreigner",
      title: "",
      title_id: "",
      subtitle: "",
      subtitle_id: "",
      adult_price: "",
      infant_price: "",
      currency: "IDR",
      description: "",
      image_url: "",
      thumbnail_url: "",
      color: "#000000",
      start_gradient_color: "#000000",
      end_gradient_color: "#FFFFFF",
    },
  });

  // Update forms when pricing data is loaded
  useEffect(() => {
    console.log("Pricing data loaded:", pricings);

    // Reset flag when pricings change
    if (pricings.length === 0) {
      isDataLoaded.current = false;
    }

    if (
      Array.isArray(pricings) &&
      pricings.length > 0 &&
      !isDataLoaded.current
    ) {
      isDataLoaded.current = true;

      pricings.forEach((pricing) => {
        console.log("Processing pricing type:", pricing.type, pricing);
        const formData = {
          type: pricing.type || "",
          title: pricing.title || "",
          title_id: pricing.title_id || "",
          subtitle: pricing.subtitle || "",
          subtitle_id: pricing.subtitle_id || "",
          adult_price: (pricing.adult_price ?? 0).toString(),
          infant_price: (pricing.infant_price ?? 0).toString(),
          currency: pricing.currency || "IDR",
          description: pricing.description || "",
          image_url: pricing.image_url || "",
          thumbnail_url: pricing.thumbnail_url || "",
          color: pricing.color || "#000000",
          start_gradient_color: pricing.start_gradient_color || "#000000",
          end_gradient_color: pricing.end_gradient_color || "#FFFFFF",
        };
        console.log("Form data prepared:", formData);

        if (pricing.type === "domestic") {
          console.log("Resetting domestic form with:", formData);
          domesticForm.reset(formData, { keepDefaultValues: false });
        }
        if (pricing.type === "locals_sumba") {
          console.log("Resetting locals form with:", formData);
          localsForm.reset(formData, { keepDefaultValues: false });
        }
        if (pricing.type === "foreigner") {
          console.log("Resetting foreigner form with:", formData);
          foreignerForm.reset(formData, { keepDefaultValues: false });
        }
      });
    }
  }, [pricings]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    form: any
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "pricing",
      });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const onSubmit = async (data: PricingForm) => {
    try {
      // Convert string prices to numbers for API
      const apiData = {
        ...data,
        adult_price: parseInt(data.adult_price, 10),
        infant_price: parseInt(data.infant_price, 10),
      };
      await updatePricing.mutateAsync(apiData);
      alert("Pricing updated successfully!");
    } catch (error) {
      console.error("Failed to update pricing:", error);
      alert("Failed to update pricing");
    }
  };

  const onContentSubmit = async (data: any) => {
    try {
      await updateGeneralPricingContent.mutateAsync(data);
      setIsContentDialogOpen(false);
    } catch (error) {
      console.error("Failed to update general pricing content:", error);
      alert("Failed to update general pricing content");
    }
  };

  const handleContentDialogOpenChange = (open: boolean) => {
    setIsContentDialogOpen(open);
  };

  const renderForm = (form: any, title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Set entrance fee for {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Indonesian)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Indonesian) (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adult_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adult Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="infant_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Infant Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FormLabel>Image</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supported formats: JPG, PNG</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadFile.isPending}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadFile.isPending ? "Uploading..." : "Upload Image"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleFileUpload(e, form)}
                    className="hidden"
                  />
                </label>
              </div>
              {form.watch("image_url") && (
                <img
                  src={form.watch("image_url")}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Or paste image URL"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-set thumbnail URL to same value when manually entering image URL
                        form.setValue("thumbnail_url", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL (Auto-generated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Thumbnail URL (auto-generated on upload)"
                      {...field}
                      readOnly
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormDescription>
                    Automatically generated when uploading a file
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" {...field} className="w-16 h-10" />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#000000"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_gradient_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Gradient Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" {...field} className="w-16 h-10" />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#000000"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_gradient_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Gradient Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" {...field} className="w-16 h-10" />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Update Pricing</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading pricing data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Management</h1>
        <p className="text-muted-foreground">
          Manage entrance fee pricing for different visitor types
        </p>
        {pricings.length === 0 && (
          <p className="text-sm text-yellow-600 mt-2">
            No pricing data found. Please fill in the forms below to create
            pricing entries.
          </p>
        )}
        {pricings.length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            Loaded {pricings.length} pricing{" "}
            {pricings.length === 1 ? "entry" : "entries"}
          </p>
        )}
      </div>

      {/* Section Content Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Section Content</CardTitle>
              <CardDescription>
                Manage the title and description for the Pricing section
              </CardDescription>
            </div>
            <GeneralPricingContentDialog
              open={isContentDialogOpen}
              onOpenChange={handleContentDialogOpenChange}
              content={generalPricingContentData || null}
              onSubmit={onContentSubmit}
              trigger={
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {generalPricingContentLoading ? (
            <div className="text-center py-4">Loading content...</div>
          ) : generalPricingContentError ? (
            <div className="text-center py-4">
              <p className="text-destructive font-medium mb-2">
                Failed to load section content
              </p>
              <p className="text-sm text-muted-foreground">
                {generalPricingContentError instanceof Error
                  ? generalPricingContentError.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : generalPricingContentData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title (English)
                </h3>
                <p className="text-lg">
                  {generalPricingContentData.general_pricing_section_title}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title (Indonesian)
                </h3>
                <p className="text-lg">
                  {generalPricingContentData.general_pricing_section_title_id}
                </p>
              </div>
              {generalPricingContentData.general_pricing_section_description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (English)
                  </h3>
                  <p className="text-sm">
                    {
                      generalPricingContentData.general_pricing_section_description
                    }
                  </p>
                </div>
              )}
              {generalPricingContentData.general_pricing_section_description_id && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (Indonesian)
                  </h3>
                  <p className="text-sm">
                    {
                      generalPricingContentData.general_pricing_section_description_id
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No section content found. Click "Edit Content" to add content.
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="domestic">Domestic</TabsTrigger>
          <TabsTrigger value="locals_sumba">Locals Sumba</TabsTrigger>
          <TabsTrigger value="foreigner">Foreigner</TabsTrigger>
        </TabsList>
        <TabsContent value="domestic">
          {renderForm(domesticForm, "Domestic Visitors")}
        </TabsContent>
        <TabsContent value="locals_sumba">
          {renderForm(localsForm, "Locals Sumba")}
        </TabsContent>
        <TabsContent value="foreigner">
          {renderForm(foreignerForm, "Foreign Visitors")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
