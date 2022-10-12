import './Header.scss';
import {NavItem, NavLink} from 'reactstrap';
import {NavLink as Link} from 'react-router-dom';
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Header = () => {
    return (
        <div id="app-header" className="bg-dark header">
            <Navbar data-cy="navbar" dark expand="md" fixed="top" className="bg-dark">
            <span className="header-title">
              Smart Projects
            </span>
                <Nav id="header-tabs" className="ms-auto justify-content-evenly flex-grow-1" navbar>
                    <NavItem>
                        <NavLink tag={Link} to="/" className="d-flex align-items-center">
                            <FontAwesomeIcon icon="plus"/>
                            <span>&nbsp;Post Project</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink tag={Link} to="/" className="d-flex align-items-center">
                            <FontAwesomeIcon icon="search"/>
                            <span>&nbsp;Browse Projects</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink tag={Link} to="/" className="d-flex align-items-center">
                            <FontAwesomeIcon icon="suitcase"/>
                            <span>&nbsp;My Projects</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink tag={Link} to="/" className="d-flex align-items-center">
                            <FontAwesomeIcon icon="sign-in-alt"/>
                            <span>&nbsp;Login</span>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
}

export default Header;
