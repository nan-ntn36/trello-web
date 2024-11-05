import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpiner';
import { verifyUserApi } from '~/apis';

function AccountVerification() {
  // lấy gia trị email và token
  const [searchParams] = useSearchParams();
  //   const email = searchParams.get('email');
  //   const token = searchParams.get('token');
  // cách khác
  const { email, token } = Object.fromEntries([...searchParams]);
  useEffect(() => {
    if (email && token)
      verifyUserApi({ email, token }).then(() => setVerification(true));
  }, [email, token]);
  // tạo state để pk là đã veri hay chưa
  const [verification, setVerification] = useState(false);

  if (!email || !token) return <Navigate to={'/404'} />;
  if (!verification) return <PageLoadingSpinner caption="Verification" />;

  return <Navigate to={`/login?verifiedEmail=${email}`} />;
}

export default AccountVerification;
