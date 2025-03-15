import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-indigo-700 dark:from-primary-800 dark:to-indigo-900 
                       text-white p-4 shadow-md bg-gradient-animated">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V3M5.5 8.5L4 7M18.5 8.5L20 7M17 17.8L17.8 21L12 19L6.2 21L7 17.8M7 15C7 11.134 9.13401 8 12 8C14.866 8 17 11.134 17 15H7Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold leading-tight">Collab - Virtual Try-On</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm opacity-75 hidden sm:inline">Powered by RuestiAI</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;