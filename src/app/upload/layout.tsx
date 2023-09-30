import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload',
  description: 'compress image',
};

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
