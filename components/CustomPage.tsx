import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SystemSettings } from '../types';

interface Props {
    settings: SystemSettings;
    onBack: () => void;
}

export const CustomPage: React.FC<Props> = ({ settings, onBack }) => {
    const [srcDoc, setSrcDoc] = useState('');

    useEffect(() => {
        const html = settings.customPageHtml || '<h1>Welcome</h1><p>No content configured.</p>';
        const css = settings.customPageCss ? `<style>${settings.customPageCss}</style>` : '';
        const js = settings.customPageJs ? `<script>${settings.customPageJs}</script>` : '';
        
        const doc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    ${css}
                </head>
                <body>
                    ${html}
                    ${js}
                </body>
            </html>
        `;
        setSrcDoc(doc);
    }, [settings]);

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in">
            <header className="bg-white p-4 border-b flex items-center gap-3 shadow-sm sticky top-0 z-10">
                <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-black text-slate-800 text-lg uppercase tracking-wide">{settings.appName || 'App'} Special</h2>
            </header>
            <div className="flex-1 w-full h-full bg-slate-50">
                <iframe 
                    srcDoc={srcDoc}
                    className="w-full h-full border-none"
                    title="Custom Content"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
            </div>
        </div>
    );
};
