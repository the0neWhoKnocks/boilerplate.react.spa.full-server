import React from 'react';
import { string } from 'prop-types';
import styles from './styles';

const LoadIndicator = (props) => {
  const overlay = styles.overlay({
    bgColor: props.overlayColor,
  });
  const spinner = styles.spinner({
    bgColor: props.spinnerBGColor,
    color: props.spinnerColor,
    size: props.spinnerSize,
    speed: props.spinnerSpeed,
    thickness: props.spinnerThickness,
  });

  return (
    <div className={`indicator__overlay ${ overlay }`}>
      <div className={`indicator__spinner ${ spinner }`} />
    </div>
  );
};

LoadIndicator.propTypes = {
  overlayColor: string,
  spinnerBGColor: string,
  spinnerColor: string,
  spinnerSize: string,
  spinnerSpeed: string,
  spinnerThickness: string,
};

LoadIndicator.defaultProps = {
  overlayColor: 'rgba(255, 255, 255, 0.5)',
  spinnerBGColor: 'transparent',
  spinnerColor: '#000',
  spinnerSize: '2rem',
  spinnerSpeed: '0.5s',
  spinnerThickness: '0.05em',
};

export default LoadIndicator;
