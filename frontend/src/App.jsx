

import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // Base colors applied here
    <div className="w-full bg-[url('./images/bgimg.svg')] bg-cover bg-center min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 ">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
