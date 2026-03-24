"use client";

import { createContext, useContext, useState, useRef, useCallback, useMemo, type ReactNode } from "react";
import type { PortfolioCategory } from "@/types/portfolio.types";

interface FilterBarContextValue {
	categories: PortfolioCategory[];
	categoryCounts: Record<string, number>;
	selectedCategory: string;
	filterBarDocked: boolean;
	setCategories: (cats: PortfolioCategory[]) => void;
	setCategoryCounts: (counts: Record<string, number>) => void;
	setSelectedCategory: (slug: string) => void;
	setFilterBarDocked: (docked: boolean) => void;
	onCategoryChange: (slug: string) => void;
	setOnCategoryChange: (fn: ((slug: string) => void) | null) => void;
}

const FilterBarContext = createContext<FilterBarContextValue | null>(null);

export function FilterBarProvider({ children }: { children: ReactNode }) {
	const [categories, setCategories] = useState<PortfolioCategory[]>([]);
	const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [filterBarDocked, setFilterBarDocked] = useState(false);
	const onCategoryChangeRef = useRef<((slug: string) => void) | null>(null);

	const setOnCategoryChange = useCallback((fn: ((slug: string) => void) | null) => {
		onCategoryChangeRef.current = fn;
	}, []);

	const onCategoryChange = useCallback((slug: string) => {
		onCategoryChangeRef.current?.(slug);
	}, []);

	const value = useMemo<FilterBarContextValue>(
		() => ({
			categories,
			categoryCounts,
			selectedCategory,
			filterBarDocked,
			setCategories,
			setCategoryCounts,
			setSelectedCategory,
			setFilterBarDocked,
			onCategoryChange,
			setOnCategoryChange,
		}),
		[categories, categoryCounts, selectedCategory, filterBarDocked, onCategoryChange, setOnCategoryChange]
	);

	return (
		<FilterBarContext.Provider value={value}>
			{children}
		</FilterBarContext.Provider>
	);
}

export function useFilterBar() {
	const ctx = useContext(FilterBarContext);
	if (!ctx) throw new Error("useFilterBar must be used within FilterBarProvider");
	return ctx;
}
