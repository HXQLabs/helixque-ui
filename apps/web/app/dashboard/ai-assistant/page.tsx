"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  Sparkles, 
  MoreVertical,
  Code2,
  Terminal,
  Cpu,
  RefreshCw,
  Copy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
// import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code';
  timestamp: Date;
}

import { useNavigation } from "@/contexts/navigation-context";

function AiAssistantContent() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Connect");
    setActiveSubSection("AI Assistant");
  }, [setActiveSection, setActiveSubSection]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial message on client mount to avoid hydration mismatch with dates
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your Helixque AI Assistant. I can help you with code review, career advice, or finding the right mentor. How can I assist you today?",
        type: 'text',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm analyzing your request... Here is a sample code snippet that might help you:",
        type: 'text',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
      
      setTimeout(() => {
         const codeMsg: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `function optimizeMatch(users) {
  return users.filter(u => u.status === 'online')
              .sort((a, b) => b.score - a.score);
}`,
            type: 'code',
            timestamp: new Date()
         };
         setMessages(prev => [...prev, codeMsg]);
         setIsTyping(false);
      }, 1000);

    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar Mock */}
      <div className="w-[280px] border-r border-border hidden md:flex flex-col bg-muted/10 backdrop-blur-sm">
         <div className="p-4 flex items-center gap-2 border-b border-border/50">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
               <Bot className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold">History</span>
         </div>
         <div className="flex-1 p-3 overflow-y-auto">
            <div className="space-y-2">
               {["React Optimization", "Career Path Advice", "System Design Interview"].map((topic, i) => (
                 <Button key={i} variant="ghost" className="w-full justify-start text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 truncate">
                    <MessageCircleIcon className="mr-2 h-4 w-4 opacity-50" />
                    {topic}
                 </Button>
               ))}
            </div>
         </div>
         <div className="p-4 border-t border-border/50">
            <Button variant="outline" className="w-full gap-2">
               <RefreshCw className="h-4 w-4" /> New Chat
            </Button>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-background to-muted/20">
         {/* Header */}
         <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 relative flex items-center justify-center bg-primary/10 rounded-lg">
                  <Image src="https://www.helixque.com/logo.svg" alt="Helixque" width={24} height={24} />
               </div>
               <div className="flex flex-col">
                  <span className="font-semibold flex items-center gap-2">
                     Helixque AI <Badge variant="secondary" className="text-[10px] h-5 px-1.5">BETA</Badge>
                  </span>
                  <span className="text-xs text-muted-foreground">Always here to help</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
               </Button>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
               {messages.map((msg) => (
                 <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                 >
                    <Avatar className={cn("h-9 w-9 border", msg.role === 'user' ? "bg-muted" : "bg-primary/10")}>
                       {msg.role === 'user' ? (
                          <AvatarImage src="https://github.com/shadcn.png" />
                       ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 p-1.5">
                              <Image src="https://www.helixque.com/logo.svg" alt="AI" width={24} height={24} className="w-full h-full object-contain" />
                          </div>
                       )}
                       <AvatarFallback>{msg.role === 'user' ? "Me" : "AI"}</AvatarFallback>
                    </Avatar>

                    <div className={cn(
                       "flex flex-col gap-1 max-w-[80%]",
                       msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                       <div className={cn(
                          "rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
                          msg.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-card border border-border rounded-tl-none"
                       )}>
                          {msg.type === 'code' ? (
                             <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2 mb-2">
                                   <div className="flex items-center gap-1.5">
                                      <Terminal className="h-3 w-3" />
                                      <span>JavaScript</span>
                                   </div>
                                   <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(msg.content)}>
                                      <Copy className="h-3 w-3" />
                                   </Button>
                                </div>
                                <pre className="font-mono text-xs overflow-x-auto bg-muted/50 p-2 rounded-md">
                                  <code>{msg.content}</code>
                                </pre>
                             </div>
                          ) : (
                             <p>{msg.content}</p>
                          )}
                       </div>
                       <span className="text-[10px] text-muted-foreground px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                 </div>
               ))}
               
               {isTyping && (
                 <div className="flex gap-4 animate-pulse">
                    <Avatar className="h-9 w-9 bg-primary/10 border p-1.5">
                        <Image src="https://www.helixque.com/logo.svg" alt="AI" width={24} height={24} className="w-full h-full object-contain" />
                    </Avatar>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 h-[46px]">
                       <div className="h-2 w-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="h-2 w-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="h-2 w-2 bg-foreground/30 rounded-full animate-bounce" />
                    </div>
                 </div>
               )}
               <div ref={scrollRef} />
            </div>
         </div>

         {/* Input Area */}
         <div className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
            <div className="max-w-3xl mx-auto relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
               <form 
                 onSubmit={handleSendMessage}
                 className="relative flex items-center bg-background rounded-xl border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-primary shadow-sm overflow-hidden p-1.5"
               >
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                              <Paperclip className="h-5 w-5" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach file</TooltipContent>
                     </Tooltip>
                  </TooltipProvider>

                  <Input 
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Ask anything..."
                     className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent py-2.5 h-auto text-base"
                  />
                  
                  <Button 
                     type="submit" 
                     className="h-9 w-9 shrink-0 rounded-lg transition-all" 
                     size="icon"
                     disabled={!inputValue.trim()}
                  >
                     <Send className="h-4 w-4" />
                  </Button>
               </form>
               <div className="text-center mt-2.5">
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
                     <Cpu className="h-3 w-3" />
                     <span>Powered by Helixque Engine v2.0</span>
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default function AiAssistantPage() {
  return (
    <React.Suspense fallback={<div>Loading AI Assistant...</div>}>
      <AiAssistantContent />
    </React.Suspense>
  );
}

function Badge({ children, variant, className }: any) {
    return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className, 
        variant === 'secondary' ? "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground"
    )}>{children}</span>
}

function MessageCircleIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
}
