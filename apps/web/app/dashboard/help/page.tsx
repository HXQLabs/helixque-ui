"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Input } from "@workspace/ui/components/input";
import {
  Search,
  HelpCircle,
  FileText,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

const FAQS = [
  {
    question: "How does the matching algorithm work?",
    answer:
      "Our matching algorithm uses a combination of your profile skills, interests, and availability to find the most compatible mentors or peers. We prioritize matching you with individuals who have complementary skills and are in similar time zones.",
  },
  {
    question: "Is Helixque free to use?",
    answer:
      "Yes, the basic features of Helixque, including peer matching and community access, are free. We offer a Pro plan for advanced features like unlimited skips, priority support, and access to exclusive mentor sessions.",
  },
  {
    question: "Can I be both a mentor and a mentee?",
    answer:
      "Absolutely! We encourage users to both learn and share their knowledge. you can set your profile to 'Open to Mentoring' while also seeking mentorship in other areas.",
  },
  {
    question: "How do I report inappropriate behavior?",
    answer:
      "We take safety seriously. You can report any user directly from the chat interface or their profile page. Our trust and safety team reviews all reports within 24 hours.",
  },
  {
    question: "Can I cancel my Pro subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time from the Billing settings page. Your benefits will continue until the end of the current billing cycle.",
  },
];

export default function HelpPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Resources");
    setActiveSubSection("Help Center");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Hero Search */}
      <div className="bg-muted/30 py-16 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            className="pl-10 h-12 bg-background shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 space-y-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer text-center">
            <CardContent className="pt-6 flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Guides and API docs
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer text-center">
            <CardContent className="pt-6 flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Community Support</h3>
              <p className="text-sm text-muted-foreground">Ask the forum</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer text-center">
            <CardContent className="pt-6 flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Contact Us</h3>
              <p className="text-sm text-muted-foreground">Email support</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4 bg-card">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between font-medium list-none">
                    {faq.question}
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-muted/30 rounded-xl p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold">Still need help?</h3>
          <p className="text-muted-foreground">
            Our support team is available 24/7 to assist you with any issues.
          </p>
          <Button>Contact Support</Button>
        </div>
      </div>
    </div>
  );
}
