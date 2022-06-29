import logo from './logo.svg';
import _, { flatMap } from 'lodash';
import axios from 'axios';
import intl from 'react-intl-universal';
import {PureComponent} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from "react-router-dom";

// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Home from './Home';

import PullDown from "./components/pulldown"

import Blocks from './Blocks';
import ForkBlocks from './ForkBlocks';
import ForkBlockDetail from './ForkBlockDetail';
import Accounts from "./Accounts";
import Transactions from './Transactions';
import BlockDetail from './BlockDetail';
import TxDetail from './TxDetail';
import AccountDetail from './AccountDetail';
import Tokens from './Tokens';
import NFTsPage from './NFTsPage';
import classNames from 'classnames';
import ErrorPage from './404';
import BlankPage from './BlankPage';
import services from './services';
import PendingTxs from './PendingTxs';
import PendingTxDetail from './PendingTxDetail';
import STDTokens from './STDTokens';
import STDTokenItem from './STDTokenItem';
import NFTokens from './NFTokens';
import NFTokenItem from './NFTokenItem';
import { lang } from 'moment';
const api = services.api;
function NavItem({ href, children, ...props }) {
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
    }, 'nav-item'
  )
  return (
    <li className={classnames}>
      {/* <a className="nav-link" href={href} */}
      <span className="nav-link"  onClick={e=>history.push(href)}>
        <span className="nav-link-title">
          {children}
        </span>
      </span>
    </li>
  );
}
const SUPPOER_LOCALES = [
  {
    name: 'English',
    value: 'en-us'
  },
  {
    name: '简体中文',
    value: 'zh-cn'
  }
];
const SUPPOER_NETWORKS = [
  {
    id: '0',
    value: 'MAINNET'
  },
  {
    id: '1',
    value: 'TESTNET'
  },
];
const DEFAULT_NETWORK = '1';
const DEFAULT_LOCALES = 'en-us';
const MAINNET_DISABLE = true;
function getUrlParams(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}
function SearchBar({ children, value }) {
  const history = useHistory();
  // const location = useLocation();
  // console.log('bar',history, location);
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    // console.log('search', this.state.searchq);
    history.push(`/search?q=${value}`);
  }

  return (
    <form onSubmit={(e) => { handleSearchSubmit(e) }}>
      <div className="input-icon">
        <span className="input-icon-addon">
          {/* Download SVG icon from http://tabler-icons.io/i/search */}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx={10} cy={10} r={7} /><line x1={21} y1={21} x2={15} y2={15} /></svg>
        </span>
        {children}

      </div>
    </form>
  );
}

function SearchCompoent({ history }) {
  let searchq = getUrlParams('q');
  if (!searchq || searchq.length === 0) {
    history.replace('/404');
    return;
  }
  api.requestSearch({
    params: {
      q: searchq,
    }
  }).then((resp) => {
    let { type, pathValue } = resp;
    if (type === 1) {
      history.replace(`/blocks/${searchq}`);
      return;
    } else if (type === 2) {
      history.replace(`/txs/${searchq}`);
      return;
    } else if (type === 3) {
      history.replace(`/accounts/${searchq}`);

      return;
    } else if (type === 4) {
      history.replace(`/blocks/${pathValue}`);
      // history.push(`/blocks/${pathValue}`);
      // history.replace(`/loading`, {
      //   to: `/blocks/${pathValue}`
      // });
      return;
    } else if (type === 5) {
      history.replace(`/pendingtxs/${searchq}`);
      // history.replace(`/loading`, {
      //   to: `/pending/${searchq}`
      // });
      return;
    } else if (type === 6) {
      history.replace(`/fork_blocks/${searchq}`);
      // history.replace(`/loading`, {
      //   to: `/pending/${searchq}`
      // });
      return;
    }
    history.replace('/404');
  }).catch((e) => {
    history.replace('/404');
  });
  return (
    <div></div>
  );
}
class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pathname: '/',
      showMNav: false,
      initDone: false,
      searchq: '',
      pullList: [
        {
          href: '/blocks',
          title: '区块'
          // intl.get('NAV_BLOCKS')
        },
        {
          href: '/fork_blocks',
          title: '分叉快'
          // intl.get('NAV_FORK_BLOCK')
        }
      ],
      pullList2: [
        {
          href: '/txs',
          title: '交易'
          // intl.get('NAV_TXS')
        },
        {
          href: '/pendingtxs',
          title: '未打包交易'
          // intl.get('NAV_PENDING_TXS')
        }
      ]
    };
  }
  componentDidMount() {
    // console.log(this.props);
    this.loadLocales();
  }
  loadLocales() {
    let currentLocaleObj = this.getCurrentLocale();
    let currentLocale = currentLocaleObj.value;
    let now = new Date().getTime();
    axios.get(`/locales/${currentLocale}.json?t=${now}`).then((res) => {
      // console.log('local-res', res);
      return intl.init({
        currentLocale,
        locales: {
          [currentLocale]: res.data
        }
      });
    }).then(() => {
      // After loading CLDR locale data, start to render
      this.setState({ initDone: true });
    });
  }
  getCurrentNetwork() {
    let currentNetworkId = window.sessionStorage.getItem('_network');
    currentNetworkId = currentNetworkId || getUrlParams('network');
    let n = _.find(SUPPOER_NETWORKS, { id: currentNetworkId });
    return n || _.find(SUPPOER_NETWORKS, { id: DEFAULT_NETWORK });
  }
  getCurrentLocale() {
    let currentLocale = window.sessionStorage.getItem('_lang');
    currentLocale = currentLocale || intl.determineLocale({
      urlLocaleKey: 'lang',
      cookieLocaleKey: 'lang'
    });
    currentLocale = currentLocale || DEFAULT_LOCALES;
    return _.find(SUPPOER_LOCALES, { value: currentLocale.toLowerCase() });
  }
  onChangeLocal({ locale }) {
    window.sessionStorage.setItem('_lang', locale);
    window.location.search = `?lang=${locale}`;
  }
  onChangeNetwork({ netid }) {
    if (MAINNET_DISABLE && netid === '0') {
      alert(intl.get('HINT_MAINNET_DISABLE'));
      return;
    }
    window.sessionStorage.setItem('_network', netid);
    window.location.search = `?network=${netid}`;
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.showMNav !== nextProps.showMNav) {
  //     return true;
  //   }
  //   return false;
  // }
  render() {
    let currentLocale = this.getCurrentLocale();
    let currentNetwork = this.getCurrentNetwork();
    return (
      this.state.initDone && <Router>
        <header className="navbar navbar-expand-md navbar-light d-print-none">
          <div className="container-xl">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
              <span className="navbar-toggler-icon" />
            </button>
            <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
              <a href="/">
                <img src={logo} width={110} height={32} alt="XFS" className="navbar-brand-image" />
              </a>
            </h1>
            <div className="navbar-nav flex-row order-md-last">
              <div className="nav-item dropdown d-none d-md-flex me-3">
                <a className="nav-link dropdown-toggle" href="#navbar-third" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                  <span className="nav-link-icon d-md-none d-lg-inline-block">{/* Download SVG icon from http://tabler-icons.io/i/star */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-wifi" viewBox="0 0 16 16">
                      <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z" />
                      <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.473 6.473 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091l.016-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z" />
                    </svg>
                  </span>
                  <span className="nav-link-title">
                    {intl.get('NAV_NETWORK')}&nbsp;&raquo;&nbsp;{intl.get(`NAV_NETWORK_${currentNetwork.value}`)}
                  </span>
                </a>
                <div className="dropdown-menu">
                  {SUPPOER_NETWORKS.map(net => {
                    const dropDownItemClasses = classNames(
                      {
                        [`active`]: (net.id === currentNetwork.id)
                      }, 'dropdown-item'
                    )
                    return (
                      <div className={dropDownItemClasses}
                        style={{
                          cursor: 'pointer'
                        }}
                        key={net.id}
                        onClick={(e) => { this.onChangeNetwork({ e, netid: net.id }) }}>
                        {intl.get(`NAV_NETWORK_${net.value}`)}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="nav-item dropdown d-none d-md-flex me-3">
                <a className="nav-link dropdown-toggle" href="#navbar-third" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                  <span className="nav-link-icon d-md-none d-lg-inline-block">{/* Download SVG icon from http://tabler-icons.io/i/star */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                    </svg>
                  </span>
                  <span className="nav-link-title">
                    {intl.get('NAV_LANGUAGE')}&nbsp;&raquo;&nbsp;{currentLocale.name}
                  </span>
                </a>
                <div className="dropdown-menu">
                  {SUPPOER_LOCALES.map(locale => {
                    const dropDownItemClasses = classNames(
                      {
                        [`active`]: (locale.value === currentLocale.value)
                      }, 'dropdown-item'
                    )
                    return (
                      <div className={dropDownItemClasses}
                        style={{
                          cursor: 'pointer'
                        }}
                        key={locale.value}
                        onClick={(e) => { this.onChangeLocal({ e, locale: locale.value }) }}>
                        {locale.name}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="navbar-expand-md">
          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="navbar navbar-light">
              <div className="container-xl">
                <ul className="navbar-nav">
                  <NavItem href={'/'}>
                    {intl.get('NAV_HOME')}
                  </NavItem>
                  <PullDown pullList={this.state.pullList} />
                  <PullDown pullList={this.state.pullList2} />
                  <NavItem href={'/accounts'}>
                    {intl.get('NAV_ACCOUNTS')}
                  </NavItem>
                  <NavItem href={'/std_tokens'}>
                    {intl.get('NAV_TOKENS')}
                  </NavItem>
                  <NavItem href={'/nfts'}>
                    {intl.get('NAV_NFTS')}
                  </NavItem>
                </ul>
                <div className="my-2 my-md-0 flex-grow-1 home-md-searchbar order-first order-md-last">
                  <SearchBar value={this.state.searchq}>
                    <input type="text" className="form-control"
                      value={this.state.searchq}
                      onChange={(e) => {
                        this.setState({ searchq: e.target.value });
                      }}
                      placeholder={intl.get('PLACEHOLDER_SEARCH_BAR')} />
                  </SearchBar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className="container" style={{
          marginTop: '2.25rem',
        }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/blocks" component={Blocks} />
            <Route exact path="/fork_blocks" component={ForkBlocks} />
            <Route exact path="/fork_blocks/:hash" component={ForkBlockDetail} />
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/std_tokens" component={STDTokens} />
            <Route exact path="/std_tokens/:address" component={STDTokenItem} />
            <Route exact path="/txs" component={Transactions} />
            <Route exact path="/pendingtxs" component={PendingTxs} />
            <Route exact path="/pendingtxs/:hash" component={PendingTxDetail} />
            <Route exact path="/tokens" component={Tokens} />
            <Route exact path="/nfts" component={NFTokens} />
            <Route exact path="/nfts/:address" component={NFTokenItem} />
            <Route exact path="/blocks/:hash" component={BlockDetail} />
            <Route exact path="/txs/:hash" component={TxDetail} />
            <Route exact path="/accounts/:address" component={AccountDetail} />
            {/* <Route exact path="/pending/:hash" component={TxPending} /> */}
            <Route exact path="/search" component={SearchCompoent} />
            {/* <Route exact path="/tokens/:address" component={TokenDetail}/> */}
            {/* <Route exact path="/nfts/:address" component={TokenDetail}/> */}
            {/* <Route exact path="/404" component={ErrorPage} /> */}
            <Route exact component={ErrorPage} />
            <Route exact path="/loading" component={BlankPage} />
          </Switch>
        </main>
        <div className="container">
          <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <p className="col-md-4 mb-0 text-muted">Copyright &copy; {new Date().getFullYear()} Starx Labs, Inc</p>
            <ul className="nav col-md-6 justify-content-end">
              <li className="nav-item">
                <a href="/" className="nav-link px-2 text-muted">
                  {intl.get('NAV_HOME')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/blocks" className="nav-link px-2 text-muted">
                  {intl.get('NAV_BLOCKS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/fork_blocks" className="nav-link px-2 text-muted">
                  {intl.get('NAV_FORK_BLOCK')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/txs" className="nav-link px-2 text-muted">
                  {intl.get('NAV_TXS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/pendingtxs" className="nav-link px-2 text-muted">
                  {intl.get('NAV_PENDING_TXS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/pendingtxs" className="nav-link px-2 text-muted">
                  {intl.get('NAV_PENDING_TXS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/accounts" className="nav-link px-2 text-muted">
                  {intl.get('NAV_ACCOUNTS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/tokens" className="nav-link px-2 text-muted">
                  {intl.get('NAV_TOKENS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/nfts" className="nav-link px-2 text-muted">
                  {intl.get('NAV_NFTS')}
                </a>
              </li>
              <li className="nav-item">
                <a href="/apis" className="nav-link px-2 text-muted">
                  {intl.get('NAV_APIS')}
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </Router>
    );
  }
}
export default App;
