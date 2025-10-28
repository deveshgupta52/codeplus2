

import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // Base colors applied here
    <div className="w-full bg-background bg-cover bg-center min-h-screen p-2 ">
      <Navbar />
      <main className=" ">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;

