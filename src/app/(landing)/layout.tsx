import Navbar from "@/components/landing/Navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background-primary">
      <Navbar />
      {children}
    </div>
  );
}
