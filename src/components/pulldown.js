import { PureComponent,createRef } from 'react';
import { withRouter } from 'react-router';
import classNames from 'classnames';
let divRef = createRef();
function NavItemActive({ title, children }) {
    let hrefmatch = () => {
        return title === window.sessionStorage.getItem('title');
    }
    let classnames = classNames(
        {
            [`active`]: hrefmatch(),
        }, 'nav-item', 'dropdown'
    )
    return (
        <li className={classnames} ref={divRef}>
            {children}
        </li>
    );
}

class PullDown extends PureComponent {
    
    render() {
        return (
            <NavItemActive  title={this.props.title} >
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                    <span className="nav-link-title">
                        {
                            this.props.title
                        }
                    </span>
                </a>
                <div className="dropdown-menu" data-bs-popper="static">
                    <div className="dropdown-menu-columns">
                        <div className="dropdown-menu-column">
                            {
                                this.props?.pullList && this.props.pullList.length > 0 ? this.props.pullList.map(item => (
                                    <a className="dropdown-item" key={item.href} onClick={this.changeTitle.bind(this, item.title, item.href)}>
                                        {item.title}
                                    </a>
                                )) : (<span></span>)
                            }

                        </div>
                    </div>
                </div>
            </NavItemActive>
        );
    }
    changeTitle(title, href) {
        window.sessionStorage.setItem('title',this.props.title);
        this.props.history.replace(href)
        divRef.current.click();
    }
}
export default withRouter(PullDown);