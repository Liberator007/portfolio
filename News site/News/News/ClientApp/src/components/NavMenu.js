import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import './css/NavMenu.css';
import './css/link.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;
    constructor (props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyRole: 'role',
            keyToken: 'token',
            collapsedTopic: true,
            collapsedProfile: true,
            collapsed: true,
            listTopic: []
        };
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggleNavbarTopic = this.toggleNavbarTopic.bind(this);
    }

    componentDidMount() {
        this.getTopicListRequest();
        if (localStorage.length > 0) {
            document.getElementById("authorization").style.display = "none";
            document.getElementById("registration").style.display = "none";
            document.getElementById("logout").style.display = "inline-block";
            document.getElementById("profile").style.display = "inline-block";
            document.getElementById("dropdownProfile").style.display = "inline-block";
            let role = localStorage.getItem(this.state.keyRole); 
            if (role == "user") {                
                document.getElementById("administration").style.display = "none";
            } else if (role == "admin") {
                document.getElementById("administration").style.display = "inline-block";
                
            }
        }
        else {
            document.getElementById("authorization").style.display = "inline-block";
            document.getElementById("registration").style.display = "inline-block";
            document.getElementById("profile").style.display = "none";
            document.getElementById("administration").style.display = "none";
            document.getElementById("logout").style.display = "none";
            document.getElementById("dropdownProfile").style.display = "none";
        }

    }

    getTopicListRequest = () => {
        let url = 'api/article/getTopicList';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listTopic: response });
            })
    }

    userLogOut = () => {
        localStorage.removeItem(this.state.keyLogin);
        localStorage.removeItem(this.state.keyRole);
        localStorage.removeItem(this.state.keyToken);
        window.location.href = '/';
    }

    openProfile = () => {
        let token = localStorage.getItem(this.state.keyToken);
        fetch('api/comment/getUserID', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
        })
            .then(response => response.json())
            .then(response => {
                if (isNaN(response) === false) {
                    window.location.href = '/profile/' + response;
                }
                else {
                    alert('Пожалуйста авторизируйтесь');
                }
            })
    }

    searchArticle = (e) => {
        e.preventDefault();
        let search = e.currentTarget.elements[0].value;
        if (search != "") {
            window.location.href = '/article-list-search/' + search;
        }
    }

    activeNavDropdown = () => {
        if (this.state.collapsedTopic) {
            document.getElementById("navbarDropdown").setAttribute("aria-expanded", "true");
            document.getElementById("navbarDropdown").setAttribute("class", "nav-link dropdown-toggle item show");
            document.getElementById("navbarDropdownUl").setAttribute("class", "dropdown-menu show");
            
        }
        else {
            document.getElementById("navbarDropdown").setAttribute("aria-expanded", "false");
            document.getElementById("navbarDropdown").setAttribute("class", "nav-link dropdown-toggle item");
            document.getElementById("navbarDropdownUl").setAttribute("class", "dropdown-menu");
        }
        this.toggleNavbarTopic();
    }

    activeProfileDropdown = () => {
        if (this.state.collapsedProfile) {
            document.getElementById("navbarDropdownProfile").setAttribute("aria-expanded", "true");
            document.getElementById("navbarDropdownProfile").setAttribute("class", "nav-link dropdown-toggle item show");
            document.getElementById("navbarDropdownProfileUl").setAttribute("class", "dropdown-menu show");

        }
        else {
            document.getElementById("navbarDropdownProfile").setAttribute("aria-expanded", "false");
            document.getElementById("navbarDropdownProfile").setAttribute("class", "nav-link dropdown-toggle item");
            document.getElementById("navbarDropdownProfileUl").setAttribute("class", "dropdown-menu");
        }
        this.toggleNavbarProfile();
    }

    openAdministration = () => {
        window.location.href = '/administration';
    }

    render() {
        let login = localStorage.getItem(this.state.keyLogin);
        let listTopic = this.state.listTopic;
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">News</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem class="dropdown" >
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle item" onClick={this.activeNavDropdown} id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                                            <font color="black">Разделы</font>
                                        </a>
                                        <ul class="dropdown-menu" id="navbarDropdownUl" aria-labelledby="navbarDropdown">
                                            <li><a class="dropdown-item" href="/">Главная</a></li>
                                            <li><hr class="dropdown-divider"/></li>
                                            {listTopic
                                                .map(topic =>
                                                    <li>
                                                        <a class="dropdown-item" href={"/article-list-topic/" + topic.topicID}>
                                                            {topic.name}
                                                        </a>
                                                    </li>
                                                )}
                                        </ul>
                                    </li>
                                </NavItem>
                                <NavItem class="dropdown" id="dropdownProfile">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle item" onClick={this.activeProfileDropdown} id="navbarDropdownProfile" role="button" data-toggle="dropdown" aria-expanded="false">
                                            <font color="black">{login}</font>
                                        </a>
                                        <ul class="dropdown-menu" id="navbarDropdownProfileUl" aria-labelledby="navbarDropdownProfile">
                                            <li id="administration" class="dropdown-item item">
                                                <a onClick={this.openAdministration}>
                                                    Администрирование
                                                </a>
                                            </li>
                                            <li id="profile" class="dropdown-item item">
                                                <a onClick={this.openProfile}>
                                                    Профиль
                                                </a>
                                            </li>
                                            <li id="logout" class="dropdown-item item">
                                                <a onClick={this.userLogOut}>
                                                    Выйти из системы
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </NavItem>
                                <NavItem>
                                    <NavLink id="registration" tag={Link} className="text-dark" to="/registration">Зарегистрироваться</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink id="authorization" tag={Link} className="text-dark" to="/authorization">Войти</NavLink>
                                </NavItem>
                                <NavItem>
                                    <form class="form-inline mt-2 mt-md-0" onSubmit={this.searchArticle}>
                                        <input class="form-control mr-sm-2" type="text" placeholder="Поиск" aria-label="Поиск" required/>
                                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск</button>
                                    </form>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    toggleNavbarTopic() {
        this.setState({
            collapsedTopic: !this.state.collapsedTopic
        });
    }

    toggleNavbarProfile() {
        this.setState({
            collapsedProfile: !this.state.collapsedProfile
        });
    }
}
