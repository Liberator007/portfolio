import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, Media } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Table } from 'reactstrap';
import { Link } from "react-router-dom"
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/image.css';
import './css/article.css';
import './css/comment.css';

export class Article extends Component {
    static displayName = Article.name;
    constructor(props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyRole: 'role',
            keyToken: 'token',
            editorState: EditorState.createEmpty(),
            modalEditComment: false,
            modalDeleteComment: false,
            articleID: 0,
            commentID: 0,
            article: [],
            topic: [],
            comment: [],
            listImageID: [],
            listImage: [],
            listComment: [],
            listUser: [],
            rateArticle: [],
            rateArticleUser: [],
            listRateComment: [],
            listRateCommentUser: []
        };
    }

    componentDidMount() {
        const articleID = this.props.match.params.articleID;
        this.setState({ articleID: articleID });
        this.getArticleRequest(articleID);       
        this.getCommentList(articleID);
        this.getUserList(articleID);

        this.getRateArticle(articleID);
        this.getRateArticleUser(articleID);
        let rateArticleUser = this.state.rateArticleUser; 
        this.setRateArticle(rateArticleUser);

        this.getRateCommentList(articleID);

        this.getUserID();
    }

    //-------Загрузка основных данных при открытии страницы---------------------------------------------------------------------------------------------------------------------------------------
    getArticleRequest = (articleID) => {
        fetch('api/article/getArticle?articleID=' + articleID, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ article: response });
                let articleID = this.state.article.articleID;
                this.setHtmlCode(response);
                let topicID = response.topicID;
                this.getTopicRequest(topicID);
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
                listImage.push(response);
                this.setState({ listImage: listImage });
            })
    }

    getTopicRequest = (topicID) => {
        let url = 'api/article/getTopic?topicID=' + topicID;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ topic: response });
            })
    }

    getCommentList = (articleID) => {
        let url = 'api/comment/getCommentList?articleID=' + articleID;
        fetch(url)
            .then((response) => response.json())
            .then(response => {
                this.setState({ listComment: response });
            })
    }

    getUserList = (articleID) => {
        let url = 'api/comment/getUserComment?articleID=' + articleID;
        fetch(url)
            .then((response) => response.json())
            .then(response => {
                this.setState({ listUser: response });
            })
    }

    //----Добавление, редактирование и удаление комментариев--------------------------------------------------------------------------------------------------------------------

    getUserID = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/comment/getUserID';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ userID: response });
            })
    }

    getComment = (commentID) => {
        let url = 'api/comment/getComment?commentID=' + commentID;
        fetch(url)
            .then((response) => response.json())
            .then(response => {
                this.setState({ comment: response });
            })
    }

    addComment = (e) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/comment/createComment';
        e.preventDefault();
        let text = e.currentTarget.elements[0].value;
        let articleID = this.state.articleID;
        let body = {
            Text: text,
            ArticleID: articleID
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
                    let articleID = this.state.articleID;
                    this.getCommentList(articleID);
                    this.getUserList(articleID);
                    this.getRateArticle(articleID);
                    this.getRateArticleUser(articleID);
                    let rateArticleUser = this.state.rateArticleUser;
                    this.setRateArticle(rateArticleUser);
                    this.getRateCommentList(articleID);
                    this.getUserID();
                    document.getElementById("commentText").value = "";
                }
            })
    }

    async updateCommentSubmit(body) {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/comment/updateComment';
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body),
            referrer: 'no-referrer'
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Ошибка при изменении');
                    this.toggleModalEditComment();
                }
                else {
                    let articleID = this.state.articleID;
                    this.getCommentList(articleID);
                    this.getUserList(articleID);
                    this.getRateArticle(articleID);
                    this.getRateArticleUser(articleID);
                    let rateArticleUser = this.state.rateArticleUser;
                    this.setRateArticle(rateArticleUser);
                    this.getRateCommentList(articleID);
                    this.getUserID();
                    this.toggleModalEditComment();
                    document.getElementById("commentText").value = "";
                }
            })
    }

    async deleteCommentSubmit(commentID) {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/comment/deleteComment?commentID=' + commentID;
        await fetch(url, {
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
                    this.toggleModalDeleteComment();
                }
                else {
                    let articleID = this.state.articleID;
                    this.getCommentList(articleID);
                    this.getUserList(articleID);
                    this.getRateArticle(articleID);
                    this.getRateArticleUser(articleID);
                    let rateArticleUser = this.state.rateArticleUser;
                    this.setRateArticle(rateArticleUser);
                    this.getRateCommentList(articleID);
                    this.getUserID();
                    this.toggleModalDeleteComment();
                }
            })
    }

    updateComment = (e) => {
        e.preventDefault();
        let comment = this.state.comment;
        let body = {
            CommentID: comment.commentID,
            Text: comment.text,
        };
        this.updateCommentSubmit(body);
    }

    deleteComment = (e) => {
        e.preventDefault();
        let commentID = this.state.commentID;
        this.deleteCommentSubmit(commentID);
    }

    //---Оценка новостей-------------------------------------------------------------------------------------------------------------------------------------------

    getRateArticle = (articleID) => {
        let url = 'api/rateArticle/getRateArticle?articleID=' + articleID;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ rateArticle: response });
            })
    }

    getRateArticleUser = (articleID) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/rateArticle/getRateArticleUser?articleID=' + articleID;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer'
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ rateArticleUser: response });
                this.setRateArticle(response);
            })
    }

    changeLikeArticle = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let articleID = this.state.articleID;
        let url = 'api/rateArticle/changeLike?articleID=' + articleID;
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
                    alert('Пожалуйста авторизируйтесь');
                }
                else {
                    this.getRateArticle(articleID);
                    this.getRateArticleUser(articleID);
                }
            })
    }

    changeDislikeArticle = () => {
        let token = localStorage.getItem(this.state.keyToken);
        let articleID = this.state.articleID;
        let url = 'api/rateArticle/changeDislike?articleID=' + articleID;
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
                    alert('Пожалуйста авторизируйтесь');
                }
                else {
                    this.getRateArticle(articleID);
                    this.getRateArticleUser(articleID);
                }
            })
    }

    //------Оценка комментариев----------------------------------------------------------------------------------------------------------------------------------------

    getRateCommentList = (articleID) => {
        let url = 'api/rateComment/getRateCommentList?articleID=' + articleID;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listRateComment: response });
                //let listRateCommentUser = this.state.listRateCommentUser;
                //this.setRateCommentListUser(response, listRateCommentUser);
                this.getListRateCommentUser(articleID, response);
            })
    }

    getListRateCommentUser = (articleID, listRateComment) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/rateComment/getListRateCommentUser?articleID=' + articleID;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            referrer: 'no-referrer'
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listRateCommentUser: response });
                this.setRateCommentListUser(listRateComment, response);
            })
    }

    setRateCommentListUser = (listRateComment, listRateCommentUser) => {
        for (let rateComment of listRateComment) {
            let rCU;
            for (let rateCommentUser of listRateCommentUser) {
                if (rateComment.commentID == rateCommentUser.commentID) {
                    rCU = rateCommentUser;
                }
            };
            this.setRateComment(rCU, rateComment.commentID);
        };
    }

    changeLikeComment = (commentID) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/rateComment/changeLike?commentID=' + commentID;
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
                    alert('Пожалуйста авторизируйтесь');
                }
                else {
                    let articleID = this.state.articleID;
                    this.getRateCommentList(articleID);
                }
            })
    }

    changeDislikeComment = (commentID) => {
        let token = localStorage.getItem(this.state.keyToken);
        let url = 'api/rateComment/changeDislike?commentID=' + commentID;
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
                    alert('Пожалуйста авторизируйтесь');
                }
                else {
                    let articleID = this.state.articleID;
                    this.getRateCommentList(articleID);
                }
            })
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------

    parseDatetime = (dateAndTime) => {
        if (dateAndTime.length > 0) {
            let datetime = ('' + dateAndTime + '').split("T");
            let date = datetime[0].split("-");
            let time = datetime[1].split(":");
            datetime = date[2] + "-" + date[1] + "-" + date[0] + ", " + time[0] + ":" + time[1];
            return datetime;
        }
    }

    setHtmlCode = (article) => {
        let datetime = this.parseDatetime(article.dateRelease);

        document.getElementById("name").innerHTML = article.name;
        document.getElementById("description").innerHTML = article.description;
        document.getElementById("text").innerHTML = article.text;
        document.getElementById("dateRelease").innerHTML = datetime;
    }

    render() {
        let topic = this.state.topic;
        let listComment = this.state.listComment;
        let listUser = this.state.listUser;
        let userID = this.state.userID;
        let rateArticle = this.state.rateArticle;
        let listRateComment = this.state.listRateComment;
        let modalEditComment = this.state.modalEditComment;
        let modalDeleteComment = this.state.modalDeleteComment;

        return (
            <div class="perenos-hyphens displayed">
                <h1>
                    <div id="name" class="name">
                    </div>
                </h1>

                <h6>
                    <div id="topic">
                        <p class="text-muted text-sm"><i class="fa fa-mobile fa-lg"></i>Тема - {topic.name}</p>
                    </div>
                </h6>

                <b>
                    <h5>
                        <div id="description" align="justify">
                        </div>
                    </h5>
                </b>

                <div id="text">
                </div>

                <div id="dateRelease">
                </div>

                <div class="pad-ver">
                    <span class="tag tag-sm"><i class="fa fa-heart text-danger"></i>{rateArticle.like} лайка</span>
                    <div class="btn-group">
                        <a class="btn btn-sm btn-default btn-hover-success" onClick={this.changeLikeArticle}><i class="fa fa-thumbs-up">
                            <div id="articleLike">
                            </div>
                        </i></a>
                        <a class="btn btn-sm btn-default btn-hover-danger" onClick={this.changeDislikeArticle}><i class="fa fa-thumbs-down">
                            <div id="articleDislike">
                            </div>
                        </i></a>
                    </div>
                    <span class="tag tag-sm"><i class="fa fa-heart text-danger"></i>{rateArticle.dislike} дизлайка</span>
                </div>
                <hr />

                <div>
                    <section class="container">
                        <div class="row">

                            <div class="col-md-12">
                                <div class="panel">
                                    <div class="panel-body">
                                        <Form onSubmit={this.addComment}>
                                            <FormGroup>
                                                <Label for="commentText">Добавить комментарий</Label>
                                                <textarea name="commentText" id="commentText" class="form-control" rows="2" placeholder="Текст комментария"></textarea>
                                            </FormGroup>
                                            <div class="mar-top clearfix">
                                                <button class="btn btn-sm btn-primary pull-right"><i class="fa fa-pencil fa-fw"></i>Добавить</button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>

                                <h2>
                                    Комментарии
                                </h2>

                                <div class="panel">
                                    <div class="panel-body">
                                        <div class="media-block pad-all">

                                            {listComment
                                                .map(comment =>
                                                listUser
                                                    .filter(user => user.userID == comment.userID)
                                                    .slice(0, 1)
                                                    .map(user =>
                                                        <div key={comment.commentID} class="media-body">
                                                            <div class="mar-btm">
                                                                <a class="btn-link text-semibold media-heading box-inline">{user.username}</a>

                                                                {listUser
                                                                    .filter(user => (user.userID == userID) && (user.userID == comment.userID))
                                                                    .slice(0, 1)
                                                                    .map(user =>
                                                                        <div class="editComment">
                                                                            &emsp;&emsp;-&emsp;&emsp;<Link className='text-dark' to="#" onClick={() => this.toggleModalEditComment(comment.commentID)}>Изменить</Link>
                                                                            &emsp;<Link className='text-dark' to="#" onClick={() => this.toggleModalDeleteComment(comment.commentID)}>Удалить</Link>
                                                                        </div>
                                                                )}

                                                                <p class="text-muted text-sm"><i class="fa fa-mobile fa-lg"></i>{comment.dateAdded}</p>
                                                            </div>
                                                            <p>{comment.text}</p>
                                                            
                                                            <div class="pad-ver">
                                                                {listRateComment
                                                                    .filter(rateComment => rateComment.commentID == comment.commentID)
                                                                    .slice(0, 1)
                                                                    .map(rateComment =>
                                                                        <span class="tag tag-sm"><i class="fa fa-heart text-danger"></i>{rateComment.like} лайка</span>
                                                                    )}
                                                                <div class="btn-group">

                                                                    <a class="btn btn-sm btn-default btn-hover-success" onClick={() => this.changeLikeComment(comment.commentID)}><i class="fa fa-thumbs-up">
                                                                        <div id={"commentLike" + comment.commentID}>
                                                                        </div>
                                                                    </i></a>
                                                                    <a class="btn btn-sm btn-default btn-hover-danger" onClick={() => this.changeDislikeComment(comment.commentID)}><i class="fa fa-thumbs-down">
                                                                        <div id={"commentDislike" + comment.commentID}>
                                                                        </div>
                                                                    </i></a>

                                                                </div>
                                                                {listRateComment
                                                                    .filter(rateComment => rateComment.commentID == comment.commentID)
                                                                    .slice(0, 1)
                                                                    .map(rateComment =>
                                                                        <span class="tag tag-sm"><i class="fa fa-heart text-danger"></i>{rateComment.dislike} дизлайка</span>
                                                                )}
                                                            </div>
                                                            <hr />
                                                        </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

                <div>
                    <Modal isOpen={modalEditComment} toggle={this.toggleModalEditComment}>
                        <ModalHeader toggle={this.toggleModalEditComment}>Редактирование комментария</ModalHeader>
                        <ModalBody>
                            <div class="panel">
                                <div class="panel-body">
                                    <Form onSubmit={this.updateComment}>
                                        <FormGroup>
                                            <Label for="commentTextEdit">Редактировать комментарий</Label>
                                            <textarea class="form-control" rows="2" placeholder="Текст" required
                                                value={this.state.comment.text}
                                                onChange={(e) => {
                                                    let { comment } = this.state;
                                                    comment.text = e.target.value;
                                                    this.setState({ comment })
                                                }}
                                            ></textarea>
                                        </FormGroup>
                                        <div class="mar-top clearfix">
                                            <button class="btn btn-sm btn-primary pull-right"><i class="fa fa-pencil fa-fw"></i>Сохранить изменения</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>

                <div>
                    <Modal isOpen={modalDeleteComment} toggle={this.toggleModalDeleteComment}>
                        <ModalHeader toggle={this.toggleModalDeleteComment}>Удаление комментария</ModalHeader>
                        <ModalBody>
                            <div class="panel">
                                <div class="panel-body">
                                    <Form onSubmit={this.deleteComment}>
                                        <FormGroup>
                                            <Label>Вы действительно хотите удалить комментарий</Label>
                                        </FormGroup>
                                        <div class="mar-top clearfix">
                                            <button type="submit" class="btn btn-sm btn-primary pull-right"><i class="fa fa-pencil fa-fw"></i>Да</button> {' '}
                                            <button type="button" class="btn btn-sm btn-primary pull-right" onClick={this.toggleModalDeleteComment}><i class="fa fa-pencil fa-fw"></i>Нет</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }

    setLikeArticleActive = () => {
        document.getElementById("articleLike").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16"><path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" /></svg>';
    }

    setLikeArticleInactive = () => {
        document.getElementById("articleLike").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16"><path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" /></svg>';
    }

    setDislikeArticleActive = () => {
        document.getElementById("articleDislike").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16"><path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" /></svg>';
    }

    setDislikeArticleInactive = () => {
        document.getElementById("articleDislike").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16"><path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" /></svg>';
    }

    setRateArticle = (rateArticleUser) => {
        if ((typeof rateArticleUser != "undefined") && (rateArticleUser != null)) {
            if (rateArticleUser.like == true) {
                this.setLikeArticleActive();
            } else {
                this.setLikeArticleInactive();
            }
            if (rateArticleUser.dislike == true) {
                this.setDislikeArticleActive();
            } else {
                this.setDislikeArticleInactive();
            }
        } else {
            this.setLikeArticleInactive();
            this.setDislikeArticleInactive();
        }
    }

    setLikeCommentActive = (commentID) => {
        document.getElementById("commentLike" + commentID).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16"><path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" /></svg>';
    }

    setLikeCommentInactive = (commentID) => {
        document.getElementById("commentLike" + commentID).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16"><path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" /></svg>';
    }

    setDislikeCommentActive = (commentID) => {
        document.getElementById("commentDislike" + commentID).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16"><path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" /></svg>';
    }

    setDislikeCommentInactive = (commentID) => {
        document.getElementById("commentDislike" + commentID).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16"><path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" /></svg>';
    }

    setRateComment = (rateCommentUser, commentID) => {
        if ((typeof rateCommentUser != "undefined") && (rateCommentUser != null)) {
            if (rateCommentUser.like == true) {
                this.setLikeCommentActive(commentID);
            } else {
                this.setLikeCommentInactive(commentID);
            }
            if (rateCommentUser.dislike == true) {
                this.setDislikeCommentActive(commentID);
            } else {
                this.setDislikeCommentInactive(commentID);
            }
        } else {
            this.setLikeCommentInactive(commentID);
            this.setDislikeCommentInactive(commentID);
        }
    }

    toggleModalEditComment = (commentID) => {
        if (!this.state.modalEditComment) {
            this.setState({
                commentID: commentID
            });
            this.getComment(commentID);
        }
        this.setState({
            modalEditComment: !this.state.modalEditComment
        });
    }

    toggleModalDeleteComment = (commentID) => {
        if (!this.state.modalDeleteComment) {
            this.setState({
                commentID: commentID
            });
        }
        this.setState({
            modalDeleteComment: !this.state.modalDeleteComment
        });
    }
}