import View from 'COMPONENTS/View';
import ViewHOC from 'COMPONENTS/ViewHOC';

const View1 = ViewHOC({
  reqOpts: {
    url: 'https://baconipsum.com/api/',
    params: {
      paras: 1,
      type: 'all-meat',
    },
  },
  View,
});
const View2 = ViewHOC({
  reqOpts: {
    url: 'https://baconipsum.com/api/',
    params: {
      paras: 3,
      type: 'all-meat',
    },
  },
  View,
});

const data = {
  header: {
    navItems: [
      {
        exact: true,
        label: 'NavItem1',
        url: '/',
        view: View1,
        viewProps: {
          title: 'View 1',
        },
      },
      {
        label: 'NavItem2',
        url: '/v2',
        view: View2,
        viewProps: {
          title: 'View 2',
        },
      },
      {
        label: 'NavItem3',
        url: '/v3',
        view: View2,
        viewProps: {
          title: 'View 3',
        },
      },
    ],
  },
  footer: {
    navItems: [
      {
        label: 'Terms of Service',
        url: '/terms',
        view: View,
        viewProps: {
          title: 'Terms of Service',
          data: [
            'Just some legal mumbo jumbo',
          ],
        },
      },
    ],
  },
};
const headerProps = {
  navItems: data.header.navItems,
};
const mainProps = {
  routes: [
    ...data.header.navItems,
    ...data.footer.navItems,
  ],
};
const footerProps = {
  navItems: data.footer.navItems,
};

export {
  footerProps,
  headerProps,
  mainProps,
};
