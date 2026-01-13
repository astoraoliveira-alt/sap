import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        description: 'SAP TPM',
        appServer: 'sapecc5.coldfire.com.br',
        instanceNo: '00',
        systemId: 'ECC',
        sapRouter: ''
    });

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle save logic here
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">
                        {t('settingsTitle')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                    {t('description')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                    {t('appServer')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.appServer}
                                    onChange={(e) => setFormData({ ...formData, appServer: e.target.value })}
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                        {t('instanceNo')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.instanceNo}
                                        onChange={(e) => setFormData({ ...formData, instanceNo: e.target.value })}
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                        {t('systemId')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.systemId}
                                        onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                    {t('sapRouter')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.sapRouter}
                                    onChange={(e) => setFormData({ ...formData, sapRouter: e.target.value })}
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <Save className="h-4 w-4" />
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
