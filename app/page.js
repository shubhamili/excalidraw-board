'use client';

import { useState } from 'react';

export default function Home() {
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: 'board1',
      heading: 'Heading of this boards (board1)',
      boxes: [
        {
          id: 1,
          title: 'title of box',
          content: ['List', 'media', 'text etc']
        },
        {
          id: 2,
          title: 'title of box',
          content: ['List', 'media', 'text etc']
        },
        {
          id: 3,
          title: 'title of box',
          content: ['List', 'media', 'text etc']
        }
      ]
    }
  ]);

  const [selectedBoard, setSelectedBoard] = useState(0);

  const addBoard = () => {
    const newBoard = {
      id: boards.length + 1,
      title: `board${boards.length + 1}`,
      heading: `Heading of this boards (board${boards.length + 1})`,
      boxes: []
    };
    setBoards([...boards, newBoard]);
  };

  const addBox = () => {
    const updatedBoards = [...boards];
    const newBox = {
      id: updatedBoards[selectedBoard].boxes.length + 1,
      title: 'title of box',
      content: ['List', 'media', 'text etc']
    };
    updatedBoards[selectedBoard].boxes.push(newBox);
    setBoards(updatedBoards);
  };

  const updateBoardHeading = (value) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].heading = value;
    setBoards(updatedBoards);
  };

  const updateBoxTitle = (boxIndex, value) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].boxes[boxIndex].title = value;
    setBoards(updatedBoards);
  };

  const updateBoxContent = (boxIndex, contentIndex, value) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].boxes[boxIndex].content[contentIndex] = value;
    setBoards(updatedBoards);
  };

  const addContentLine = (boxIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].boxes[boxIndex].content.push('new item');
    setBoards(updatedBoards);
  };

  const deleteBox = (boxIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].boxes.splice(boxIndex, 1);
    setBoards(updatedBoards);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 border-2 border-white rounded-3xl p-6 h-fit">
            <h2 className="text-2xl mb-6 font-light">List of Content</h2>
            <div className="space-y-2">
              {boards.map((board, index) => (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoard(index)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedBoard === index
                    ? 'bg-white text-black'
                    : 'hover:bg-gray-800'
                    }`}
                >
                  {index + 1}. {board.title}
                </button>
              ))}
              <button
                onClick={addBoard}
                className="w-full text-left px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                + Add Board
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 border-2 border-white rounded-3xl p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <input
                type="text"
                value={boards[selectedBoard].heading}
                onChange={(e) => updateBoardHeading(e.target.value)}
                className="flex-1 bg-transparent border-2 border-white rounded-xl px-6 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={addBox}
                className="border-2 border-white rounded-xl px-6 py-3 hover:bg-white hover:text-black transition-colors whitespace-nowrap"
              >
                add Box
              </button>
            </div>

            {/* Boxes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards[selectedBoard].boxes.map((box, boxIndex) => (
                <div
                  key={box.id}
                  className="border-2 border-white rounded-3xl p-6 relative group"
                >
                  <button
                    onClick={() => deleteBox(boxIndex)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                  <input
                    type="text"
                    value={box.title}
                    onChange={(e) => updateBoxTitle(boxIndex, e.target.value)}
                    className="w-full bg-transparent border-2 border-white rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <div className="space-y-2">
                    <div className="text-sm font-light mb-2">content</div>
                    {box.content.map((item, contentIndex) => (
                      <div key={contentIndex} className="flex items-center gap-2">
                        <span className="text-gray-400">•</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateBoxContent(boxIndex, contentIndex, e.target.value)
                          }
                          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-gray-600 rounded px-2 py-1"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addContentLine(boxIndex)}
                      className="text-gray-400 hover:text-white text-sm mt-2"
                    >
                      + Add item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {boards[selectedBoard].boxes.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                No boxes yet. Click "add Box" to create one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}