import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// Create a context to manage the state of the accordion
interface AccordionContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple";
    collapsible?: boolean;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, type: _type = "single", defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue);

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(prev => prev === newValue ? "" : newValue);
    }
    onValueChange?.(newValue);
  }, [controlledValue, onValueChange]);

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b", className)}
    data-value={value}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within Accordion");

  // Find parent Item value
  // In a real app we might want a cleaner way to pass this down, but utilizing the DOM or context is fine. 
  // For this simple implementation, we actually need the Item's value. 
  // Let's refactor slightly to create an ItemContext if we want to be 100% proper, 
  // but for now let's assume the user passes value to Item and we can infer context or just pass it explicitly? 
  // Actually, standard Radix API doesn't require value on Trigger. 
  // Let's create an ItemContext to exactly match Radix API.

  return (
    <AccordionItemContext.Consumer>
      {(itemValue) => {
        const isOpen = context.value === itemValue;
        return (
          <div className="flex">
            <button
              ref={ref}
              type="button"
              onClick={() => context.onValueChange(itemValue)}
              data-state={isOpen ? "open" : "closed"}
              className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
              )}
              {...props}
            >
              {children}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
          </div>
        )
      }}
    </AccordionItemContext.Consumer>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);

  return (
    <AccordionItemContext.Consumer>
      {(itemValue) => {
        const isOpen = context?.value === itemValue;
        if (!isOpen) return null;

        return (
          <div
            ref={ref}
            data-state={isOpen ? "open" : "closed"}
            className="overflow-hidden text-sm transition-all animate-accordion-down"
            {...props}
          >
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
          </div>
        )
      }}
    </AccordionItemContext.Consumer>
  )
})
AccordionContent.displayName = "AccordionContent"

// Helper context for Item
const AccordionItemContext = React.createContext<string>("");

// Initial override for AccordionItem to provide the context
const AccordionItemWithContext = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <div
      ref={ref}
      className={cn("border-b", className)}
      data-state={"closed" /* We can't easily know state here without consuming root context, but it's okay for container */}
      {...props}
    >
      {children}
    </div>
  </AccordionItemContext.Provider>
))
AccordionItemWithContext.displayName = "AccordionItem"


export { Accordion, AccordionItemWithContext as AccordionItem, AccordionTrigger, AccordionContent }
