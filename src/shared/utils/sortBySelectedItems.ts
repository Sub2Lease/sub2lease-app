interface sortBySelectedItemsProps<T> {
  items: T[];
  itemsOrder: Record<string, number>;
  itemSelector: keyof T;
  addToEnd?: boolean;
}

export function sortBySelectedItems<T>({ items, itemsOrder, itemSelector, addToEnd }: sortBySelectedItemsProps<T>) {
  const selectedItems: Array<T> = Array(Object.keys(itemsOrder).length);
  const otherItems: T[] = [];

  items.forEach((item) => {
    const selectedIndex = itemsOrder[item[itemSelector] as string];

    if (selectedIndex !== undefined) {
      selectedItems[selectedIndex] = item;
    } else {
      otherItems.push(item);
    }
  });

  if (addToEnd) {
    return [...otherItems, ...(selectedItems.filter(Boolean) as T[])];
  }

  return [...(selectedItems.filter(Boolean) as T[]), ...otherItems];
}
