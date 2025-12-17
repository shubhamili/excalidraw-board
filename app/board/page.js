'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Download, Upload, Maximize2, Trash2, Copy, Edit2, Check, Menu, ChevronLeft } from 'lucide-react';

export default function Board() {
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(0);
    const [openBoxIndex, setOpenBoxIndex] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [editingBoardId, setEditingBoardId] = useState(null);
    const [draggedBox, setDraggedBox] = useState(null);
    const [dividerPosition, setDividerPosition] = useState(50);
    const [isDraggingDivider, setIsDraggingDivider] = useState(false);
    const [viewMode, setViewMode] = useState('split'); // 'split', 'editor', 'preview'
    const textareaRef = useRef(null);
    const containerRef = useRef(null);
    const [modalSearch, setModalSearch] = useState('');

    useEffect(() => {
        const savedBoards = JSON.parse(localStorage.getItem('excalidraw-boards') || 'null');
        if (savedBoards) {
            setBoards(savedBoards);
        } else {
            setBoards([{
                id: 1,
                title: 'Board 1',
                boxes: [],
                createdAt: new Date().toISOString()
            }]);
        }
    }, []);

    useEffect(() => {
        if (boards.length > 0) {
            localStorage.setItem('excalidraw-boards', JSON.stringify(boards));
        }
    }, [boards]);

    useEffect(() => {
        if (isDraggingDivider) {
            const handleMouseMove = (e) => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
                    setDividerPosition(Math.max(10, Math.min(90, newPosition)));
                }
            };

            const handleMouseUp = () => {
                setIsDraggingDivider(false);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDraggingDivider]);

    const formatText = (text) => {
        if (!text) return '';

        let formatted = text;

        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');
        formatted = formatted.replace(/~~(.+?)~~/g, '<del>$1</del>');
        formatted = formatted.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
        formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>');
        formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
        formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
        formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
        formatted = formatted.replace(/^[*-] (.+)$/gm, '<li class="ml-4">• $1</li>');
        formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
        formatted = formatted.replace(/^\[ \] (.+)$/gm, '<div class="flex items-center gap-2"><input type="checkbox" disabled class="w-4 h-4 border-2 border-black"> <span>$1</span></div>');
        formatted = formatted.replace(/^\[x\] (.+)$/gm, '<div class="flex items-center gap-2"><input type="checkbox" checked disabled class="w-4 h-4 border-2 border-black"> <span>$1</span></div>');
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    };

    const highlightHtml = (html, term) => {
        if (!term) return html;
        try {
            const esc = term.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&');
            const re = new RegExp(`(${esc})`, 'gi');
            // avoid interfering with existing tags by replacing on the HTML string
            return html.replace(re, '<mark class="bg-white text-black px-1 rounded-sm">$1</mark>');
        } catch (e) {
            return html;
        }
    };

    const addBoard = () => {
        const newBoard = {
            id: Date.now(),
            title: `Board ${boards.length + 1}`,
            boxes: [],
            createdAt: new Date().toISOString()
        };
        setBoards([...boards, newBoard]);
        setSelectedBoard(boards.length);
    };

    const addBox = () => {
        const updatedBoards = [...boards];
        const newBox = {
            id: Date.now(),
            heading: 'Untitled',
            content: '',
            createdAt: new Date().toISOString()
        };
        updatedBoards[selectedBoard].boxes.push(newBox);
        setBoards(updatedBoards);
    };

    const updateBoardTitle = (value) => {
        const updatedBoards = [...boards];
        updatedBoards[selectedBoard].title = value;
        setBoards(updatedBoards);
    };

    const updateBoxHeading = (boxIndex, value) => {
        const updatedBoards = [...boards];
        updatedBoards[selectedBoard].boxes[boxIndex].heading = value;
        setBoards(updatedBoards);
    };

    const updateBoxContent = (boxIndex, value) => {
        const updatedBoards = [...boards];
        updatedBoards[selectedBoard].boxes[boxIndex].content = value;
        setBoards(updatedBoards);
    };

    const deleteBox = (boxIndex) => {
        const updatedBoards = [...boards];
        updatedBoards[selectedBoard].boxes.splice(boxIndex, 1);
        setBoards(updatedBoards);
        if (openBoxIndex === boxIndex) {
            setOpenBoxIndex(null);
            setIsFullScreen(false);
        }
    };

    const deleteBoard = (boardIndex) => {
        if (boards.length === 1) {
            alert('Cannot delete the last board');
            return;
        }
        const updatedBoards = boards.filter((_, index) => index !== boardIndex);
        setBoards(updatedBoards);
        if (selectedBoard >= updatedBoards.length) {
            setSelectedBoard(updatedBoards.length - 1);
        }
    };

    const duplicateBox = (boxIndex) => {
        const updatedBoards = [...boards];
        const originalBox = updatedBoards[selectedBoard].boxes[boxIndex];
        const newBox = {
            ...originalBox,
            id: Date.now(),
            heading: `${originalBox.heading} (Copy)`,
            createdAt: new Date().toISOString()
        };
        updatedBoards[selectedBoard].boxes.push(newBox);
        setBoards(updatedBoards);
    };

    const exportData = () => {
        const dataStr = JSON.stringify(boards, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `boards-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedBoards = JSON.parse(event.target.result);
                    setBoards(importedBoards);
                    setSelectedBoard(0);
                } catch (error) {
                    alert('Invalid file format');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDragStart = (e, boxIndex) => {
        setDraggedBox(boxIndex);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedBox === null || draggedBox === targetIndex) return;

        const updatedBoards = [...boards];
        const boxes = updatedBoards[selectedBoard].boxes;
        const [movedBox] = boxes.splice(draggedBox, 1);
        boxes.splice(targetIndex, 0, movedBox);
        setBoards(updatedBoards);
        setDraggedBox(null);
    };

    const filteredBoxes = boards[selectedBoard]?.boxes.filter(box =>
        box.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        box.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (boards.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-black border-r-2 border-white flex flex-col transition-all duration-200`}>
                    <div className="p-4 border-b-2 border-white flex items-center justify-between">
                        {!sidebarCollapsed && <h1 className="text-lg font-bold text-white">BOARDS</h1>}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-1 hover:bg-gray-800 transition-colors text-white"
                        >
                            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {!sidebarCollapsed && boards.map((board, index) => (
                            <div key={board.id} className="group relative">
                                {editingBoardId === board.id ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={board.title}
                                            onChange={(e) => {
                                                const updatedBoards = [...boards];
                                                updatedBoards[index].title = e.target.value;
                                                setBoards(updatedBoards);
                                            }}
                                            onBlur={() => setEditingBoardId(null)}
                                            onKeyDown={(e) => e.key === 'Enter' && setEditingBoardId(null)}
                                            className="flex-1 border-2 border-white px-2 py-1 text-sm focus:outline-none bg-black text-white"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => setEditingBoardId(null)}
                                            className="p-1 border-2 border-white hover:bg-white hover:text-black text-white"
                                        >
                                            <Check size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div
                                            onClick={() => setSelectedBoard(index)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && setSelectedBoard(index)}
                                            className={`w-full flex items-center justify-between px-3 py-2 border-2 transition-colors cursor-pointer ${selectedBoard === index
                                                ? 'border-white bg-white text-black'
                                                : 'border-transparent hover:border-white'
                                                }`}
                                        >
                                            <span className="text-sm font-medium truncate">{board.title}</span>
                                            <span className="text-xs ml-2">{board.boxes.length}</span>
                                        </div>
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingBoardId(board.id);
                                                }}
                                                className="p-1 bg-black border border-white hover:bg-gray-800 text-white"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteBoard(index);
                                                }}
                                                className="p-1 bg-black border border-white hover:bg-gray-800 text-white"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!sidebarCollapsed && (
                        <div className="p-3 border-t-2 border-white space-y-2">
                            <button
                                onClick={addBoard}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-white hover:bg-white hover:text-black transition-colors font-medium text-white"
                            >
                                <Plus size={16} />
                                New Board
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={exportData}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border-2 border-white hover:bg-white hover:text-black transition-colors text-sm text-white"
                                >
                                    <Download size={14} />
                                    Export
                                </button>
                                <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer text-sm text-white">
                                    <Upload size={14} />
                                    Import
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={importData}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="border-b-2 border-white p-4 bg-black">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={boards[selectedBoard].title}
                                onChange={(e) => updateBoardTitle(e.target.value)}
                                className="flex-1 border-2 border-white px-4 py-2 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white bg-black text-white placeholder-gray-500"
                                placeholder="Board title"
                            />
                            <a
                                href="/"
                                className="ml-3 px-3 py-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors rounded"
                            >
                                Home
                            </a>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white w-48 bg-black text-white placeholder-gray-500"
                                />
                            </div>
                            <button
                                onClick={addBox}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-white hover:bg-white hover:text-black transition-colors font-medium whitespace-nowrap text-white"
                            >
                                <Plus size={18} />
                                Add Box
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
                        {filteredBoxes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-32 h-32 border-4 border-dashed border-gray-700 flex items-center justify-center mb-4">
                                    <Plus size={48} className="text-gray-700" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">No boxes yet</h3>
                                <p className="text-gray-400 mb-6">Click "Add Box" to create your first box</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredBoxes.map((box) => {
                                    const realIndex = boards[selectedBoard].boxes.findIndex(b => b.id === box.id);
                                    return (
                                        <div
                                            key={box.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, realIndex)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, realIndex)}
                                            onClick={() => {
                                                setOpenBoxIndex(realIndex);
                                                setIsFullScreen(true);
                                            }}
                                            className="group relative bg-gray-900 border-2 border-white p-4 cursor-move hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] transition-all h-64 flex flex-col"
                                        >
                                            <h3 className="font-bold text-base mb-3 pr-20 truncate text-white">{box.heading}</h3>
                                            <div
                                                className="text-sm text-gray-300 flex-1 overflow-hidden"
                                                dangerouslySetInnerHTML={{
                                                    __html: formatText(box.content.substring(0, 200) + (box.content.length > 200 ? '...' : ''))
                                                }}
                                            />
                                            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
                                                {box.content.length} chars
                                            </div>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 bg-gray-900 border-2 border-white p-1 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenBoxIndex(realIndex);
                                                        setIsFullScreen(true);
                                                    }}
                                                    className="p-1 hover:bg-gray-700 text-white"
                                                    title="Expand"
                                                >
                                                    <Maximize2 size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        duplicateBox(realIndex);
                                                    }}
                                                    className="p-1 hover:bg-gray-700 text-white"
                                                    title="Duplicate"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteBox(realIndex);
                                                    }}
                                                    className="p-1 hover:bg-gray-700 text-white"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Screen Modal */}
            {isFullScreen && openBoxIndex !== null && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b-4 border-white bg-black">
                        <input
                            type="text"
                            value={boards[selectedBoard].boxes[openBoxIndex].heading}
                            onChange={(e) => updateBoxHeading(openBoxIndex, e.target.value)}
                            className="flex-1 bg-transparent text-white text-3xl font-bold focus:outline-none mr-4 placeholder-gray-500"
                            placeholder="Box heading"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="relative mr-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={16} />
                            <input
                                type="text"
                                value={modalSearch}
                                onChange={(e) => setModalSearch(e.target.value)}
                                placeholder="Search in box..."
                                onClick={(e) => e.stopPropagation()}
                                className="pl-10 pr-3 py-2 border-2 border-white bg-black text-white placeholder-gray-500 rounded text-sm w-64"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 mr-4 border-2 border-white">
                            <button
                                onClick={() => setViewMode('editor')}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'editor'
                                    ? 'bg-white text-black'
                                    : 'text-white hover:bg-gray-800'
                                    }`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setViewMode('split')}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'split'
                                    ? 'bg-white text-black'
                                    : 'text-white hover:bg-gray-800'
                                    }`}
                            >
                                Split
                            </button>
                            <button
                                onClick={() => setViewMode('preview')}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'preview'
                                    ? 'bg-white text-black'
                                    : 'text-white hover:bg-gray-800'
                                    }`}
                            >
                                Preview
                            </button>
                        </div>

                        <a
                            href="/"
                            className="mr-2 px-3 py-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors rounded"
                        >
                            Home
                        </a>

                        <button
                            onClick={() => {
                                setOpenBoxIndex(null);
                                setIsFullScreen(false);
                            }}
                            className="p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors mr-2"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: transparent;
                            border-radius: 3px;
                        }
                        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                            background: rgba(255,255,255,0.08);
                        }
                    `}</style>
                    <div ref={containerRef} className="flex-1 overflow-hidden bg-black flex relative">
                        {/* Editor Side */}
                        {(viewMode === 'editor' || viewMode === 'split') && (
                            <div
                                className="p-5 overflow-y-auto bg-black custom-scrollbar"
                                style={{ width: viewMode === 'split' ? `${dividerPosition}%` : '100%' }}
                            >
                                <div className="">
                                    <textarea
                                        ref={textareaRef}
                                        value={boards[selectedBoard].boxes[openBoxIndex].content}
                                        onChange={(e) => updateBoxContent(openBoxIndex, e.target.value)}
                                        className="w-full min-h-115 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-white resize-none text-base leading-relaxed font-mono placeholder-gray-600 p-6 border-2 border-white rounded-lg"
                                        placeholder="Start writing... "
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Resizable Divider - Only show in split mode */}
                        {viewMode === 'split' && (
                            <div
                                className="w-2 bg-white cursor-col-resize hover:bg-gray-300 transition-colors shrink-0 relative group"
                                onMouseDown={() => setIsDraggingDivider(true)}
                            >
                                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}

                        {/* Preview Side */}
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <div
                                className="p-8 overflow-y-auto bg-black custom-scrollbar"
                                style={{ width: viewMode === 'split' ? `${100 - dividerPosition}%` : '100%' }}
                            >
                                <div className="max-w-4xl">
                                    <div className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wide">Preview</div>
                                    <div
                                        className="prose prose-invert max-w-none text-white prose-headings:text-white prose-headings:border-b prose-headings:border-gray-700 prose-headings:pb-2 prose-headings:mt-6 prose-headings:mb-4 prose-p:mb-4 prose-li:mb-2 prose-code:bg-gray-900 prose-code:text-white prose-code:px-2 prose-code:py-1 prose-code:rounded prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{ __html: highlightHtml(formatText(boards[selectedBoard].boxes[openBoxIndex].content), modalSearch) }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t-4 border-white bg-black flex items-center justify-between text-sm text-gray-500 font-mono">

                        <span>{new Date(boards[selectedBoard].boxes[openBoxIndex].createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}