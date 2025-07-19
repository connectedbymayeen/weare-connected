export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">MyWebsite</h1>
        <div className="space-x-4">
          <a href="#home" className="text-gray-700 hover:text-purple-600">Home</a>
          <a href="#features" className="text-gray-700 hover:text-purple-600">Features</a>
          <a href="#contact" className="text-gray-700 hover:text-purple-600">Contact</a>
        </div>
      </div>
    </nav>
  );
}
