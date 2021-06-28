import React, { Component } from 'react'
import { Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class Profile extends Component {
    static displayName = Profile.name;
    constructor(props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyRole: 'role',
            keyToken: 'token',
            modalDeleteSubscription: false,
            userID: 0,
            subscriptionID: 0,
            listTopic: [],
            listSubscription: []
        };
    }

    componentDidMount() {
        this.checkAuthorization();
    }

    async getSubscriptionList() {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/subscription/getSubscriptionList';
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listSubscription: response });
            })
    }

    async getTopicList() {
        let url = 'api/article/getTopicList';
        await fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listTopic: response });
            })
    }

    addSubscription = (e) => {
        let token = localStorage.getItem(this.state.keyToken);
        e.preventDefault();
        let topicID = Number(e.currentTarget.elements[0].selectedOptions[0].id);
        let url = 'api/subscription/createSubscription?topicID=' + topicID;
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
                    alert('Ошибка при добавлении');
                }
                else {
                    this.getSubscriptionList();
                    this.getTopicList();
                }
            })
    }

    deleteSubscription = (e) => {
        e.preventDefault();
        let token = localStorage.getItem(this.state.keyToken);
        let subscriptionID = this.state.subscriptionID;
        let url = 'api/subscription/deleteSubscription?subscriptionID=' + subscriptionID;
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
                    this.toggleModalDeleteSubscription();
                }
                else {
                    this.toggleModalDeleteSubscription();
                    this.getSubscriptionList();
                    this.getTopicList();
                }
            })
    }

    render() {
        let modalDeleteSubscription = this.state.modalDeleteSubscription;
        let listSubscription = this.state.listSubscription;
        let listTopic = this.state.listTopic;
        return (
            <div>
                <h3>Подписки</h3>
                <br />
                <Form inline onSubmit={this.addSubscription}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="selectTopic" className="mr-sm-2">Выберите тему</Label>
                        <Input type="select" name="selectTopic" id="selectTopic" required >
                            {listTopic.map(topic =>
                                <option id={topic.topicID}>
                                    {topic.name}
                                </option>
                            )}
                        </Input>
                    </FormGroup>
                    <Button>Добавить подписку</Button>
                </Form>
                <br />
                <Table bordered>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тема</th>
                            <th>Удаление</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listSubscription.map(subscription =>
                            <tr key={subscription.subscriptionID}>
                                <td align="right" width="150">{subscription.subscriptionID}</td>
                                {listTopic
                                    .filter(topic => subscription.topicID == topic.topicID)
                                    .slice(0, 1)
                                    .map(topic =>
                                        <td>{topic.name}</td>
                                )}
                                <td width="60" align="center">
                                    <Button color="warning" onClick={() => this.toggleModalDeleteSubscription(subscription.subscriptionID)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Modal isOpen={modalDeleteSubscription} toggle={this.toggleModalDeleteSubscription}>
                    <ModalHeader toggle={this.toggleModalDeleteSubscription}>Modal title</ModalHeader>
                    <ModalBody>
                        <h6>Удаление комментария</h6>
                        <div class="panel">
                            <div class="panel-body">
                                <Form onSubmit={this.deleteSubscription}>
                                    <FormGroup>
                                        <Label>Вы действительно хотите отказаться от данной подписки?</Label>
                                    </FormGroup>
                                    <div class="mar-top clearfix">
                                        <button type="submit" class="btn btn-sm btn-primary pull-right"><i class="fa fa-pencil fa-fw"></i>Да</button> {' '}
                                        <button type="button" class="btn btn-sm btn-primary pull-right" onClick={this.toggleModalDeleteSubscription}><i class="fa fa-pencil fa-fw"></i>Нет</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

    toggleModalDeleteSubscription = (subscriptionID) => {
        if (!this.state.modalDeleteSubscription) {
            this.setState({
                subscriptionID: subscriptionID
            });
        }
        this.setState({
            modalDeleteSubscription: !this.state.modalDeleteSubscription
        });
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
                    this.getSubscriptionList();
                    this.getTopicList();
                }
            })
    }
}