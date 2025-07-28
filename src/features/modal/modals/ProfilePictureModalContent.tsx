import React, { useState } from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppSelector } from '../../../app/hooks';
import { uploadProfileImage } from '../../../services/storage/uploadImage';
import { updateDataInCollection } from '../../../services/database/updateData';

const ProfilePictureModalContent: React.FC = () => {
  const authUser = useAppSelector((state) => state.authUser.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !authUser?.userId) return;

    try {
      setStatus('Uploading...');
      const imageUrl = await uploadProfileImage(selectedFile, authUser.userId);
      await updateDataInCollection('Users', authUser.userId, { profileImage: imageUrl });
      setStatus('Upload successful!');
    } catch (error) {
      console.error(error);
      setStatus('Upload failed. Please try again.');
    }
  };

  return (
    <Container TwClassName="flex-col h-full justify-between gap-4">
      <label className="text-sm font-medium">Upload Profile Picture</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewURL && (
        <img
          src={previewURL}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-full border"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Upload
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </Container>
  );
};

export default ProfilePictureModalContent;