import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">PureComponent</Link>
        </li>
        <li>
          <Link to="/hooks">Hooks</Link>
        </li>
        <li>
          <Link to="/useref">useRef</Link>
        </li>
        <li>
          <Link to="/usememo">usememo</Link>
        </li>
        <li>
          <Link to="/usecallback">usecallback</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
