import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { X, ZoomIn, ZoomOut, Download, BrainCircuit } from 'lucide-react';

interface MindMapProps {
    topic: string;
    onClose: () => void;
}

const generateMermaidSyntax = async (topic: string): Promise<string> => {
    // Mock AI Generation of Mermaid Syntax
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`
graph TD
    A[${topic}] --> B(Key Concept 1)
    A --> C(Key Concept 2)
    B --> D[Detail 1.1]
    B --> E[Detail 1.2]
    C --> F[Detail 2.1]
    C --> G[Detail 2.2]
    D --> H{Check}
    H -->|Yes| I[Result X]
    H -->|No| J[Result Y]
    style A fill:#f9f,stroke:#333,stroke-width:4px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
            `);
        }, 1500);
    });
};

export const MindMapView: React.FC<MindMapProps> = ({ topic, onClose }) => {
    const [syntax, setSyntax] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    }, []);

    useEffect(() => {
        setLoading(true);
        generateMermaidSyntax(topic).then(data => {
            setSyntax(data);
            setLoading(false);
        });
    }, [topic]);

    useEffect(() => {
        if (!loading && syntax && containerRef.current) {
            try {
                mermaid.contentLoaded(); 
                // We need to render explicitly if contentLoaded doesn't pick it up or if we are dynamic.
                // A better approach for dynamic react:
                const render = async () => {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = ''; // Clear previous
                        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, syntax);
                        containerRef.current.innerHTML = svg;
                    }
                };
                render();
            } catch (e) {
                console.error("Mermaid Render Error", e);
            }
        }
    }, [loading, syntax]);

    const handleDownload = () => {
        if (!containerRef.current) return;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MindMap_${topic}.svg`;
        link.click();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-slate-50">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-purple-600" size={24} />
                        <h3 className="font-black text-slate-800 text-lg uppercase tracking-wide">AI Mind Map: {topic}</h3>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleDownload} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 text-slate-600">
                            <Download size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 bg-red-100 rounded-full hover:bg-red-200 text-red-600">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-slate-50 p-8 flex items-center justify-center relative">
                    {loading ? (
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-bold text-slate-400 animate-pulse">Constructing Mind Map...</p>
                        </div>
                    ) : (
                        <div 
                            ref={containerRef} 
                            className="mermaid w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
                            style={{ transform: `scale(${zoom})` }}
                        />
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t bg-white flex justify-center gap-4">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-2 text-sm">
                        <ZoomOut size={16} /> Zoom Out
                    </button>
                    <span className="py-2 font-mono font-bold text-slate-500">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-2 text-sm">
                        <ZoomIn size={16} /> Zoom In
                    </button>
                </div>
            </div>
        </div>
    );
};
