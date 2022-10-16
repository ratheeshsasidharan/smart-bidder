import './Header.scss';
import {NavItem, NavLink} from 'reactstrap';
import {NavLink as Link} from 'react-router-dom';
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useAppDispatch, useAppSelector} from "../config/store";
import {logout} from "../authentication/authentication.reducer";

const Header = () => {
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const account = useAppSelector(state => state.authentication.account);
    const dispatch = useAppDispatch();
    const logoutUser = () => dispatch(logout);

    return (
        <div id="app-header" className="bg-dark header">
            <Navbar data-cy="navbar" dark expand="md" fixed="top" className="bg-dark">
            <span className="header-title">
              Smart Projects
            </span>
                {isAuthenticated &&
                    <Nav id="header-tabs" className="ms-auto justify-content-lg-evenly flex-grow-1" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/projects/new" className="d-flex align-items-center">
                                <FontAwesomeIcon icon="plus"/>
                                <span>&nbsp;Post Project</span>
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink tag={Link} to="/projects/home" className="d-flex align-items-center">
                                <FontAwesomeIcon icon="search"/>
                                <span>&nbsp;Browse Projects</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/logout" className="d-flex align-items-center">
                                <FontAwesomeIcon icon="sign-in-alt"/>
                                <span>&nbsp;Logout (<span className="labelHeading">{account.firstName} {account.lastName}</span>)</span>
                            </NavLink>
                        </NavItem>
                    </Nav>
                }
            </Navbar>
        </div>
    );
}

export default Header;
