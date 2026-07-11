export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="animate-slide-in-left flex-1 flex flex-col">{children}</div>;
}
