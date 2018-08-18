import React from 'react';
import Loadable from 'react-loadable';
import { composeLoader } from 'COMPONENTS/AsyncLoader';

const DELAY = 500; // 0.3 seconds
const TIMEOUT = 3000; // 3 seconds

// NOTE - Setting up `Loadable` here so global defaults (for `delay`,
// `timeout`, etc) can be shared, and there's less duplication and set-up.
export default ({
  delay = DELAY,
  load,
  type,
  timeout = TIMEOUT,
  ...remaining
}) => {
  if(!load) throw Error('A `load` is required');

  // NOTE - The `chunkType` allows for styling the Loading and loaded component
  // the same way to aid in a smoother transition.
  const ComposedLoader = composeLoader({
    chunkType: type,
    delay,
  });

  return Loadable({
    delay,
    loader: load,
    loading: ComposedLoader,
    /* eslint-disable react/display-name, react/prop-types */
    render: (loaded, props) => {
      const Chunk = loaded.default;
      const {
        cacheKey,
        data,
        linkPrefix,
        title,
      } = props;
      const chunkProps = {
        data,
        linkPrefix,
        title,
      };

      return (
        <ComposedLoader dataLoaded={!!data} uid={cacheKey}>
          <Chunk {...chunkProps} />
        </ComposedLoader>
      );
    },
    /* eslint-enable */
    timeout,
    // NOTE - The below spread will add props like `modules` and `webpack`,
    // needed for SSR and preloading of chunks.
    ...remaining,
  });
};
