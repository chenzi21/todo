"use client";

import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    return (
        <NavigationMenu className="min-w-[100%] p-2 flex justify-start items-center bg-[#f8f8f8] shadow shadow-slate-300">
            <NavigationMenuList>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                    <Link
                        href="/todos"
                        onClick={() => router.push("/todos")}
                        passHref
                    >
                        To Do's
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href="/addToDo"
                        onClick={() => {
                            console.log("pressed");
                            router.push("/addToDo");
                        }}
                        passHref
                        className={navigationMenuTriggerStyle()}
                    >
                        Add To Do
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

