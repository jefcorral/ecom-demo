export type ContactTopicId =
  | "order-inquiry"
  | "custom-florals"
  | "care-advice"
  | "general-support"
  | "corporate-gifting";

export interface ContactTopic {
  id: ContactTopicId;
  label: string;
  description: string;
  badge: string;
  requiresOrderId?: boolean;
}

export interface ContactFormData {
  topic: ContactTopicId;
  name: string;
  email: string;
  phone: string;
  orderId: string;
  subject: string;
  message: string;
  preferredMethod: "email" | "phone";
}

export interface ContactSubmissionResult {
  ticketId: string;
  submittedAt: string;
  estimatedResponse: string;
  data: ContactFormData;
}
