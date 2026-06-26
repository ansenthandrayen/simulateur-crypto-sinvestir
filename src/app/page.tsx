import Sidebar from "@/components/Sidebar";

// Page principale - route "/"
// Structure : Sidebar (navigation) + contenu principal
export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
        <h1 className="title-section text-2xl text-text-primary">
          Contenu principal
        </h1>
      </main>
    </div>
  );
}
