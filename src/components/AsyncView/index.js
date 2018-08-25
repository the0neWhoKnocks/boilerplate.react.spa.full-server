/* eslint-disable react/prop-types */

import React from 'react';
import loadable from 'loadable-components';
import AsyncLoader from 'COMPONENTS/AsyncLoader';
import replaceUrlToken from 'UTILS/replaceUrlToken';
import logger, {
  BLACK_ON_RED,
} from 'UTILS/logger';

if(!process.env.IS_CLIENT){
  process.on('unhandledRejection', (error) => {
    logger(
      `${ BLACK_ON_RED } ERROR`,
      (error && error.stack) ? error.stack : JSON.stringify(error)
    );
  });
}

const defaultDelay = 300; // 0.3 seconds
const defaultTimeout = 3000; // 3 seconds
const defaultRender = ({
  delay,
  reqOpts,
  timeout,
  viewType,
}) => ({
  Component,
  error,
  loading,
  ownProps: compProps,
}) => {
  const {
    linkPrefix,
    match,
    title,
  } = compProps;
  const viewProps = {
    linkPrefix,
    title,
  };
  const parsedOpts = { ...reqOpts };
  let Comp = Component;

  // When a component has `dependencies`, `Promise.all` will be used, which
  // returns an Array.
  if(Array.isArray(Comp) && Comp[0]){
    Comp = Comp[0].default; // the first item will always be the component
    // TODO - if required, do something with the remainder of the Component Array
  }

  // If `reqOpts` were passed, the Component is dependent on a data request,
  // so lets parse that URL, and use it as a cache key later.
  if(parsedOpts && match){
    parsedOpts.url = replaceUrlToken(match.params, parsedOpts.url);
  }

  return (
    <AsyncLoader
      delay={delay}
      error={error}
      loading={loading}
      timeout={timeout}
      uid={parsedOpts.url}
      viewType={viewType}
    >
      {!loading && !error && <Comp {...viewProps} />}
    </AsyncLoader>
  );
};

const AsyncView = (
  asyncImport,
  {
    delay = defaultDelay,
    dependencies, // an Array of functions, each returning a Promise
    render = defaultRender,
    reqOpts,
    timeout = defaultTimeout,
    viewType,
    ...remaining
  } = {}
) => {
  if(!asyncImport) throw Error("You're missing the import");

  const opts = {
    render: render({
      delay,
      reqOpts,
      timeout,
      viewType,
    }),
    // this will add the prop `modules` needed for SSR and preloading of chunks.
    ...remaining,
  };
  let importPromise;

  // https://github.com/smooth-code/loadable-components

  if(dependencies && dependencies.length){
    importPromise = () => Promise.all(
      [asyncImport, ...dependencies].map((p) => p())
    ).catch((err) => {
      logger(`${ BLACK_ON_RED } ERROR`, `loading async dependencies: "${ err }"`);
    });
  }
  else{
    importPromise = asyncImport;
  }

  return loadable(importPromise, opts);
};

export default AsyncView;
