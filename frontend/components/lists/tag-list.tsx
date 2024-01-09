/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { TagForm } from "../forms/tag-form";
import { DeleteTag } from "../dialogs/delete-tag";
import { Button } from "@/components/ui/button";
import { TagIcon } from "lucide-react";
import { TagWithId } from "@/app/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTagStore } from "@/store/useTagStore";
import throttle from "lodash.throttle";

type Props = {
  tags: TagWithId[];
};

export function TagList({ tags }: Props) {
  const pathname = usePathname();

  const { tags: _tags, setTags } = useTagStore((state) => state);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeTagRef = useRef<HTMLDivElement | null>(null);
  const isScrollingToActiveTagRef = useRef<boolean>(true);

  const [intersectionRatio, setIntersectionRatio] = useState<
    Record<string, number>
  >({});
  const [intersectingTags, setIntersectingTags] = useState<string[]>([]);

  useEffect(() => {
    setTags(tags);
  }, [tags]);

  useEffect(() => {
    if (activeTagRef.current && isScrollingToActiveTagRef.current) {
      activeTagRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      isScrollingToActiveTagRef.current = false;
    }
  }, [intersectingTags]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) return;

    const observer = new IntersectionObserver(
      throttle((entries: IntersectionObserverEntry[]) => {
        const ratios: Record<string, number> = entries.reduce((acc, entry) => {
          acc[entry.target.id as string] = entry.intersectionRatio;
          return acc;
        }, {} as Record<string, number>);

        setIntersectionRatio(ratios);

        const tagsInView = entries
          .filter(
            (entry) => entry.isIntersecting && entry.intersectionRatio < 1
          )
          .map((entry) => entry.target.id);

        setIntersectingTags(tagsInView);
      }, 100), // Throttle to 100ms
      { threshold: [0, 1] } // Observe at 0%, 50%, and 100% visibility
    );

    // Observe all tag elements at once
    scrollArea.querySelectorAll(".fade-tag").forEach((tag) => {
      observer.observe(tag);
    });

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [tags]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">
          Tags ({tags?.length ?? 0})
        </h2>
        <TagForm type="add" />
      </div>
      <ScrollArea
        ref={scrollAreaRef}
        className="flex flex-col flex-grow overflow-y-auto"
      >
        {tags?.map((tag) => (
          <div
            key={tag.name}
            id={tag.name}
            ref={(ref) => {
              if (pathname === `/tags/${tag.id}`) {
                activeTagRef.current = ref;
              }
            }}
            className={`relative mt-1 flex group fade-tag transition-opacity ${
              intersectionRatio[tag.name] < 1 ? "opacity-10" : "opacity-100"
            }`}
          >
            <Link key={tag.name} href={`/tags/${tag.id}`} className="w-full">
              <Button
                className={`flex items-center justify-start w-full gap-3 ${
                  pathname === `/tags/${tag.id}`
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                variant={pathname === `/tags/${tag.id}` ? "secondary" : "ghost"}
              >
                <TagIcon className="w-5 h-5" />
                <p className="max-w-[180px] truncate group-hover:max-w-[130px]">
                  {tag.name}
                </p>
              </Button>
            </Link>

            <div className="absolute right-0 z-50 items-center hidden top-1 group-hover:flex">
              <TagForm
                type="edit"
                tag={{
                  id: tag.id,
                  name: tag.name,
                }}
              />
              <DeleteTag id={tag.id} name={tag.name} />
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
