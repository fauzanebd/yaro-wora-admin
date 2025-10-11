import { useState } from "react";
import {
  useContactInfo,
  useContactContent,
  useUpdateContactInfo,
  useUpdateContactContent,
} from "@/hooks/api/contact";
import type { ContactInfo, ContactContent } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, MapPin, Phone, Mail, ExternalLink, Globe } from "lucide-react";
import ContactContentDialog from "../components/ContactContentDialog";
import ContactInfoDialog from "../components/ContactInfoDialog";

export default function ContactPage() {
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  // Query hooks
  const {
    data: contactInfo,
    isLoading: infoLoading,
    error: infoError,
  } = useContactInfo();
  const {
    data: contactContent,
    isLoading: contentLoading,
    error: contentError,
  } = useContactContent();

  // Mutation hooks
  const updateContactInfo = useUpdateContactInfo();
  const updateContactContent = useUpdateContactContent();

  const onContentSubmit = async (data: ContactContent) => {
    try {
      await updateContactContent.mutateAsync(data);
      setIsContentDialogOpen(false);
    } catch (error) {
      console.error("Failed to save contact content:", error);
      alert("Failed to save contact content");
    }
  };

  const onInfoSubmit = async (data: ContactInfo) => {
    try {
      await updateContactInfo.mutateAsync(data);
      setIsInfoDialogOpen(false);
    } catch (error) {
      console.error("Failed to save contact info:", error);
      alert("Failed to save contact info");
    }
  };

  const handleContentDialogOpenChange = (open: boolean) => {
    setIsContentDialogOpen(open);
  };

  const handleInfoDialogOpenChange = (open: boolean) => {
    setIsInfoDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage contact section content and contact information
          </p>
        </div>
      </div>

      {/* Section Content Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Section Content</CardTitle>
              <CardDescription>
                Manage the title and description for the Contact section
              </CardDescription>
            </div>
            <ContactContentDialog
              open={isContentDialogOpen}
              onOpenChange={handleContentDialogOpenChange}
              content={contactContent || null}
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
          {contentLoading ? (
            <div className="text-center py-4">Loading content...</div>
          ) : contentError ? (
            <div className="text-center py-4">
              <p className="text-destructive font-medium mb-2">
                Failed to load section content
              </p>
              <p className="text-sm text-muted-foreground">
                {contentError instanceof Error
                  ? contentError.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : contactContent ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 1 (English)
                </h3>
                <p className="text-lg">
                  {contactContent.contact_section_title_part_1}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 2 (English)
                </h3>
                <p className="text-lg">
                  {contactContent.contact_section_title_part_2}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 1 (Indonesian)
                </h3>
                <p className="text-lg">
                  {contactContent.contact_section_title_part_1_id}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 2 (Indonesian)
                </h3>
                <p className="text-lg">
                  {contactContent.contact_section_title_part_2_id}
                </p>
              </div>
              {contactContent.contact_section_description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (English)
                  </h3>
                  <p className="text-sm">
                    {contactContent.contact_section_description}
                  </p>
                </div>
              )}
              {contactContent.contact_section_description_id && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (Indonesian)
                  </h3>
                  <p className="text-sm">
                    {contactContent.contact_section_description_id}
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

      {/* Contact Info Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Manage contact details displayed on the website
              </CardDescription>
            </div>
            <ContactInfoDialog
              open={isInfoDialogOpen}
              onOpenChange={handleInfoDialogOpenChange}
              contactInfo={contactInfo || null}
              onSubmit={onInfoSubmit}
              trigger={
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Contact Info
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {infoLoading ? (
            <div className="text-center py-4">Loading contact info...</div>
          ) : infoError ? (
            <div className="text-center py-4">
              <p className="text-destructive font-medium mb-2">
                Failed to load contact information
              </p>
              <p className="text-sm text-muted-foreground">
                {infoError instanceof Error
                  ? infoError.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : contactInfo ? (
            <div className="space-y-6">
              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Address</h3>
                </div>
                <div className="ml-7 space-y-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">English</p>
                      <p>{contactInfo.address_part_1}</p>
                      <p>{contactInfo.address_part_2}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Indonesian
                      </p>
                      <p>{contactInfo.address_part_1_id}</p>
                      <p>{contactInfo.address_part_2_id}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {contactInfo.latitude}, {contactInfo.longitude}
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              {contactInfo.phones && contactInfo.phones.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Phone Numbers</h3>
                  </div>
                  <div className="ml-7 space-y-1">
                    {contactInfo.phones.map((phone, index) => (
                      <p key={index} className="text-sm">
                        {phone}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Addresses */}
              {contactInfo.emails && contactInfo.emails.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Email Addresses</h3>
                  </div>
                  <div className="ml-7 space-y-1">
                    {contactInfo.emails.map((email, index) => (
                      <p key={index} className="text-sm">
                        {email}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {contactInfo.social_media &&
                contactInfo.social_media.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Social Media</h3>
                    </div>
                    <div className="ml-7 space-y-3">
                      {contactInfo.social_media.map((social, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <img
                              src={social.icon_url}
                              alt={social.name}
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{social.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {social.handle}
                            </p>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {social.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Plan Your Visit URL */}
              {contactInfo.plan_your_visit_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Plan Your Visit URL</h3>
                  </div>
                  <div className="ml-7">
                    <a
                      href={contactInfo.plan_your_visit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {contactInfo.plan_your_visit_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No contact information found. Click "Edit Contact Info" to add
              information.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
