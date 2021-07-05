import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { AUTHORIZED, UNAUTHORIZED } from './constants';
import strings from './strings';

const Home = () => {
  const location = useLocation();
  const history = useHistory();
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(location?.state?.authorized);
  }, [location]);

  function logout() {
    setUser(null);
    history.replace({
      ...history.location,
      state: { authorized: false },
    });
  }

  return (
    <div>
      <h2>{strings.hello(user ? AUTHORIZED : UNAUTHORIZED)}</h2>
      {!user ? (
        <Link to="/form">
          <button>{strings.login}</button>
        </Link>
      ) : (
        <button onClick={logout}>{strings.logout}</button>
      )}
    </div>
  );
};

export default Home;
