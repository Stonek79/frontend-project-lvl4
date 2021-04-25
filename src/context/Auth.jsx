import { useContext } from 'react';

import authContext from './index.jsx';

const useAuth = () => useContext(authContext);

export default useAuth;
