import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBrand() {
  const { token } = useAuth();

  return (
    <Link to={token ? '/dashboard' : '/'} className="brand">
      FORM<span className="brand-dot">.</span>
    </Link>
  );
}