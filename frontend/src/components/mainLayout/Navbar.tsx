"use client";

import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link
                        href="/todos"
                        onClick={() => router.push("/todos")}
                        passHref
                    >
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            To Do's
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href="/addToDo"
                        onClick={() => router.push("/addToDo")}
                        passHref
                    >
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Add To Do
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

