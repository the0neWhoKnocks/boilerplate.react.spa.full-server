import { css } from 'glamor';

const styles = {
  view: css({
    backgroundColor: '#b3347c',
    backgroundImage: 'url(https://pre00.deviantart.net/4ef1/th/pre/f/2016/258/0/5/rick_and_morty_background_no_4_by_jurokoo-dahrvd7.png)',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply',
  }),

  title: css({
    color: '#b8fb7b',
    fontFamily: 'Schoolbell, cursive',
    fontSize: '8vw',
    textShadow: '1px 2px 1px #dc7f88, 3px 3px 1px #355fa0, 5px 6px 1px #7235a0, 7px 8px 1px #396ba0',
    marginBottom: '0.25em',
  }),

  grid: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }),

  item: css({
    flexBasis: '19%',
    margin: '0.15em',
    // background: '#b8fb7b',
    borderRadius: '1em',
    overflow: 'hidden',
    border: 'solid 0.5em #b8fb7b',
    position: 'relative',

    ' img': {
      width: '100%',
      display: 'block',
    },

    ' .name': {
      transform: 'translateY(100%)',
      transition: 'transform 0.25s',
    },
    ':hover .name': {
      transform: 'translateY(0%)',
    },
  }),

  name: css({
    color: 'white',
    fontFamily: 'Schoolbell, cursive',
    fontSize: '1.25em',
    textAlign: 'center',
    lineHeight: '1em',
    textShadow: '2px 2px 1px #000000',
    background: 'linear-gradient(transparent, rgba(47, 3, 103, 0.5) 35%)',
    padding: '0.25em 0.5em',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  }),
};

export default styles;
