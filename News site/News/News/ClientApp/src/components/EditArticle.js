import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, Media, ButtonGroup } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Table } from 'reactstrap';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/image.css';
import './css/link.css';

export class EditArticle extends Component {
    static displayName = EditArticle.name;
    constructor(props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyToken: 'token',
            editorState: EditorState.createEmpty(),
            modalAddImage: false,
            dropdownOpen: false,
            articleID: 0,
            article: [],
            image: [],
            imagePreview: [],
            preview: [],
            previewImage: [],
            listImageID: [],
            listImage: [],
            listTopic: []
        };
    }

    componentDidMount() {
        const articleID = this.props.match.params.articleID;
        this.setState({ articleID: articleID });
        this.getArticleRequest(articleID);
        this.getTopicListRequest();
        this.getPreviewRequest(articleID);
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

    getArticleRequest = (articleID) => {
        fetch('api/article/getArticle?articleID=' + articleID, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ article: response });
                let articleID = response.articleID;
                this.setEditorState(response);
                this.getImageIdList(articleID);
            })
    }

    getImageIdList = (articleID) => {
        let url = 'api/image/getImageIdList?articleID=' + articleID;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listImageID: response });
                let listImageID = this.state.listImageID;
                for (let imageID of listImageID) {
                    this.getImageSelectById(imageID);
                };
            })
    }

    getImageSelectById = (imageID) => {
        fetch('api/image/getImage?imageID=' + imageID, {
            method: 'GET',
        })
            .then(response => {
                let listImage = this.state.listImage;
                listImage.push({
                    "imageID": imageID,
                    "url": response.url
                });
                this.setState({ listImage: listImage });
            })
    }

    getPreviewImageById = (imageID) => {
        fetch('api/image/getImage?imageID=' + imageID, {
            method: 'GET',
        })
            .then(response => {
                let previewImage = [];
                previewImage.push({
                    "imageID": imageID,
                    "url": response.url
                });
                this.setState({ previewImage: previewImage });
            })
    }

    getPreviewRequest = (articleID) => {
        let url = 'api/preview/getPreviewByID?articleID=' + articleID;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ preview: response });
                this.getPreviewImageById(response.imageID);
            })
    }

    editArticleSubmit = (body) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/article/updateArticle'
        fetch(url, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json', 
            "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body),
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при изменении новости');
                }
                else {
                    alert('Новость обновлена');
                }
            })
    }

    addArticleSubmit = (body) => {
        let token = localStorage.getItem(this.state.keyToken);
        fetch('api/admin/addArticle', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', 
            "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body),
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при добавлении новости');
                }
                else {
                    alert('Экземпляр новости создан');
                }
            })
    }

    addImageSubmit = (body) => {
        fetch('api/image/addImage', {
            mode: 'no-cors',
            method: 'POST',
            body: body
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка про добавлении изображения');
                }
                else {
                    alert('Изображение добавлено');
                    let articleID = this.state.articleID;
                    this.setState({ listImage: [] });
                    this.getImageIdList(articleID);
                }
            })
    }

    updatePreviewSubmit = (body) => {
        fetch('api/preview/updataPreview', {
            method: 'PUT',
            body: body
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка про изменении превью');
                }
                else {
                    alert('Изображение добавлено');
                    let articleID = this.state.articleID;
                    this.getArticleRequest(articleID);
                    this.getTopicListRequest();
                    this.getPreviewRequest(articleID);
                }
            })
    }

    releaseArticle = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let articleID = this.state.articleID;
        let url = 'api/article/releaseArticle?articleID=' + articleID;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при публикации новости');
                }
                else {
                    alert('Новостная статья опубликована');
                    window.location.href = '/administration';
                }
            })
    }

    // Добавление изображения
    addImage = (e) => {
        let articleID = this.state.articleID;
        let token = localStorage.getItem(this.state.keyToken);
        e.preventDefault();
        let formData = new FormData();
        let file = e.target.imageNews.files[0];
        formData.append('formFile', file);
        formData.append('articleID', articleID);
        this.addImageSubmit(formData, token);
    }

    // Удаление изображения
    deleteImage = (imageID) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/image/deleteImage?imageID=' + imageID;
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
                    let articleID = this.state.articleID;
                    this.getImageIdList(articleID);
                    this.getPreviewRequest(articleID);
                }
            })
    }

    editArticle = (e) => {
        let token = localStorage.getItem(this.state.keyToken);
        let htmlText = this.state.editorState;

        e.preventDefault();
        let articleID = this.state.articleID;
        let topicID = e.currentTarget.elements[0].selectedOptions[0].id
        let name = e.currentTarget.elements[1].value;
        let description = e.currentTarget.elements[2].value;
        let text = draftToHtml(convertToRaw(htmlText.getCurrentContent()));
        let statusRelease = false;
        let ban = false;

        let body = {
            ArticleID: articleID,
            Text: text,
            Name: name,
            Description: description,
            TopicID: topicID,
            StatusRelease: statusRelease,
            Ban: ban
        };
        debugger;
        this.editArticleSubmit(body, token);
    }

    setEditorState = (article) => {
        let text = article.text;
        if (typeof text != "undefined") {
            const contentBlock = htmlToDraft(text);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({
                    editorState: editorState,
                });
            }
        }
    }

    copyUrlImge = (urlImage) => {
        let text = document.getElementById(urlImage);
        text.select();
        document.execCommand("copy");
    }

    updatePreview = (e) => {
        let token = localStorage.getItem(this.state.keyToken);
        e.preventDefault();
        let articleID = this.state.articleID;
        e.preventDefault();
        let formData = new FormData();
        let file = e.target.imagePreview.files[0];
        formData.append('formFile', file);
        formData.append('articleID', articleID);

        this.updatePreviewSubmit(formData, token);
    }

    render() {
        let image = this.state.image;
        let preview = this.state.preview;
        
        let listImage = this.state.listImage;
        let previewImage = this.state.previewImage;
        let listTopic = this.state.listTopic;
        let article = this.state.article;
        debugger
        const { editorState } = this.state;

        let modalAddImage = this.state.modalAddImage;
        let dropdownOpen = this.state.dropdownOpen;

        let widthImage = 100;
        let heightImage = 100;
        let height = 20;
        let width = 20;

        let heightEdit = 16;
        let widthEdit = 16;
        return (
            <div>
                <Modal isOpen={modalAddImage} toggle={this.toggleModalAddImage}>
                    <ModalHeader toggle={this.toggleModalAddImage}>Редактирование предпросмотра</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.updatePreview}>
                            <FormGroup>
                                <div>
                                    {previewImage
                                        .slice(0, 1)
                                        .map(preview =>
                                            < img class="preview"
                                                src={preview.url}
                                                width={widthImage}
                                                height={heightImage}
                                            />
                                        )}
                                </div>
                                <br/>
                                <Label for="imagePreview">Изменить изображение</Label>
                                <Input type="file" name="imagePreview" id="imagePreview"/>
                            </FormGroup>
                            <Button color="warning">Сохранить предпросмотр</Button>
                        </Form>
                    </ModalBody>
                </Modal>

                <Button onClick={this.toggleModalAddImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={widthEdit} height={heightEdit} fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                    &nbsp;
                    Редактировать предпросмотр
                </Button>
                <br/>
                <br/>

                <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdownOpen}>
                    <DropdownToggle caret>
                        Список изображений
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Изображения</DropdownItem>
                        <DropdownItem divider />
                        <Form onSubmit={this.addImage}>
                            <FormGroup>
                                <Label for="imageNews">Выберите изображение</Label>
                                <Input type="file" name="imageNews" id="imageNews" onChange={image} />
                            </FormGroup>
                            &nbsp;<Button>
                                <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                Добавить изображение
                            </Button>
                        </Form>
                        <br />
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Изображение</th>
                                    <th>URL</th>
                                    <th>Копировать</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listImage.map(imageSome =>
                                    <tr>
                                        <td>
                                            id
                                        </td>
                                        <td>
                                            < img class="preview"
                                                src={imageSome.url}
                                                width={widthImage}
                                                height={heightImage}
                                            />
                                        </td>
                                        <td>
                                            <Input type="text" name="urlImage" id={imageSome.url} value={imageSome.url} readonly/>
                                        </td>
                                        <td>
                                            <ButtonGroup class="item">
                                                <Button onClick={() => this.copyUrlImge(imageSome.url)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-journals" viewBox="0 0 16 16">
                                                        <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z" />
                                                        <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z" />
                                                    </svg>
                                                </Button>
                                                <Button onClick={() => this.deleteImage(imageSome.imageID)}>
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
                    </DropdownMenu>
                </Dropdown>

                <br />
                <Form onSubmit={this.editArticle}>
                    <FormGroup>
                        <Label for="topic">Выберите тему новости</Label>
                        <Input type="select" name="topic" id="topic" cols="20">
                            {listTopic.map(topic =>
                                <option id={topic.topicID}>
                                    {topic.name}
                                </option>
                            )}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="name">Название</Label>
                        <Input type="text" name="name" id="name" placeholder="Название" required
                            value={this.state.article.name}
                            onChange={(e) => {
                                let { article } = this.state;
                                article.name = e.target.value;
                                this.setState({ article })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Описание</Label>
                        <Input type="textarea" name="description" id="description" rows="5" placeholder="Описание" required
                            value={this.state.article.description}
                            onChange={(e) => {
                                let { article } = this.state;
                                article.description = e.target.value;
                                this.setState({ article })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                        />
                    </FormGroup>
                    <br />
                    <Button type="submit">Сохранить изменения</Button>&nbsp;&nbsp;<Button type="button" onClick={this.releaseArticle}>Опубликовать статью</Button>
                    <br />
                    <br />
                    <br />
                </Form>
                
            </div>
        );
    }

    toggleDropdownOpen = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleModalAddImage = () => {
        this.setState({
            modalAddImage: !this.state.modalAddImage
        });
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
}