
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BookOpen, Database, Home } from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <NavigationMenu className="max-w-full w-full justify-between">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <BookOpen className="h-4 w-4 mr-2" />
            Sacred Texts
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                title="Quran"
                href="/books/quran"
                description="The Holy Quran with translations, transliterations, and audio"
              />
              <ListItem
                title="Bible"
                href="/books/bible"
                description="Old and New Testament with translations"
              />
              <ListItem
                title="Bhagavad Gita"
                href="/books/gita"
                description="A 700-verse Hindu scripture that is part of the Mahabharata"
              />
              <ListItem
                title="Ramayana"
                href="/books/ramayana"
                description="Ancient Indian epic poem narrating the journey of Rama"
              />
              <ListItem
                title="Torah"
                href="/books/torah"
                description="The first five books of the Hebrew Bible"
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/admin/data-manager">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === "/admin/data-manager" ? "bg-accent" : ""
            )}>
              <Database className="h-4 w-4 mr-2" />
              Data Manager
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    title: string;
    description: string;
  }
>(({ className, title, description, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MainNavigation;
