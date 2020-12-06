import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('UA-184794346-1');
};

export const trackPage = (path) => {
  ReactGA.pageview(path);
};
