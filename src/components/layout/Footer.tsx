import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-5 text-center text-base text-gray-500">
          &copy; {new Date().getFullYear()} SentimentHub. All rights reserved.
        </p>
        <p className="mt-2 text-center text-sm text-gray-400">
          Powered by advanced sentiment analysis and machine learning.
        </p>
      </div>
    </footer>
  );
};

export default Footer;