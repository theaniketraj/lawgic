"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/icons/icons";

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MainMobileNav({ isOpen }: Readonly<MobileMenuProps>) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState("");

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? "" : key);
  };

  const getNavCardStyles = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return { icon: "fa-home", color: "bg-[#2D0B70] text-white" };
      case "chat":
        return { icon: "fa-comments", color: "bg-primary-500 text-white" };
      case "docs":
        return { icon: "fa-book", color: "benefits-bg text-white" };
      case "about":
        return { icon: "fa-info-circle", color: "bg-[#2D0B70] text-white" };
      case "team":
        return { icon: "fa-users", color: "bg-primary-500 text-white" };
      default:
        return { icon: "fa-link", color: "bg-gray-800 text-white" };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden h-screen absolute top-full left-0 bg-white dark:bg-dark-primary w-full border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex flex-col justify-between h-full pb-20">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
              Menu
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {navItems.map((item) => {
                if (item.type === "link") {
                  const { icon, color } = getNavCardStyles(item.label);
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex flex-col p-5 rounded-2xl transition-all duration-300 hover:shadow-xl relative overflow-hidden group border border-white/10",
                        color,
                        isActive ? "ring-2 ring-white/50 shadow-lg scale-[1.02]" : "hover:-translate-y-1 hover:scale-[1.02]"
                      )}
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-md mb-3 shadow-sm border border-white/30 text-white">
                          <i className={`fas ${icon} text-lg`}></i>
                        </div>
                        <span className="font-semibold text-white">
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                }

                if (item.type === "dropdown") {
                  return (
                    <div key={item.label} className="col-span-2 mt-2">
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={cn(
                          "flex justify-between items-center w-full px-4 py-3 rounded-xl border font-medium transition-colors",
                          "bg-gray-50 dark:bg-dark-secondary border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
                          {
                            "border-primary-500/50 text-primary-500 bg-primary-500/5": (
                              item as unknown as {
                                items: { href: string; label: string }[];
                              }
                            ).items.some((subItem) =>
                              pathname.includes(subItem.href),
                            ),
                          },
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <i className="fas fa-layer-group text-gray-400"></i>
                          <span>{item.label}</span>
                        </div>
                        <span
                          className={cn(
                            "size-4 transition-transform duration-200 flex items-center justify-center",
                            activeDropdown === item.label && "rotate-180",
                          )}
                        >
                          <ChevronDownIcon />
                        </span>
                      </button>

                      {activeDropdown === item.label && (
                        <div className="mt-2 grid grid-cols-2 gap-2 pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-4">
                          {(
                            item as unknown as {
                              items: { href: string; label: string }[];
                            }
                          ).items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center px-3 py-2.5 gap-2 rounded-xl text-sm font-medium transition-colors",
                                "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                                {
                                  "bg-primary-500/10 text-primary-600 dark:text-primary-400":
                                    pathname.includes(subItem.href),
                                },
                              )}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
