export const camera_options = [
    {
      title: 'Camera',
      type: 'capture',
      options: {
        // saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: true,
        quality: 1,
      },
    },
    {
      title: 'Gallery',
      type: 'library',
      options: {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: true,
        quality: 1,
      },
    },
  ];
  