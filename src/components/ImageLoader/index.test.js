import React from 'react';
import { mount } from 'enzyme';
import { checkIfImageCached, loadImage } from './utils';
import ImageLoader, { tempImg } from './index';
import styles, {
  REVEAL_DURATION,
} from './styles';

jest.mock('./utils', () => jest.genMockFromModule('./utils'));

describe('ImageLoader', () => {
  const imgURL = 'http://fake.com/not/real.jpg';
  let wrapper;
  let img;
  let loaderProps;

  it('should add a custom CSS class to the container if one was supplied', () => {
    const altText = 'alt text';
    const className = 'custom-class';
    checkIfImageCached.mockReturnValue(true);

    wrapper = mount(<ImageLoader className={className} src={imgURL} alt={altText} />);

    expect(wrapper.childAt(0).props().className).toEqual(className);
  });

  it('should load an image if not cached', () => {
    const altText = 'alt text';
    let callback;
    checkIfImageCached.mockReturnValue(false);
    loadImage.mockImplementation((src, cb) => { callback = cb; });

    // render out everything in a loading state
    wrapper = mount(<ImageLoader src={imgURL} alt={altText} />);
    img = wrapper.find('img').instance();
    loaderProps = wrapper.find('LoadIndicator').props();

    expect(loadImage).toHaveBeenCalledWith(imgURL, expect.any(Function));
    expect(img.src).toEqual(tempImg);
    expect(img.alt).toEqual(altText);
    expect(loaderProps.visible).toBe(true);

    // loading has completed
    callback();
    wrapper.update();
    img = wrapper.find('img').instance();
    loaderProps = wrapper.find('LoadIndicator').props();

    expect(img.src).toEqual(imgURL);
    expect(loaderProps.visible).toBe(false);
  });

  it('should set the source if the image is cached', () => {
    checkIfImageCached.mockReturnValue(true);

    // render out everything in a loaded state
    wrapper = mount(<ImageLoader src={imgURL} />);
    img = wrapper.find('img').instance();
    loaderProps = wrapper.find('LoadIndicator').props();

    expect(img.src).toEqual(imgURL);
    expect(loaderProps.visible).toBe(false);
  });

  it('should NOT try to set state if component was unmounted before load listener completed', () => {
    let callback;
    checkIfImageCached.mockReturnValue(false);
    loadImage.mockImplementation((src, cb) => { callback = cb; });

    wrapper = mount(<ImageLoader src={imgURL} />);
    const instance = wrapper.instance();
    instance.componentWillUnmount();
    callback();
    wrapper.update();

    expect(instance.state.loaded).toBe(false);
  });

  describe('Animate image on load', () => {
    const mountIt = () => {
      wrapper = mount(<ImageLoader {...props} />);
      instance = wrapper.instance();
      instance.handleLoadedImage();
      wrapper.update();
    };
    let rafCB, instance, props;

    beforeEach(() => {
      jest.spyOn(global, 'requestAnimationFrame');
      global.requestAnimationFrame.mockImplementation((cb) => { rafCB = cb; });
      props = {
        src: imgURL,
      };
      jest.useFakeTimers();
    });

    afterEach(() => {
      global.requestAnimationFrame.mockRestore();
    });

    it('should add class to fade image in', () => {
      jest.spyOn(global, 'setTimeout');
      mountIt();

      expect(instance.state.loaded).toBe(true);
      expect(instance.state.revealImage).toBe(false);
      expect(wrapper.find('img').props().className).toEqual(`${ styles.img }`);

      // shouldn't call setState if not mounted
      instance.mounted = false;
      rafCB();
      jest.runTimersToTime(REVEAL_DURATION * 1000);
      wrapper.update();
      expect(instance.state.revealImage).not.toBe(true);

      // should update state and reveal image when mounted
      instance.mounted = true;
      rafCB();
      jest.runTimersToTime(REVEAL_DURATION * 1000);
      wrapper.update();
      expect(instance.state.revealImage).toBe(true);
      expect(wrapper.find('img').props().className).toEqual(`${ styles.img } is--loaded`);
      expect(global.setTimeout).not.toHaveBeenCalled();

      global.setTimeout.mockRestore();
    });

    it('should execute callback after the image has transitioned', () => {
      props.onLoad = jest.fn();

      mountIt();
      rafCB();
      jest.runTimersToTime(REVEAL_DURATION * 1000);
      wrapper.update();

      expect(props.onLoad).toHaveBeenCalled();
    });
  });
});
