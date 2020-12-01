/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js.cookie';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => {
  const refresh_token = Cookies.get('jwt_token_refresh');
  return (
    <Route
      {...rest}
      render={(props) =>
        refresh_token ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
