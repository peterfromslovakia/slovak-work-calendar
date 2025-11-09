export const tailwindColorToHex = (tailwindColor: string): string => {
    const colorMap: Record<string, string> = {
        'bg-blue-500': '#3b82f6',
        'bg-green-500': '#22c55e',
        'bg-orange-500': '#f97316',
        'bg-purple-500': '#8b5cf6',
        'bg-pink-500': '#ec4899',
        'bg-teal-500': '#14b8a6',
        'bg-red-500': '#ef4444',
        'bg-indigo-500': '#6366f1',
        'bg-yellow-400': '#facc15',
        'bg-gray-400': '#9ca3af',
    };
    return colorMap[tailwindColor] || '#6b7280'; // default to gray-500
};
