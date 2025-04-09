import { FC, useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Person } from '../types';
import { Camera, Popcorn, Save, X } from 'lucide-react';
import { supabase } from '../superbase';

interface Props {
    person: Person | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: (person: Person) => void;
}

export const ParticipantDetailsModal: FC<Props> = ({ person, isOpen, onClose, onUpdate }) => {
    const [localPerson, setLocalPerson] = useState<Person | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

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
            }
        } else {
            console.error('Erro ao enviar imagem:', uploadError.message);
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
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Participante" size="xxl">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* FOTO */}
                <div className="relative w-40 h-40 mx-auto md:mx-0 flex flex-col items-center mb-5">
                    {/* Foto ou avatar (quadrado) */}
                    <div className="w-40 h-40  border border-gray-300 shadow-sm rounded-lg">
                        {previewUrl || localPerson.photo_url ? (
                            <img
                                src={previewUrl || localPerson.photo_url}
                                alt="Foto do participante"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                                alt="Avatar padrão"
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
                            Foto
                        </label>

                        {/* Remover */}
                        <button
                            onClick={handleRemovePhoto}
                            disabled={!localPerson?.photo_url}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            Remover
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
                    />
                </div>


                {/* DADOS */}
                <div className="flex-1 text-sm space-y-2">
                    <p><span className="font-medium text-gray-800">Nome:</span> {localPerson.name}</p>
                    <p><span className="font-medium text-gray-800">E-mail:</span> {localPerson.email || '—'}</p>
                    <p><span className="font-medium text-gray-800">Telefone:</span> {localPerson.phone || '—'}</p>
                    <p>
                        <span className="font-medium text-gray-800">Status de Envio:</span>{' '}
                        <span className={localPerson.sent ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                            {localPerson.sent ? 'Enviado' : 'Não enviado'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Status de Leitura:</span>{' '}
                        <span className={localPerson.read ? 'text-blue-600 font-semibold' : 'text-gray-600 font-semibold'}>
                            {localPerson.read ? 'Lido' : 'Não lido'}
                        </span>
                    </p>
                    <p><span className="font-medium text-gray-800 flex">Combo: {localPerson.combo ? 'Sim' : 'Não'}</span></p>
                </div>
            </div>

            {/* BOTÃO SALVAR */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {uploading ? 'Enviando...' : 'Salvar'}
                </button>
            </div>
        </Modal>
    );
};
