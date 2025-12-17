


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Excalidraw Board
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light">
            Your minimalist workspace for organizing thoughts, ideas, and notes
          </p>
          <button
            onClick={() => router.push('/board')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-medium border-2 border-white rounded-xl hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto">
          <div className="border-2 border-white rounded-3xl p-8 bg-gray-900 hover:bg-gray-800 transition-colors">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-3">Simple & Clean</h3>
            <p className="text-gray-400">
              A distraction-free interface that lets you focus on what matters most - your ideas.
            </p>
          </div>

          <div className="border-2 border-white rounded-3xl p-8 bg-gray-900 hover:bg-gray-800 transition-colors">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-2xl font-semibold mb-3">Auto-Save</h3>
            <p className="text-gray-400">
              Everything is automatically saved to your browser. Never lose your work again.
            </p>
          </div>

          <div className="border-2 border-white rounded-3xl p-8 bg-gray-900 hover:bg-gray-800 transition-colors">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-semibold mb-3">Organize</h3>
            <p className="text-gray-400">
              Create multiple boards and boxes to keep your notes perfectly organized.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="border-2 border-white rounded-3xl p-12 bg-gray-900">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Create Boards</h4>
                  <p className="text-gray-400">Organize your work into different boards for projects, ideas, or topics.</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Add Boxes</h4>
                  <p className="text-gray-400">Create boxes within each board to break down your thoughts into manageable pieces.</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Write & Edit</h4>
                  <p className="text-gray-400">Click any box to open it full-screen and write as much as you need.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get organized?</h2>
          <p className="text-xl text-gray-400 mb-8">Start creating your boards now. No signup required.</p>
          <button
            onClick={() => router.push('/board')}
            className="inline-flex items-center gap-3 px-10 py-5 text-xl font-medium bg-white text-black rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
          >
            Launch App
            <span>🚀</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-32 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}