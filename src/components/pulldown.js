import { PureComponent } from 'react';
import { withRouter } from 'react-router';

class PullDown extends PureComponent {
    state = {
        title:'选择'
    }
    render() {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                    <span className="nav-link-title">
                        {
                         this.state.title
                        }
                    </span>
                </a>
                <div className="dropdown-menu" data-bs-popper="static">
                    <div className="dropdown-menu-columns">
                        <div className="dropdown-menu-column">
                            {
                                this.props?.pullList &&  this.props.pullList.length > 0 ? this.props.pullList.map(item => (
                                    <a className="dropdown-item"  key={item.href} onClick={this.changeTitle.bind(this,item.title,item.href)}>
                                        {item.title}
                                    </a>
                                )): (<span></span>)
                            }

                        </div>
                    </div>
                </div>
            </li>
        );
    }
    changeTitle(title,href){
        this.setState({
            title
        })
        this.props.history.replace(href)
    }
}
export default withRouter(PullDown);