"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Check, CreditCard, Download, Zap } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";


const INVOICES = [
  {
    invoice: "INV001",
    status: "Paid",
    amount: "$29.00",
    date: "Dec 10, 2025",
    method: "Credit Card",
  },
  {
    invoice: "INV002",
    status: "Paid",
    amount: "$29.00",
    date: "Nov 10, 2025",
    method: "Credit Card",
  },
  {
    invoice: "INV003",
    status: "Paid",
    amount: "$29.00",
    date: "Oct 10, 2025",
    method: "Credit Card",
  },
];

export default function BillingPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Account");
    setActiveSubSection("Billing");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription and billing history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         {/* Current Plan */}
         <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
               <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                       <Zap className="h-5 w-5" /> Pro Plan
                    </CardTitle>
                    <CardDescription>You are on the Pro plan.</CardDescription>
                  </div>
                  <Badge className="bg-primary">Active</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Unlimited Video Focus Modes</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Priority Matching</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Advanced Filters</div>
               </div>
            </CardContent>
            <CardFooter>
               <Button variant="default" className="w-full">Manage Subscription</Button>
            </CardFooter>
         </Card>

         {/* Payment Method */}
         <Card>
            <CardHeader>
               <CardTitle>Payment Method</CardTitle>
               <CardDescription>Manage your payment details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <CreditCard className="h-6 w-6" />
                  <div className="flex-1">
                     <p className="font-medium">Visa ending in 4242</p>
                     <p className="text-sm text-muted-foreground">Expires 12/2028</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Invoice History */}
      <Card>
         <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Download past invoices.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {/* Header */}
               <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Invoice</div>
                  <div>Status</div>
                  <div>Amount</div>
                  <div>Date</div>
                  <div className="text-right">Action</div>
               </div>
               
               {/* Rows */}
               <div className="space-y-4">
                  {INVOICES.map((invoice) => (
                    <div key={invoice.invoice} className="grid grid-cols-5 items-center text-sm">
                       <div className="font-medium">{invoice.invoice}</div>
                       <div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{invoice.status}</Badge>
                       </div>
                       <div>{invoice.amount}</div>
                       <div>{invoice.date}</div>
                       <div className="text-right">
                          <Button variant="ghost" size="sm">
                             <Download className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
