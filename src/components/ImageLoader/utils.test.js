import {
  checkIfImageCached,
  loadImage,
} from './utils';

describe('utils', () => {
  const imgURL = 'http://fake.com/not/real.jpg';

  describe('checkIfImageCached', () => {
    it('should tell us if has already been loaded', () => {
      const mockImg = {
        complete: true,
      };
      const createElement = jest.spyOn(document, 'createElement');
      createElement.mockImplementation(() => mockImg);

      const ret = checkIfImageCached(imgURL);

      expect(createElement).toHaveBeenCalledWith('img');
      expect(mockImg.src).toEqual(imgURL);
      expect(ret).toBe(mockImg.complete);

      createElement.mockRestore();
    });
  });

  describe('loadImage', () => {
    it('should execute callback once an image has loaded', () => {
      const callbacks = {};
      const mockImg = {
        addEventListener: jest.fn((ev, cb) => {
          callbacks[ev] = cb;
        }),
      };
      const callback = jest.fn();
      const Image = jest.spyOn(window, 'Image');
      Image.mockImplementation(() => mockImg);

      loadImage(imgURL, callback);
      callbacks.load();

      expect(mockImg.addEventListener).toHaveBeenCalledWith('load', callback);
      expect(callback).toHaveBeenCalled();

      Image.mockRestore();
    });
  });
});
