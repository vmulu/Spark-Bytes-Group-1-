'use client';

import withAuth from '../withAuth';

const ProtectedPage = () => {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>You can see this because you are authenticated.</p>
    </div>
  );
};

export default withAuth(ProtectedPage);
