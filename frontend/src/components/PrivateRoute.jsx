/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.userReducer.user);
  return (
    <Route
      {...rest}
      render={(props) =>
        user !== null ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
