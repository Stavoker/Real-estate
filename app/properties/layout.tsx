import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties — EasyEstate",
  description:
    "A private marketplace of luxury homes, villas, penthouses, and ateliers in Miami, Austin, and Los Angeles.",
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
