export const isSupportWebp = () => {
  try {
    const _isSupportWebp = document
      .createElement("canvas")
      .toDataURL("image/webp")
      .includes("data:image/webp");
    return _isSupportWebp;
  } catch (err) {
    return false;
  }
};

export const getOssImageMIME = (backupExt = "jpg") => {
  return `image/${isSupportWebp() ? "webp" : backupExt}`;
};

export default isSupportWebp;
