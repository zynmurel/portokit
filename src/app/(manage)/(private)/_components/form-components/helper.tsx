export type CarouselImage = {
  src: string;
  alt: string;
  isMain?: boolean;
};

export const cleanDescription = (description: string | undefined) => {
  return (
    description
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n") || ""
  );
};

export const cleanTools = (tools: string | undefined) => {
  return (
    tools
      ?.split(",")
      .map((tool) => tool.trim())
      .filter((tool) => tool !== "")
      .join(",") || ""
  );
};

export function buildImages(field: {
  mainImage?: File;
  title: string;
  images?: { id: string; file: File; name: string }[];
}): CarouselImage[] {
  const list: CarouselImage[] = [];
  if (field.mainImage) {
    list.push({
      src: URL.createObjectURL(field.mainImage),
      alt: field.title,
      isMain: true,
    });
  }
  field.images?.forEach((img) => {
    list.push({ src: URL.createObjectURL(img.file), alt: img.name });
  });
  return list;
}
