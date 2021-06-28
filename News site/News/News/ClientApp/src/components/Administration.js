import React, { Component } from 'react';
import { Table, Button, ButtonGroup } from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Collapse, CardBody, Card } from 'reactstrap';
import './css/link.css';

export class Administration extends Component {
    static displayName = Administration.name;
    constructor(props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyRole: 'role',
            keyToken: 'token',
            modalCollapseFilterArticle: false,
            modalCollapseFilterArticleUser: false,
            modalCollapseFilterUser: false,
            modalCollapseFilterTopic: false,
            modalDeleteArticle: false,
            modalDeleteTopic: false,
            modalCreateUser: false,
            sortArticleID: false,
            sortArticleUserID: false,
            sortUserID: false,
            sortTopicID: false,
            sortArticleStatusRelease: false,
            sortArticleUserStatusRelease: false,
            articleID: 0,
            topicID: 0,
            listArticle: [],
            listArticleUser: [],
            listTopic: [],
            listUser: [],
        };
    }

    componentDidMount() {
        this.checkAuthorization();
    }

    getAllList = () => {
        this.getArticleList();
        this.getArticleUserList();
        this.getUserList();
        this.getTopicList();
    }

    //----Вывод поиска объектов по названию----------------------------------------------------------------------------------------------------------------------------------------------------------------
    getArticleSearch = (e) => {
        e.preventDefault();
        let search = e.currentTarget.elements[0].value;
        let url = 'api/article/getArticleSearch?search=' + search;
        fetch(url, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(response => {
                let listArticle = response;
                for (var i = 0; i < listArticle.length; i++) {
                    if (listArticle[i].statusRelease == true) {
                        listArticle[i].statusRelease = "+";
                    } else {
                        listArticle[i].statusRelease = "-";
                    }

                    if (listArticle[i].dateRelease != null) {
                        listArticle[i].dateRelease = this.parseDatetime(listArticle[i].dateRelease);
                    } else {
                        listArticle[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticle: listArticle });
                this.setBlockArticleCheck(listArticle);
            })
    }

    getArticleUserSearch = (e) => {
        e.preventDefault();
        let search = e.currentTarget.elements[0].value;
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/getArticleUserSearch?search=' + search;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then((response) => response.json())
            .then(response => {
                let listArticleUser = response;
                for (var i = 0; i < listArticleUser.length; i++) {
                    if (listArticleUser[i].statusRelease == true) {
                        listArticleUser[i].statusRelease = "+";
                    } else {
                        listArticleUser[i].statusRelease = "-";
                    }

                    if (listArticleUser[i].dateRelease != null) {
                        listArticleUser[i].dateRelease = this.parseDatetime(listArticleUser[i].dateRelease);
                    } else {
                        listArticleUser[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticleUser: listArticleUser });
                this.setBlockArticleCheck(listArticleUser);
            })
    }

    getUserSearch = (e) => {
        e.preventDefault();
        let search = e.currentTarget.elements[0].value;
        let url = 'api/article/getUserSearch?search=' + search;
        fetch(url, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(response => {
                let listUser = response;
                for (var i = 0; i < listUser.length; i++) {
                    if (listUser[i].emailConfirmed == true) {
                        listUser[i].emailConfirmed = "+";
                    } else {
                        listUser[i].emailConfirmed = "-";
                    }

                    if (listUser[i].dateRegistration != null) {
                        listUser[i].dateRegistration = this.parseDatetime(listUser[i].dateRegistration);
                    } else {
                        listUser[i].dateRegistration = "-";
                    }
                }
                this.setState({ listUser: listUser });
                this.setBlockCheck(response);
            })
    }

    getTopicSearch = (e) => {
        e.preventDefault();
        let search = e.currentTarget.elements[0].value;
        let url = 'api/article/getTopicSearch?search=' + search;
        fetch(url, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listTopic: response });
            })
    }

    //----Вывод опубликованных/неопубликованных новостей в Input----------------------------------------------------------------------------------------------------------------------------------------------
    setReleaseArticleSumbit = (release) => {
        let url = 'api/article/getArticleSortStatusRelease?release=' + release;
        fetch(url, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(response => {
                let listArticle = response;
                for (var i = 0; i < listArticle.length; i++) {
                    if (listArticle[i].statusRelease == true) {
                        listArticle[i].statusRelease = "+";
                    } else {
                        listArticle[i].statusRelease = "-";
                    }

                    if (listArticle[i].dateRelease != null) {
                        listArticle[i].dateRelease = this.parseDatetime(listArticle[i].dateRelease);
                    } else {
                        listArticle[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticle: listArticle });
                this.setBlockArticleCheck(listArticle);
            })
    }

    setReleaseArticle = (id) => {
        let release;
        switch (id) {
            case '1':
                this.getArticleList();
                break;
            case '2':
                release = true;
                this.setReleaseArticleSumbit(release);
                break;
            case '3':
                release = false;
                this.setReleaseArticleSumbit(release);
                break;
            default:
                this.getArticleList();
        }
    }

    setReleaseArticleUserSumbit = (release) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/getArticleUserSortStatusRelease?release=' + release;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then((response) => response.json())
            .then(response => {
                let listArticleUser = response;
                for (var i = 0; i < listArticleUser.length; i++) {
                    if (listArticleUser[i].statusRelease == true) {
                        listArticleUser[i].statusRelease = "+";
                    } else {
                        listArticleUser[i].statusRelease = "-";
                    }

                    if (listArticleUser[i].dateRelease != null) {
                        listArticleUser[i].dateRelease = this.parseDatetime(listArticleUser[i].dateRelease);
                    } else {
                        listArticleUser[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticleUser: listArticleUser });
                this.setBlockArticleCheck(listArticleUser);
            })
    }

    setReleaseArticleUser = (id) => {
        let release;
        switch (id) {
            case '1':
                this.getArticleUserList();
                break;
            case '2':
                release = true;
                this.setReleaseArticleUserSumbit(release);
                break;
            case '3':
                release = false;
                this.setReleaseArticleUserSumbit(release);
                break;
            default:
                this.getArticleUserList();
        }
    }

    //----Список новостей----------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Все новости
    getArticleList = () => {
        let url = 'api/article/getArticleList';
        fetch(url, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(response => {
                let listArticle = response;
                for (var i = 0; i < listArticle.length; i++) {
                    if (listArticle[i].statusRelease == true) {
                        listArticle[i].statusRelease = "+";
                    } else {
                        listArticle[i].statusRelease = "-";
                    }

                    if (listArticle[i].dateRelease != null) {
                        listArticle[i].dateRelease = this.parseDatetime(listArticle[i].dateRelease);
                    } else {
                        listArticle[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticle: listArticle });
                this.setBlockArticleCheck(listArticle);
            })
    }

    // Новости опеределенного пользователя
    getArticleUserList = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/getArticleUserList';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then((response) => response.json())
            .then(response => {
                let listArticleUser = response;
                for (var i = 0; i < listArticleUser.length; i++) {
                    if (listArticleUser[i].statusRelease == true) {
                        listArticleUser[i].statusRelease = "+";
                    } else {
                        listArticleUser[i].statusRelease = "-";
                    }

                    if (listArticleUser[i].dateRelease != null) {
                        listArticleUser[i].dateRelease = this.parseDatetime(listArticleUser[i].dateRelease);
                    } else {
                        listArticleUser[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticleUser: listArticleUser });
                this.setBlockArticleUserCheck(listArticleUser);
            })
    }

    setBlockArticleCheck = (listArticle) => {
        if (listArticle.length > 0) {
            for (var i = 0; i < listArticle.length; i++) {
                if (listArticle[i].ban == true) {
                    document.getElementById('blockArticleCheck' + listArticle[i].articleID).checked = true;
                } else {
                    document.getElementById('blockArticleCheck' + listArticle[i].articleID).checked = false;
                }
            }
        }
    }

    setBlockArticleUserCheck = (listArticleUser) => {
        if (listArticleUser.length > 0) {
            for (var i = 0; i < listArticleUser.length; i++) {
                if (listArticleUser[i].ban == true) {
                    document.getElementById('blockArticleUserCheck' + listArticleUser[i].articleID).checked = true;
                } else {
                    document.getElementById('blockArticleUserCheck' + listArticleUser[i].articleID).checked = false;
                }
            }
        }
    }

    addArticle = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/addArticle';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Авторизируйтесь');
                }
                else {
                    return response.json();
                }
            })
            .then(response => {
                this.editArticle(response);
            })
    }

    editArticle = (articleID) => {
        window.location.href = '/administration/edit-article/' + articleID;
    }

    deleteArticle = () => {
        let articleID = this.state.articleID;
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/deleteArticle?articleID=' + articleID;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer'
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при удалении');
                }
                else {
                    alert('Новость удалена');
                    this.getArticleUserList();
                    this.getArticleList();
                    this.getTopicList();
                }
            })
        this.toggleModalDeleteArticle();
    }

    editBanArticle = (articleID) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/editBanArticle?articleID=' + articleID;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer'
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при изменении');
                }
                else {
                    alert('Доступ у новости с ID=' + articleID + ' изменен');
                    this.getArticleList();
                    this.getArticleUserList();
                }
            })
    }

    //----Список пользователей----------------------------------------------------------------------------------------------------------------------------------------------------------------

    createUserSubmit = (data) => {
        let token = localStorage.getItem(this.state.keyToken);
        fetch('api/registry/сreateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(data),
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Имя пользователя уже существует');
                }
                else {
                    alert("Пользователь добавлен");
                    this.getUserList();
                    this.toggleModalCreateUser();
                }
            })
    }

    createUser = (e) => {
        e.preventDefault();
        let username = e.currentTarget.elements[0].value;
        let role = e.currentTarget.elements[1].selectedOptions[0].id;
        let email = e.currentTarget.elements[2].value
        let password = e.currentTarget.elements[3].value;
        let passwordRepeat = e.currentTarget.elements[4].value;

        if (username.length >= 8) {
            if (password.length >= 8) {
                if (password == passwordRepeat) {
                    let body = {
                        Username: username,
                        Email: email,
                        Password: password,
                        Role: role
                    };
                    this.createUserSubmit(body);
                }
                else {
                    alert("Пароли не совпадают");
                }
            }
            else {
                alert("Пароль слишком короткий");
            }

        } else {
            alert("Имя пользователя слишком короткое");
        }
    }

    getUserList = () => {
        let url = 'api/authorization/getUser';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                let listUser = response;
                for (var i = 0; i < listUser.length; i++) {
                    if (listUser[i].emailConfirmed == true) {
                        listUser[i].emailConfirmed = "+";
                    } else {
                        listUser[i].emailConfirmed = "-";
                    }

                    if (listUser[i].dateRegistration != null) {
                        listUser[i].dateRegistration = this.parseDatetime(listUser[i].dateRegistration);
                    } else {
                        listUser[i].dateRegistration = "-";
                    }
                }
                this.setState({ listUser: listUser });
                this.setBlockCheck(response);
            })
    }

    setBlockCheck = (listUser) => {
        if (listUser.length > 0) {
            for (var i = 0; i < listUser.length; i++) {
                if (listUser[i].block == true) {
                    document.getElementById('blockCheck' + listUser[i].userID).checked = true;
                } else {
                    document.getElementById('blockCheck' + listUser[i].userID).checked = false;
                }
            }
        }
    }

    editBanUser = (userID) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/authorization/editBanUser?userID=' + userID;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer'
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при изменении');
                }
                else {
                    alert('Доступ пользователя с ID=' + userID + ' изменен');
                    this.getUserList();
                }
            })
    }

    //----Список тем----------------------------------------------------------------------------------------------------------------------------

    getTopicList = () => {
        let url = 'api/article/getTopicList';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listTopic: response });
            })
    }

    createTopic = (e) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/createTopic';
        e.preventDefault();
        let name = e.currentTarget.elements[0].value;
        let body = {
            Name: name
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body),
            referrer: 'no-referrer'
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при добавлении');
                }
                else {
                    this.getTopicList();
                }
            })
    }

    deleteTopic = () => {
        let topicID = this.state.topicID;
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/deleteTopic?topicID=' + topicID;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer'
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при удалении');
                    this.toggleModalDeleteTopic();
                }
                else {
                    this.toggleModalDeleteTopic();
                    this.getArticleUserList();
                    this.getArticleList();
                    this.getTopicList();
                }
            })
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------

    render() {
        let height = 20;
        let width = 20;
        let listArticle = this.state.listArticle;
        let listArticleUser = this.state.listArticleUser;
        let listTopic = this.state.listTopic;
        let listUser = this.state.listUser;

        return (
            <div>
                <Button onClick={this.addArticle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Добавление новости
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={this.toggleModalCreateUser}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Добавление пользователя
                </Button>
                <br />
                <br />
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" class="item">
                        <a class="nav-link active" id="article-all-tab" data-toggle="tab" role="tab" onClick={this.activeNavArticle} aria-controls="articleAll" aria-selected="true">Список всех новостей</a>
                    </li>
                    <li class="nav-item" class="item">
                        <a class="nav-link" id="article-release-tab" data-toggle="tab" role="tab" onClick={this.activeNavArticleUser} aria-controls="articleRelease" aria-selected="false">Список новостей пользователя</a>
                    </li>
                    <li class="nav-item" class="item">
                        <a class="nav-link" id="user-tab" data-toggle="tab" role="tab" onClick={this.activeNavUser} aria-controls="user" aria-selected="false">Список пользователей</a>
                    </li>
                    <li class="nav-item" class="item">
                        <a class="nav-link" id="topic-tab" data-toggle="tab" role="tab" onClick={this.activeNavTopic} aria-controls="topic" aria-selected="false">Список тем</a>
                    </li>
                </ul>
                
                <div class="tab-content" id="myTabContent">
                    {/*Список всех новостей*/}
                    <div class="tab-pane fade show active" id="articleAll" role="tabpanel" aria-labelledby="article-all-tab">
                        <br />
                        <div>
                            <Button onClick={this.toggleCollapseFilterArticle} style={{ marginBottom: '1rem' }}>Фильтр</Button>
                            <Collapse isOpen={this.state.modalCollapseFilterArticle}>
                                <Card>
                                    <CardBody>
                                        <form class="form-inline mt-2 mt-md-0" onSubmit={this.getArticleSearch}>
                                            <input class="form-control mr-sm-2" type="text" placeholder="Название" aria-label="Название" required />
                                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск</button>
                                        </form>
                                    </CardBody>
                                    <CardBody>
                                        <FormGroup>
                                            <Label for="releaseSelect">Показать новости</Label>
                                            <Input type="select" name="releaseSelect" id="releaseSelect"
                                                onChange={(e) => this.setReleaseArticle(e.target.selectedOptions[0].id)}
                                            >
                                                <option id="1">Все</option>
                                                <option id="2">Опубликованные</option>
                                                <option id="3">Неопубликованные</option>
                                            </Input>
                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </div>
                        <div>
                            <br />
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th class="item" onClick={this.getArticleSortID}>ID
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
                                            </svg>
                                        </th>
                                        <th>Тема</th>
                                        <th>Название</th>
                                        <th width="180" class="item" onClick={this.getArticleSortDateRelease}>Дата публикации
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
                                            </svg>
                                        </th>
                                        <th>Опубликована</th>
                                        <th>Блокировка</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listArticle.map(article =>
                                        <tr key={article.articleID}>
                                            <td align="right">{article.articleID}</td>
                                            {listTopic
                                                .filter(topic => article.topicID == topic.topicID)
                                                .slice(0, 1)
                                                .map(topic =>
                                                    <td>{topic.name}</td>
                                                )}
                                            {listArticle
                                                .filter(articleOne => (articleOne.articleID == article.articleID) && (articleOne.topicID == null))
                                                .slice(0, 1)
                                                .map(articleOne =>
                                                    <td align="center">-</td>
                                                )}
                                            <td>{article.name}</td>
                                            <td>{article.dateRelease}</td>
                                            <td align="center" valign="middle">{article.statusRelease}</td>
                                            <td align="center" valign="middle"><input type="checkbox" id={"blockArticleCheck" + article.articleID} onChange={() => this.editBanArticle(article.articleID)} /></td>
                                            <td align="center">
                                                <ButtonGroup>
                                                    <Button color="warning" onClick={() => this.editArticle(article.articleID)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                                        </svg>
                                                    </Button>
                                                    <Button color="danger" onClick={() => this.toggleModalDeleteArticle(article.articleID)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                        </svg>
                                                    </Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    {/*Список новостей пользователя*/}
                    <div class="tab-pane fade" id="articleRelease" role="tabpanel" aria-labelledby="article-release-tab">
                        <br />
                        <div>
                            <Button onClick={this.toggleCollapseFilterArticleUser} style={{ marginBottom: '1rem' }}>Фильтр</Button>
                            <Collapse isOpen={this.state.modalCollapseFilterArticleUser}>
                                <Card>
                                    <CardBody>
                                        <form class="form-inline mt-2 mt-md-0" onSubmit={this.getArticleUserSearch}>
                                            <input class="form-control mr-sm-2" type="text" placeholder="Название" aria-label="Название" required />
                                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск</button>
                                        </form>
                                    </CardBody>
                                    <CardBody>
                                        <FormGroup>
                                            <Label for="releaseSelect">Показать новости</Label>
                                            <Input type="select" name="releaseSelect" id="releaseSelect"
                                                onChange={(e) => this.setReleaseArticleUser(e.target.selectedOptions[0].id)}
                                            >
                                                <option id="1">Все</option>
                                                <option id="2">Опубликованные</option>
                                                <option id="3">Неопубликованные</option>
                                            </Input>
                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </div>
                        <div>
                            <br />
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th class="item" onClick={this.getArticleUserSortID}>ID
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
                                            </svg>
                                        </th>
                                        <th>Тема</th>
                                        <th>Название</th>
                                        <th width="180" class="item" onClick={this.getArticleUserSortDateRelease}>Дата публикации
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
                                            </svg>
                                        </th>
                                        <th>Опубликована</th>
                                        <th>Блокировка</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listArticleUser.map(article =>
                                        <tr key={article.articleID}>
                                            <td align="right">{article.articleID}</td>
                                            {listTopic
                                                .filter(topic => article.topicID == topic.topicID)
                                                .slice(0, 1)
                                                .map(topic =>
                                                    <td>{topic.name}</td>
                                                )}
                                            <td>{article.name}</td>
                                            <td>{article.dateRelease}</td>
                                            <td align="center" valign="middle">{article.statusRelease}</td>
                                            <td align="center" valign="middle"><input type="checkbox" id={"blockArticleUserCheck" + article.articleID} onChange={() => this.editBanArticle(article.articleID)} /></td>
                                            <td align="center">
                                                <ButtonGroup>
                                                    <Button color="warning" onClick={() => this.editArticle(article.articleID)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                                        </svg>
                                                    </Button>
                                                    <Button color="danger" onClick={() => this.toggleModalDeleteArticle(article.articleID)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                        </svg>
                                                    </Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    {/*Список пользователей*/}
                    <div class="tab-pane fade" id="user" role="tabpanel" aria-labelledby="user-tab">
                        <br />
                        <div>
                            <Button onClick={this.toggleCollapseFilterUser} style={{ marginBottom: '1rem' }}>Фильтр</Button>
                            <Collapse isOpen={this.state.modalCollapseFilterUser}>
                                <Card>
                                    <CardBody>
                                        <form class="form-inline mt-2 mt-md-0" onSubmit={this.getUserSearch}>
                                            <input class="form-control mr-sm-2" type="text" placeholder="Имя пользователя" aria-label="Имя пользователя" required />
                                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск</button>
                                        </form>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </div>
                        <div>
                            <br />
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th class="item" onClick={this.getUserSortID}>ID
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
                                            </svg>
                                        </th>
                                        <th>Имя пользователя</th>
                                        <th>Email</th>
                                        <th>Роль</th>
                                        <th>Подтверждение email</th>
                                        <th>Дата регистрации</th>
                                        <th>Блокировка</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser.map(user =>
                                        <tr key={user.userID}>
                                            <td align="right">{user.userID}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td align="center">{user.emailConfirmed}</td>
                                            <td>{user.dateRegistration}</td>
                                            <td align="center"><input type="checkbox" id={"blockCheck" + user.userID} onChange={() => this.editBanUser(user.userID)}/></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    {/*Список тем*/}
                    <div class="tab-pane fade" id="topic" role="tabpanel" aria-labelledby="topic-tab">
                        <div>
                            <br />
                            <Form inline onSubmit={this.createTopic}>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="topicText" className="mr-sm-2">Название</Label>
                                    <Input type="text" name="topicText" id="topicText" placeholder="Название..." />
                                </FormGroup>
                                <Button>Добавить тему</Button>
                            </Form>
                            <br />
                            <div>
                                <Button onClick={this.toggleCollapseFilterTopic} style={{ marginBottom: '1rem' }}>Фильтр</Button>
                                <Collapse isOpen={this.state.modalCollapseFilterTopic}>
                                    <Card>
                                        <CardBody>
                                            <form class="form-inline mt-2 mt-md-0" onSubmit={this.getTopicSearch}>
                                                <input class="form-control mr-sm-2" type="text" placeholder="Название" aria-label="Название" required />
                                                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск</button>
                                            </form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </div>
                            <br />
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th class="item" onClick={this.getTopicSortID}>ID
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
                                            </svg>
                                        </th>
                                        <th>Название</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTopic.map(topic =>
                                        <tr key={topic.topicID}>
                                            <td align="right">{topic.topicID}</td>
                                            <td>{topic.name}</td>
                                            <td align="center"><Button color="danger" onClick={() => this.toggleModalDeleteTopic(topic.topicID)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <br />
                <br />

                <Modal isOpen={this.state.modalDeleteArticle} toggle={this.toggleModalDeleteArticle} backdrop="static" >
                    <ModalHeader toggle={this.toggleModalDeleteArticle}>
                        Удаление новости
                    </ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить выбранную статью?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.deleteArticle}>Да</Button>{' '}
                        <Button onClick={this.toggleModalDeleteArticle}>Нет</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalDeleteTopic} toggle={this.toggleModalDeleteTopic} backdrop="static" >
                    <ModalHeader toggle={this.toggleModalDeleteTopic}>
                        Удаление темы новостей
                    </ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить выбранную тему?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.deleteTopic}>Да</Button>{' '}
                        <Button onClick={this.toggleModalDeleteTopic}>Нет</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalCreateUser} toggle={this.toggleModalCreateUser}>
                    <ModalHeader toggle={this.toggleModalCreateUser}>Добавление пользователя</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.createUser}>
                            <FormGroup>
                                <Label for="username">Имя пользователя</Label>
                                <Input name="username" id="username" placeholder="Имя пользователя" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="role">Роль пользователя</Label>
                                <Input type="select" name="role" id="role" cols="20">
                                    <option id="user">
                                        Пользователь
                                    </option>
                                    <option id="admin">
                                        Администратор
                                    </option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Электронная почта</Label>
                                <Input name="email" id="email" placeholder="Электронная почта" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Пароль</Label>
                                <Input type="password" name="password" id="password" placeholder="Пароль" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="passwordRepeat">Подтвердите свой пароль</Label>
                                <Input type="password" name="passwordRepeat" id="passwordRepeat" placeholder="Подтверждение пароля" />
                            </FormGroup>
                            <Button>Добавить пользователя</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

    toggleModalDeleteArticle = (articleID) => {
        if (!this.state.modalDeleteArticle) {
            this.setState({
                articleID: articleID
            });
        }
        this.setState({
            modalDeleteArticle: !this.state.modalDeleteArticle
        });
    }

    toggleModalDeleteTopic = (topicID) => {
        if (!this.state.modalDeleteTopic) {
            this.setState({
                topicID: topicID
            });
        }
        this.setState({
            modalDeleteTopic: !this.state.modalDeleteTopic
        });
    }

    toggleModalCreateUser = () => {
        this.setState({
            modalCreateUser: !this.state.modalCreateUser
        });
    }

    activeNavTopic = () => {
        this.getTopicList();
        this.toggleCloseCollapseFilterAll();

        document.getElementById("topic-tab").setAttribute("aria-expanded", "true");
        document.getElementById("topic-tab").setAttribute("class", "nav-link active");
        document.getElementById("topic").setAttribute("class", "tab-pane fade show active");

        document.getElementById("article-all-tab").setAttribute("aria-expanded", "false");
        document.getElementById("article-all-tab").setAttribute("class", "nav-link");
        document.getElementById("articleAll").setAttribute("class", "tab-pane fade");

        document.getElementById("article-release-tab").setAttribute("aria-expanded", "false");
        document.getElementById("article-release-tab").setAttribute("class", "nav-link")
        document.getElementById("articleRelease").setAttribute("class", "tab-pane fade");

        document.getElementById("user-tab").setAttribute("aria-expanded", "false");
        document.getElementById("user-tab").setAttribute("class", "nav-link")
        document.getElementById("user").setAttribute("class", "tab-pane fade");
    }

    activeNavArticle = () => {
        this.getArticleList();
        this.toggleCloseCollapseFilterAll();

        document.getElementById("topic-tab").setAttribute("aria-expanded", "false");
        document.getElementById("topic-tab").setAttribute("class", "nav-link")
        document.getElementById("topic").setAttribute("class", "tab-pane fade");

        document.getElementById("article-all-tab").setAttribute("aria-expanded", "true");
        document.getElementById("article-all-tab").setAttribute("class", "nav-link active")
        document.getElementById("articleAll").setAttribute("class", "tab-pane fade show active");

        document.getElementById("article-release-tab").setAttribute("aria-expanded", "false");
        document.getElementById("article-release-tab").setAttribute("class", "nav-link")
        document.getElementById("articleRelease").setAttribute("class", "tab-pane fade");

        document.getElementById("user-tab").setAttribute("aria-expanded", "false");
        document.getElementById("user-tab").setAttribute("class", "nav-link")
        document.getElementById("user").setAttribute("class", "tab-pane fade");
    }

    activeNavArticleUser = () => {
        this.getArticleUserList();
        this.toggleCloseCollapseFilterAll();

        document.getElementById("topic-tab").setAttribute("aria-expanded", "false");
        document.getElementById("topic-tab").setAttribute("class", "nav-link")
        document.getElementById("topic").setAttribute("class", "tab-pane fade");

        document.getElementById("article-all-tab").setAttribute("aria-expanded", "false");
        document.getElementById("article-all-tab").setAttribute("class", "nav-link")
        document.getElementById("articleAll").setAttribute("class", "tab-pane fade");

        document.getElementById("article-release-tab").setAttribute("aria-expanded", "true");
        document.getElementById("article-release-tab").setAttribute("class", "nav-link active")
        document.getElementById("articleRelease").setAttribute("class", "tab-pane fade show active");

        document.getElementById("user-tab").setAttribute("aria-expanded", "false");
        document.getElementById("user-tab").setAttribute("class", "nav-link")
        document.getElementById("user").setAttribute("class", "tab-pane fade");
    }

    activeNavUser = () => {
        this.getArticleUserList();
        this.toggleCloseCollapseFilterAll();

        document.getElementById("topic-tab").setAttribute("aria-expanded", "false");
        document.getElementById("topic-tab").setAttribute("class", "nav-link")
        document.getElementById("topic").setAttribute("class", "tab-pane fade");

        document.getElementById("article-all-tab").setAttribute("aria-expanded", "false");
        document.getElementById("article-all-tab").setAttribute("class", "nav-link")
        document.getElementById("articleAll").setAttribute("class", "tab-pane fade");

        document.getElementById("article-release-tab").setAttribute("aria-expanded", "false");
        document.getElementById("article-release-tab").setAttribute("class", "nav-link")
        document.getElementById("articleRelease").setAttribute("class", "tab-pane fade");

        document.getElementById("user-tab").setAttribute("aria-expanded", "true");
        document.getElementById("user-tab").setAttribute("class", "nav-link active")
        document.getElementById("user").setAttribute("class", "tab-pane fade show active");
    }

    parseDatetime = (dateAndTime) => {
        if (dateAndTime.length > 0) {
            let datetime = ('' + dateAndTime + '').split("T");
            let date = datetime[0].split("-");
            let time = datetime[1].split(":");
            datetime = date[2] + "-" + date[1] + "-" + date[0] + ", " + time[0] + ":" + time[1];
            return datetime;
        }
    }

    //--------------Формы всех фильтров----------------------------------------------------------------------------------------------------------------------------

    toggleCloseCollapseFilterAll = () => {
        this.setState({ modalCollapseFilterArticle: false });
        this.setState({ modalCollapseFilterArticleUser: false });
        this.setState({ modalCollapseFilterUser: false });
        this.setState({ modalCollapseFilterTopic: false });
    }

    toggleCollapseFilterArticle = () => {
        this.setState({
            modalCollapseFilterArticle: !this.state.modalCollapseFilterArticle
        });
    }
    
    toggleCollapseFilterArticleUser = () => {
        this.setState({
            modalCollapseFilterArticleUser: !this.state.modalCollapseFilterArticleUser
        });
    }

    toggleCollapseFilterUser = () => {
        this.setState({
            modalCollapseFilterUser: !this.state.modalCollapseFilterUser
        });
    }

    toggleCollapseFilterTopic = () => {
        this.setState({
            modalCollapseFilterTopic: !this.state.modalCollapseFilterTopic
        });
    }

    //----Сортировка-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    getArticleSortID = () => {
        let sort = this.state.sortArticleID;
        let url = 'api/article/getArticleSortID?sort=' + sort;
        this.getArticleListSubmit(url);
        this.setState({ sortArticleID: !sort });
    }

    getArticleSortDateRelease = () => {
        let sort = this.state.sortArticleStatusRelease;
        let url = 'api/article/getArticleSortDateRelease?sort=' + sort;
        this.getArticleListSubmit(url);
        this.setState({ sortArticleStatusRelease: !sort });
    }

    getArticleUserSortID = () => {
        let sort = this.state.sortArticleUserID;
        let url = 'api/article/getArticleUserSortID?sort=' + sort;
        this.getArticleUserListSubmit(url);
        this.setState({ sortArticleUserID: !sort });
    }

    getArticleUserSortDateRelease = () => {
        let sort = this.state.sortArticleUserStatusRelease;
        let url = 'api/article/getArticleUserSortDateRelease?sort=' + sort;
        this.getArticleUserListSubmit(url);
        this.setState({ sortArticleUserStatusRelease: !sort });
    }

    getUserSortID = () => {
        let sort = this.state.sortUserID;
        let url = 'api/article/getUserSortID?sort=' + sort;
        this.getUserListSubmit(url);
        this.setState({ sortUserID: !sort });
    }

    getTopicSortID = () => {
        let sort = this.state.sortTopicID;
        let url = 'api/article/getTopicSortID?sort=' + sort;
        this.getTopicListSubmit(url);
        this.setState({ sortTopicID: !sort });
    }

    //----Запросы-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    getArticleListSubmit = (url) => {
        let token = localStorage.getItem(this.state.keyToken);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then((response) => response.json())
            .then(response => {
                let listArticle = response;
                for (var i = 0; i < listArticle.length; i++) {
                    if (listArticle[i].statusRelease == true) {
                        listArticle[i].statusRelease = "+";
                    } else {
                        listArticle[i].statusRelease = "-";
                    }

                    if (listArticle[i].dateRelease != null) {
                        listArticle[i].dateRelease = this.parseDatetime(listArticle[i].dateRelease);
                    } else {
                        listArticle[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticle: listArticle });
                this.setBlockArticleCheck(listArticle);
            })
    }

    getArticleUserListSubmit = (url) => {
        let token = localStorage.getItem(this.state.keyToken);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then((response) => response.json())
            .then(response => {
                let listArticleUser = response;
                for (var i = 0; i < listArticleUser.length; i++) {
                    if (listArticleUser[i].statusRelease == true) {
                        listArticleUser[i].statusRelease = "+";
                    } else {
                        listArticleUser[i].statusRelease = "-";
                    }

                    if (listArticleUser[i].dateRelease != null) {
                        listArticleUser[i].dateRelease = this.parseDatetime(listArticleUser[i].dateRelease);
                    } else {
                        listArticleUser[i].dateRelease = "-";
                    }
                }
                this.setState({ listArticleUser: listArticleUser });
                this.setBlockArticleCheck(listArticleUser);
            })
    }

    getUserListSubmit = (url) => {
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                let listUser = response;
                for (var i = 0; i < listUser.length; i++) {
                    if (listUser[i].emailConfirmed == true) {
                        listUser[i].emailConfirmed = "+";
                    } else {
                        listUser[i].emailConfirmed = "-";
                    }

                    if (listUser[i].dateRegistration != null) {
                        listUser[i].dateRegistration = this.parseDatetime(listUser[i].dateRegistration);
                    } else {
                        listUser[i].dateRegistration = "-";
                    }
                }
                this.setState({ listUser: listUser });
                this.setBlockCheck(response);
            })
    }

    getTopicListSubmit = (url) => {
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listTopic: response });
            })
    }

    checkAuthorization = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/authorization/checkAuthorization';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Авторизируйтесь');
                    localStorage.removeItem(this.state.keyLogin);
                    localStorage.removeItem(this.state.keyRole);
                    localStorage.removeItem(this.state.keyToken);
                    window.location.href = '/';
                }
                else {
                    this.getAllList();
                }
            })
    } 
}