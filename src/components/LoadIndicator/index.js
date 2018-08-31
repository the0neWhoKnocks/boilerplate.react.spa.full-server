import React from 'react';
import { bool, string } from 'prop-types';
import styles from './styles';

const LoadIndicator = (props) => {
  return (
    <div
      className={(props.visible) ? 'is--visible' : ''}
      {...styles.overlay({
        bgColor: props.overlayColor,
      })}
    >
      <div
        {...styles.spinner({
          bgColor: props.spinnerBGColor,
          color: props.spinnerColor,
          size: props.spinnerSize,
          speed: props.spinnerSpeed,
          thickness: props.spinnerThickness,
        })}
      />
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
  visible: bool,
};

LoadIndicator.defaultProps = {
  overlayColor: 'rgba(255, 255, 255, 0.5)',
  spinnerBGColor: 'transparent',
  spinnerColor: '#000',
  spinnerSize: '2rem',
  spinnerSpeed: '0.5s',
  spinnerThickness: '0.05em',
  visible: false,
};

export default LoadIndicator;
