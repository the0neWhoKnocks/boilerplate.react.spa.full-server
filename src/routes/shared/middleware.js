import {
  setItemResults,
  setViewData,
} from 'STATE/actions';
import store from 'STATE/store';

export const baconIpsum = (reqOpts) => (resp) => new Promise((resolve, reject) => {
  store.app.dispatch(setViewData({
    data: resp,
    reqOpts,
  }));
  resolve(resp);
});

export const rickAndMortyCharacter = (reqOpts) =>
  (resp) => new Promise((resolve, reject) => {
    store.app.dispatch(setViewData({
      data: resp,
      reqOpts: {
        ...reqOpts,
        url: resp.url, // pass the parsed url (token replaced) so the cache key is correct
      },
    }));
    resolve(resp);
  });

export const rickAndMortyCharacters = (reqOpts) =>
  (resp) => new Promise((resolve, reject) => {
    store.app.dispatch(setViewData({
      data: resp,
      reqOpts,
    }));
    store.app.dispatch(setItemResults(resp));

    // NOTE - Errors on the Client and Server will differ due to file path
    // resolution so a hydration error is to be expected.
    // throw Error('poop'); // NOTE - left in for example, uncomment to see error view

    resolve(resp);
  });
