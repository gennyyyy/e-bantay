import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HelpCenter() {
  const faqs = [
    { question: "How do I report an incident?", answer: "Go to the 'File Report' page, pinpoint the location on the map, fill in the incident details such as type and description, and click Submit." },
    { question: "Is my identity anonymous?", answer: "Yes, you can choose to submit reports anonymously. However, providing your contact details helps authorities verify the incident faster." },
    { question: "What happens after I submit a report?", answer: "Your report is forwarded to the Barangay Operations Center. An officer will review it and dispatch assistance if necessary." },
    { question: "Can I edit a report?", answer: "Once submitted, reports cannot be edited to preserve the integrity of the data. Please file a new report or contact support if you made a mistake." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">How can we help?</h1>
        <p className="text-slate-500 dark:text-slate-400">Find answers to common questions or get in touch with our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="h-12 w-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mt-4 dark:text-white">Emergency Hotline</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">911</p>
          </CardContent>
        </Card>
        <Card className="text-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="h-12 w-12 mx-auto rounded-full bg-green-50 dark:bg-green-950/50 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
              <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mt-4 dark:text-white">Barangay Hall</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">(044) 123-4567</p>
          </CardContent>
        </Card>
        <Card className="text-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="h-12 w-12 mx-auto rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
              <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mt-4 dark:text-white">Email Support</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">support@ebantay.ph</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <HelpCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-6 last:border-0 dark:border-slate-700">
              <AccordionTrigger className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="flex justify-center pt-8">
        <Button size="lg" className="bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600">
          Contact Support Team
        </Button>
      </div>
    </div>
  );
}