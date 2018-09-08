import React, { Component, Fragment } from 'react';
import { bool, func, string } from 'prop-types';
import classnames from 'classnames';
import LoadIndicator from '../LoadIndicator';
import { checkIfImageCached, loadImage } from './utils';
import styles, {
  REVEAL_DURATION,
} from './styles';

const tempImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class ImageLoader extends Component {
  constructor(props) {
    super();

    this.state = {
      loaded: false,
      revealImage: false,
      src: props.src,
    };
  }

  componentDidMount() {
    const { src } = this.props;
    this.mounted = true;

    (checkIfImageCached(src))
      ? this.handleLoadedImage()
      : loadImage(src, this.handleLoadedImage.bind(this));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleLoadedImage() {
    if(this.mounted) {
      this.setState({
        loaded: true,
      }, () => {
        /**
         * We have to wait until the image source has been set before we can
         * animate it via CSS.
         */
        window.requestAnimationFrame(() => {
          if(this.mounted){
            this.setState({
              revealImage: true,
            }, () => {
              const { onLoad } = this.props;

              // wait until the animation has completed or the image may pop in
              if(onLoad) setTimeout(onLoad, REVEAL_DURATION * 1000);
            });
          }
        });
      });
    }
  }

  render() {
    const {
      loaded,
      revealImage,
    } = this.state;
    const {
      alt,
      className,
      overlayColor,
      showOverlay,
      spinnerBGColor,
      spinnerColor,
      spinnerSize,
      spinnerSpeed,
      spinnerThickness,
      src,
    } = this.props;
    const currSrc = (loaded) ? src : tempImg;
    const imgClass = classnames(
      `${ styles.img }`,
      {
        'is--loaded': revealImage,
      },
    );

    return (
      <Fragment>
        <div className={className}>
          <img className={imgClass} src={currSrc} alt={alt} />
        </div>
        {showOverlay && (
          <LoadIndicator
            overlayColor={overlayColor}
            spinnerBGColor={spinnerBGColor}
            spinnerColor={spinnerColor}
            spinnerSize={spinnerSize}
            spinnerSpeed={spinnerSpeed}
            spinnerThickness={spinnerThickness}
            visible={!loaded}
          />
        )}
      </Fragment>
    );
  }
}

ImageLoader.propTypes = {
  alt: string,
  className: string,
  onLoad: func,
  src: string,
  showOverlay: bool,
  // LoadIndicator props
  overlayColor: string,
  spinnerBGColor: string,
  spinnerColor: string,
  spinnerSize: string,
  spinnerSpeed: string,
  spinnerThickness: string,
};

ImageLoader.defaultProps = {
  showOverlay: true,
};

export default ImageLoader;
export {
  tempImg,
};
