export const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes("cloudinary.com/dx86eb887/image/upload/"))
    return url;

  return url.replace("/upload/", "/upload/f_auto,q_auto,w_400/");
};
