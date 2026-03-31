// Consistent page container wrapping all module pages
// Provides the standard page layout with padding and max-width
// Mobile: p-3 (reduced padding on small screens). Desktop: p-6.

export default function PageWrapper({ children }) {
  return (
    <div className="p-3 md:p-6 max-w-4xl mx-auto space-y-6 w-full">
      {children}
    </div>
  );
}
