import { css } from 'glamor';

const toggleRadius = 60;
const toggleBorderSize = 3;
const toggleBorderSizePX = `${ toggleBorderSize }px`;
const toggleAnimSpeed = '0.15s';

const styles = {
  toggle: css({
    display: 'inline-block',
    verticalAlign: 'middle',
  }),

  label: css({
    width: `${ toggleRadius }px`,
    height: `${ (toggleRadius / 3) }px`,
    backgroundColor: '#ccc',
    backgroundImage: 'linear-gradient(#ccc, #fff)',
    borderRadius: `${ (toggleRadius / 2) }px`,
    display: 'block',
    position: 'relative',
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',

    '::before,::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
    },

    '::before': {
      backgroundColor: '#AD7C7C',
      borderRadius: `${ (toggleRadius / 3) }px`,
      top: toggleBorderSizePX,
      left: toggleBorderSizePX,
      bottom: toggleBorderSizePX,
      right: toggleBorderSizePX,
      transition: `background ${ toggleAnimSpeed }`,
    },

    '::after': {
      width: `${ (toggleRadius / 2) }px`,
      borderRadius: `${ (toggleRadius / 3) }px`,
      backgroundColor: '#fff',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
      transition: `margin ${ toggleAnimSpeed }`,
      marginLeft: toggleBorderSizePX,
      top: toggleBorderSizePX,
      bottom: toggleBorderSizePX,
    },
  }),

  checkbox: css({
    marginLeft: '-9999px',
    visibility: 'hidden',
    position: 'absolute',

    ':checked + label::before': {
      backgroundColor: '#52F28B',
    },

    ':checked + label::after': {
      marginLeft: `${ ((toggleRadius / 2) - toggleBorderSize) }px`,
    },
  }),
};

export default styles;
