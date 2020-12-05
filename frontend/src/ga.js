import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('G-WYLPK7NZVE');
};

export const trackPage = (path) => {
  ReactGA.pageview(path);
};
