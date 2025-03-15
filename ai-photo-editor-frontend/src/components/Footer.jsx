function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white p-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} RuestiAI</p>
        <p className="text-gray-400 text-xs mt-1">
          This application uses Gemini AI for image generation and editing
        </p>
      </div>
    </footer>
  );
}

export default Footer;