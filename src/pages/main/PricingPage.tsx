import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePricing, useUpdatePricing } from "@/hooks/useApi";
import type { Pricing } from "@/types/api";
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
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pricingSchema = z.object({
  type: z.string(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  adult_price: z.number().int().min(0),
  infant_price: z.number().int().min(0),
  currency: z.string(),
  description: z.string().optional(),
});

type PricingForm = z.infer<typeof pricingSchema>;

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("domestic");

  // Query hooks
  const { data: pricingsData, isLoading, error } = usePricing();

  // Ensure pricings is always an array
  const pricings = Array.isArray(pricingsData) ? pricingsData : [];

  // Mutation hooks
  const updatePricing = useUpdatePricing();

  const domesticForm = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: { type: "domestic", currency: "IDR" },
  });

  const localsForm = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: { type: "locals_sumba", currency: "IDR" },
  });

  const foreignerForm = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: { type: "foreigner", currency: "IDR" },
  });

  // Update forms when pricing data is loaded
  useEffect(() => {
    if (Array.isArray(pricings)) {
      pricings.forEach((pricing) => {
        const formData = {
          type: pricing.type,
          title: pricing.title,
          subtitle: pricing.subtitle || "",
          adult_price: pricing.adult_price,
          infant_price: pricing.infant_price,
          currency: pricing.currency,
          description: pricing.description || "",
        };
        if (pricing.type === "domestic") domesticForm.reset(formData);
        if (pricing.type === "locals_sumba") localsForm.reset(formData);
        if (pricing.type === "foreigner") foreignerForm.reset(formData);
      });
    }
  }, [pricings]);

  const onSubmit = async (data: PricingForm) => {
    try {
      await updatePricing.mutateAsync(data);
      alert("Pricing updated successfully!");
    } catch (error) {
      console.error("Failed to update pricing:", error);
      alert("Failed to update pricing");
    }
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
            <Button type="submit">Update Pricing</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Management</h1>
        <p className="text-muted-foreground">
          Manage entrance fee pricing for different visitor types
        </p>
      </div>

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
