import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, Media  } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Table } from 'reactstrap';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/image.css';

export class EmailConfirmed extends Component {
    static displayName = EmailConfirmed.name;
    constructor(props) {
        super(props);
        this.state = {
            keyUsername: 0,
            keyToken: 'token',
            article: [],
            listImage: [],
            message: "Подождите, идет подтверждение регистрации"
        };
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        const token = this.props.match.params.token;
        debugger;
        this.setState({
            keyUsername: username,
            keyToken: token
        });
        this.confirmEmailSubmit(username, token);
    }

    confirmEmailSubmit = (username, token) => {
        debugger;
        let url = 'api/registry/confirmEmail';
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
                    this.setState({
                        message: "Ошибка при подтверждении регистрации!"
                    });
                }
                else {
                    this.setState({
                        message: "Регистрация завершена!"
                    });
                }
            })
    }

    render() {
        let message = this.state.message;
        return (
            <div>
                <h1>
                    Подтверждение регистрации
                </h1>
                <h4>
                    {message}
                </h4>
                <br />
                <h6>
                    <a href="/">Перейти на главную страницу</a>
                </h6>
            </div>
        );
    }
}