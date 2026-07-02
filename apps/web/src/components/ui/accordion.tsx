import * as React from "react"
import { LuChevronDown } from "react-icons/lu"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value?: string | string[];
  onValueChange?: (val: string) => void;
  type?: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue>({});

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple";
    value?: string | string[];
    onValueChange?: (val: any) => void;
    defaultValue?: string | string[];
  }
>(({ className, type = "single", value, onValueChange, defaultValue, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === "multiple" ? [] : "")
  );

  const activeValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      let newValue: string | string[];
      if (type === "single") {
        newValue = activeValue === itemValue ? "" : itemValue;
      } else {
        const arr = Array.isArray(activeValue) ? activeValue : [];
        newValue = arr.includes(itemValue)
          ? arr.filter((v) => v !== itemValue)
          : [...arr, itemValue];
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [activeValue, type, value, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleValueChange,
        type,
      }}
    >
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </AccordionContext.Provider>
  );
});
Accordion.displayName = "Accordion";

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        ref={ref}
        className={cn("border border-border/80 rounded-2xl overflow-hidden bg-secondary/5 shadow-sm", className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { value: activeValue, onValueChange } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);

  const isOpen = Array.isArray(activeValue)
    ? activeValue.includes(value)
    : activeValue === value;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange?.(value)}
      className={cn(
        "flex w-full items-center justify-between p-4 font-bold text-xs text-foreground bg-secondary/10 hover:bg-secondary/20 transition-all border-none outline-none cursor-pointer text-left",
        className
      )}
      {...props}
    >
      {children}
      <LuChevronDown
        className={cn(
          "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value: activeValue } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);

  const isOpen = Array.isArray(activeValue)
    ? activeValue.includes(value)
    : activeValue === value;

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "p-4 border-t border-border/60 bg-background/50 animate-in slide-in-from-top-2 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
export default Accordion;
