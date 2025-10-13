import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // Base colors applied here
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;