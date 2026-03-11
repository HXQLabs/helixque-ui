"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useNavigation } from "@/contexts/navigation-context";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { activeSection, activeSubSection, setActiveSection } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const handleSubItemClick = (
    parentTitle: string,
    subTitle: string,
    url: string,
  ) => {
    setActiveSection(parentTitle, subTitle);
    // If the sub-item has a real route, navigate there
    if (url && url !== "#") {
      router.push(url);
    } else if (pathname !== "/dashboard") {
      // Otherwise navigate back to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.title === activeSection}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={
                          activeSection === item.title &&
                          activeSubSection === subItem.title
                        }
                        onClick={() =>
                          handleSubItemClick(
                            item.title,
                            subItem.title,
                            subItem.url,
                          )
                        }
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
