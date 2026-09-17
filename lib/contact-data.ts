import {
  ContactFormData,
  ContactSubmissionResult,
  ContactTopic,
  ContactTopicId,
} from "@/types";

export const CONTACT_TOPICS: ContactTopic[] = [
  {
    id: "order-inquiry",
    label: "Order Status & Delivery",
    description: "Track an existing order, update delivery address, or time window.",
    badge: "Fastest response (under 2 hrs)",
    requiresOrderId: true,
  },
  {
    id: "custom-florals",
    label: "Custom Floral Design",
    description: "Weddings, private dinner centerpieces, or large installations.",
    badge: "Consultation available",
  },
  {
    id: "care-advice",
    label: "Botanical Care & Longevity",
    description: "Plant troubleshooting, flower food questions, and vase life tips.",
    badge: "Florist tips",
  },
  {
    id: "general-support",
    label: "General Support & Studio Visits",
    description: "Gift cards, billing, workshop inquiries, or studio flower bar visits.",
    badge: "General inquiry",
  },
  {
    id: "corporate-gifting",
    label: "Corporate & Recurring Accounts",
    description: "Weekly office arrangements, client appreciation, and bulk orders.",
    badge: "Dedicated liaison",
  },
];

export const INITIAL_CONTACT_FORM: ContactFormData = {
  topic: "order-inquiry",
  name: "",
  email: "",
  phone: "",
  orderId: "",
  subject: "",
  message: "",
  preferredMethod: "email",
};

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  orderId?: string;
  subject?: string;
  message?: string;
}

export function validateContactForm(form: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your full name.";
  }

  if (!form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (form.phone.trim() && !/^[0-9+()-\s.]{7,}$/.test(form.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!form.subject.trim()) {
    errors.subject = "Please enter a brief subject for your message.";
  }

  if (!form.message.trim()) {
    errors.message = "Please enter your message or question.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  return errors;
}

export async function submitContactInquiry(
  form: ContactFormData
): Promise<ContactSubmissionResult> {
  // Simulate network processing
  await new Promise((resolve) => setTimeout(resolve, 600));

  const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `STEM-${randomTicketNum}-${form.topic.substring(0, 3).toUpperCase()}`;

  return {
    ticketId,
    submittedAt: new Date().toISOString(),
    estimatedResponse:
      form.topic === "order-inquiry"
        ? "Within 1 to 2 daylight hours"
        : "Within 2 to 4 daylight hours",
    data: form,
  };
}

export const STUDIO_CONTACT_DETAILS = {
  phone: "(503) 555-0142",
  phoneRaw: "+15035550142",
  email: "hello@bloomstem.com",
  urgentOrdersEmail: "courier@bloomstem.com",
  address: "128 Botanical Way",
  cityStateZip: "Portland, OR 97205",
  neighborhood: "Northwest District / Alphabet Historic District",
  hours: [
    { days: "Monday – Friday", hours: "9:00 AM – 6:00 PM PST" },
    { days: "Saturday", hours: "9:00 AM – 5:00 PM PST" },
    { days: "Sunday", hours: "10:00 AM – 4:00 PM PST" },
  ],
  liveFloristHours: "Mon–Sat: 9am–6pm • Sun: 10am–4pm PST",
};
