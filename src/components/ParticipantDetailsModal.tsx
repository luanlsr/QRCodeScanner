import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Camera, Save, X } from 'lucide-react';
import { supabase } from '../superbase';
import { Person } from '../models/Person';
import { formatPhoneNumber } from '../utils/utils';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { QRCodeDisplay } from './QRCodeDisplay';

interface Props {
    person: Person | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: (person: Person) => void;
}

export const ParticipantDetailsModal = ({ person, isOpen, onClose, onUpdate }: Props) => {
    const [localPerson, setLocalPerson] = useState<Person | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLocalPerson(person);
        setPreviewUrl(null); // Resetar preview ao mudar o participante
    }, [person]);

    if (!localPerson) return null;

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !localPerson) return;

        // Pré-visualização
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);

        // Upload no Supabase Storage
        const filePath = `participants/${localPerson.id}-${Date.now()}.${file.name.split('.').pop()}`;
        setUploading(true);

        const { error: uploadError } = await supabase.storage
            .from('participants')
            .upload(filePath, file, { upsert: true });

        if (!uploadError) {
            const { data } = supabase.storage.from('participants').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // Atualiza no banco de dados a coluna photo_url
            const { error: updateError } = await supabase
                .from('participants')
                .update({ photo_url: publicUrl })
                .eq('id', localPerson.id);

            if (updateError) {
                console.error('Erro ao salvar URL no banco:', updateError.message);
            } else {
                // Atualiza o estado local também
                setLocalPerson(prev => prev ? { ...prev, photo_url: publicUrl } : null);
                toast.success(t('participantDetails.photoUploaded'));
            }
        } else {
            console.error('Erro ao enviar imagem:', uploadError.message);
            toast.error(t('participantDetails.errorUploadingPhoto'));
        }

        setUploading(false);
    };

    const handleSave = () => {
        if (localPerson && onUpdate) {
            onUpdate(localPerson);
            onClose();
        }
    };

    const handleRemovePhoto = async () => {
        if (!localPerson) return;

        // Remove do storage se existir uma URL
        if (localPerson.photo_url) {
            const filePath = localPerson.photo_url.split('/').slice(-2).join('/');
            await supabase.storage.from('participants').remove([filePath]);
        }

        // Limpa no banco de dados
        const { error: updateError } = await supabase
            .from('participants')
            .update({ photo_url: null })
            .eq('id', localPerson.id);

        if (updateError) {
            console.error('Erro ao limpar URL no banco:', updateError.message);
        }

        // Limpa o estado local e o preview
        setLocalPerson((prev) => prev ? { ...prev, photo_url: '' } : null);
        setPreviewUrl(null);
        toast.success(t('participantDetails.photoRemoved'));
    };

    const toggleQrCode = () => {
        setShowQrCode(!showQrCode);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('participantDetails.title')}: ${localPerson.name} ${localPerson.last_name}`} size="xxl">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* FOTO */}
                <div className="relative w-40 h-40 mx-auto md:mx-0 flex flex-col items-center mb-5">
                    {/* Foto ou avatar (quadrado) */}
                    <div className="w-40 h-40 border border-gray-300 shadow-sm rounded-lg dark:border-gray-600">
                        {previewUrl || localPerson.photo_url ? (
                            <img
                                src={previewUrl || localPerson.photo_url}
                                alt={t('participantDetails.photo')}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                                alt={t('participantDetails.avatar')}
                                className="w-full h-full object-cover opacity-50"
                            />
                        )}
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 mt-3">
                        {/* Upload */}
                        <label
                            htmlFor="photo-upload"
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded shadow cursor-pointer"
                        >
                            <Camera className="w-4 h-4" />
                            {uploading ? t('participantDetails.uploading') : t('participantDetails.uploadPhoto')}
                        </label>

                        {/* Remover */}
                        <button
                            onClick={handleRemovePhoto}
                            disabled={!localPerson?.photo_url}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            {t('common.remove')}
                        </button>
                    </div>

                    {/* Input hidden */}
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={uploading}
                    />
                </div>


                {/* DADOS */}
                <div className="flex-1 text-sm space-y-2">
                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">{t('form.name')}: </span>
                        <span className="dark:text-gray-200">{localPerson.name}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">{t('form.lastName')}: </span>
                        <span className="dark:text-gray-200">{localPerson.last_name}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">{t('form.email')}: </span>
                        <span className="dark:text-gray-200">{localPerson.email || '—'}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">{t('form.phone')}: </span>
                        <span className="dark:text-gray-200">{formatPhoneNumber(localPerson.phone) || '—'}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">{t('participantDetails.sentStatus')}: </span>{' '}
                        <span className={localPerson.sent ? 'text-green-600 font-semibold dark:text-green-400' : 'text-yellow-600 font-semibold dark:text-yellow-400'}>
                            {localPerson.sent ? t('participants.common.yes') : t('participants.common.no')}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">{t('participantDetails.readStatus')}: </span>{' '}
                        <span className={localPerson.read ? 'text-blue-600 font-semibold dark:text-blue-400' : 'text-gray-600 font-semibold dark:text-gray-400'}>
                            {localPerson.read ? t('participants.common.yes') : t('participants.common.no')}
                        </span>
                    </p>
                </div>
            </div>

            {/* QR Code */}
            <QRCodeDisplay
                value={localPerson.id}
                showToggle={true}
                isVisible={showQrCode}
                onToggle={toggleQrCode}
            />

            {/* BOTÃO SALVAR */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {uploading ? t('participantDetails.saving') : t('common.save')}
                </button>
            </div>
        </Modal>
    );
};
