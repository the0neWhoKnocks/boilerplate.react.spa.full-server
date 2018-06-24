import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import ViewLoader from 'COMPONENTS/ViewLoader';
import {
  setPreviousPage,
} from 'STATE/actions';
import styles, { globals as globalStyles } from './styles';

const mapDispatchToProps = {
  setPreviousPage,
};

const ItemsView = ({
  data,
  linkPrefix,
  loading,
  location,
  setPreviousPage,
  title,
}) => {
  globalStyles();
  
  const handleClick = () => {
    setPreviousPage(location.pathname);
  };

  return (
    <ViewLoader
      className={ `${ styles.view }` }
      loading={ loading }
    >
      <link href="https://fonts.googleapis.com/css?family=Schoolbell" rel="stylesheet" />
      <h1 className={ `${ styles.title }` }>{ title }</h1>
      <div className={`view__body ${ styles.grid }`}>
        {data.map((item, ndx) => (
          <Link
            key={ item.id }
            className={ styles.item }
            to={ `${ linkPrefix }${ item.id }` }
            onClick={ handleClick }
          >
            <img
              src={ item.image }
              alt={ `${ item.name } thumbnail` }
            />
            <div className={ `name ${ styles.name }` }>{ item.name }</div>
          </Link>
        ))}
      </div>
    </ViewLoader>
  );
};

ItemsView.propTypes = {
  data: arrayOf(shape({
    created: string,
    episode: arrayOf(string),
    gender: string,
    id: number,
    image: string,
    location: shape({
      name: string,
      url: string,
    }),
    name: string,
    origin: shape({
      name: string,
      url: string,
    }),
    species: string,
    status: string,
    type: string,
    url: string,
  })),
  linkPrefix: string,
  loading: bool,
  location: shape({}),
  setPreviousPage: func,
  title: string,
};
ItemsView.defaultProps = {
  data: [],
};

export default withRouter(connect(null, mapDispatchToProps)(ItemsView));
