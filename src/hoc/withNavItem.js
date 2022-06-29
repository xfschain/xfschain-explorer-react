//navItem高阶组件
import {
    useLocation,
    useHistory
} from "react-router-dom";
import classNames from 'classnames';
function NavItem({ href, children }) {
    let location = useLocation();
    let history = useHistory();
    let { pathname } = location;
    let hrefmatch = () => {
        return (href && href !== '/' && pathname.startsWith(href))
            || (href === '/' && pathname === href);
    }
    let classnames = classNames(
        {
            [`active`]: hrefmatch(),
        }, 'nav-item','dropdown'
    )
    return (
        <li className={classnames}>
            <span className="nav-link" >
                <span className="nav-link-title">
                    {children}
                </span>
            </span>
        </li>
    );
}
const withNavItem = WarppedComponent => props => (
    <WarppedComponent {...props} NavItem={NavItem} />
)
export default withNavItem;