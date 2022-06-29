//navItem高阶组件
import {
    useLocation,
} from "react-router-dom";
import classNames from 'classnames';
function NavItem({ href, children }) {
    let location = useLocation();
    let { pathname } = location;
    let hrefmatch = () => {
        return (href && href !== '/' && pathname.startsWith(href))
            || (href === '/' && pathname === href);
    }
    let classnames = classNames(
        {
            [`active`]: hrefmatch(),
        }, 'nav-item'
    )
    return (
        <li className={classnames}>
            <a className="nav-link" href={href}>
                <span className="nav-link-title">
                    {children}
                </span>
            </a>
        </li>
    );
}
const withNavItem = WarppedComponent => props => (
     <WarppedComponent {...props} NavItem={NavItem}/>
)
export default withNavItem;