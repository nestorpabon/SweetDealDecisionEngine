// Consistent page container wrapping all module pages
// Provides the standard page layout with padding and max-width

export default function PageWrapper({ children }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 w-full">
      {children}
    </div>
  );
}
