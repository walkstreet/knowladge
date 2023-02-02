import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <h1>PDFJS Demo</h1>
      <ul>
        <li>
          <Link to="/">Canvas</Link>
        </li>
        <li>
          <Link to="/nodes">Node</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
