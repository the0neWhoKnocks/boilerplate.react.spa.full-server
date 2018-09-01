import composeChunk from 'UTILS/composeChunk';

export const DefaultView = composeChunk({
  load: () => import(
    /* webpackChunkName: "DefaultView" */
    'COMPONENTS/views/Default'
  ),
});

export const RickAndMortyCharacters = composeChunk({
  load: () => import(
    /* webpackChunkName: "RickAndMortyCharacters" */
    'COMPONENTS/views/Items'
  ),
  type: 'ram',
});

export const RickAndMortyCharacter = composeChunk({
  load: () => import(
    /* webpackChunkName: "RickAndMortyCharacter" */
    'COMPONENTS/views/Item'
  ),
  type: 'ram',
});
