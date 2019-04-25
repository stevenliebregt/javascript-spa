import Home from "./screens/Home";
import About from "./screens/About";
import Random from "./screens/Random";

export const routes = {
  '/': Home,
  '/about-this': About,
  '/random/:random': {
    page: Random,
    parameters: {
      random: '\\d+',
    },
  },
  '/invalid/:_k1': {
    page: Home,
    parameters: {
      _k1: '[a-z]',
    }
  },
};
