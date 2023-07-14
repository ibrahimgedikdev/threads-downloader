const isVideo = (url) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
    const extension = url.split('.').pop().toLowerCase();
    return videoExtensions.some((ext) => extension.includes(ext));
};

const isImage = (url) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = url.split('.').pop().toLowerCase();
    return imageExtensions.some((ext) => extension.includes(ext));
};

const checkContentType = (src) => {
    if (isVideo(src)) {
        console.log('Video found:', src);
        return 'video';
    } else if (isImage(src)) {
        console.log('Image found:', src);
        return 'image';
    } else {
        throw new Error('Invalid source URL');
    }
};

module.exports = { isImage, isVideo, checkContentType }
