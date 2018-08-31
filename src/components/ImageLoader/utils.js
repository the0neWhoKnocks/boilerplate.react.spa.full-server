/**
 * Checks whether or not an image (that we're getting ready to load) has already
 * been loaded & cached.
 *
 * @param {String} imgPath - The path to the image.
 * @returns {Boolean}
 */
const checkIfImageCached = (imgPath) => {
  const img = document.createElement('img');
  img.src = imgPath;

  return img.complete;
};

/**
 * Allows for calling a callback once an image has been loaded into cache.
 *
 * @param {String} imgPath - The path to the image.
 * @param {Function} cb - A callback to be executed once the image has loaded.
 */
const loadImage = (imgPath, cb) => {
  const img = new Image();
  img.addEventListener('load', cb);
  img.src = imgPath;
};

export {
  checkIfImageCached,
  loadImage,
};
