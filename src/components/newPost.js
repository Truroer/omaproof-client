import React from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';

import Textarea from '../styledComponents/textarea';
import Button from '../styledComponents/button';
import CREATE_POST_MUTATION from '../graphql/mutations/createPost';
import GET_POSTS_QUERY from '../graphql/queries/getPosts';

const StyledNewPost = styled.div`
  padding: 1em 18px;

  div.input {
    margin-top: 2em;
    position: relative;
  }

  .user-profile {
    position: absolute;
    border-radius: 50%;
    bottom: 22px;
  }

  input[type='file'] {
    display: none;
  }

  .media-label {
    &:hover {
      cursor: pointer;
    }
  }

  .uploaded-media {
  }

  textarea {
    width: 100%;
    margin: 1em 0;
  }

  button {
    margin: 1em 0;
    width: 100%;
  }

  img.uploaded-media {
    width: 100%;
  }

  .hd {
    margin-top: 1em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .icon-photo,
  .icon-remove {
    margin: 0.3em;
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
  }

  .links {
    text-decoration: underline;
    color: ${props => props.theme.colors.primary};
  }

  .writePost {
    flex-grow: 2;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }
`;
class NewPost extends React.Component {
  state = {
    description: '',
    mediaUrl: '',
    uploading: false
  };

  fileInput = React.createRef();

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  uploadImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    this.setState({ uploading: true });

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'omaproof');

    await fetch('https://api.cloudinary.com/v1_1/errstate/image/upload', {
      method: 'POST',
      body: data
    })
      .then(data => data.json())
      .then(data =>
        this.setState({ mediaUrl: data.secure_url, uploading: false })
      );
  };

  isPostValid() {
    return this.state.description.length && this.state.mediaUrl.length;
  }

  render() {
    const { user } = this.props;
    return (
      <Mutation
        mutation={CREATE_POST_MUTATION}
        variables={{
          contentType: 'IMAGE',
          description: this.state.description,
          mediaUrl: this.state.mediaUrl,
          token: user.groupToken
        }}
        refetchQueries={[
          {
            query: GET_POSTS_QUERY,
            variables: { id: user.activeGroup, token: user.groupToken }
          }
        ]}
      >
        {createPost => (
          <StyledNewPost>
            <div className="hd">
              <div className="writePost">WRITE YOUR POST </div>

              <span className="links" onClick={this.props.close}>
                Cancel
              </span>
              <span className="icon-remove" onClick={this.props.close} />
            </div>
            <div className="input">
              <img
                src="http://placehold.it/32x32"
                alt="me"
                onChange={this.handleChange}
                className="user-profile"
              />
              <Textarea
                value={this.state.description}
                name="description"
                id="description"
                placeholder="Tell me something"
                onChange={this.handleChange}
              />
            </div>
            <span className="icon-photo" />
            <label className="media-label links" htmlFor="media">
              Add a photo
            </label>
            <input
              accept="image/*"
              id="media"
              type="file"
              ref={this.fileInput}
              onChange={this.uploadImage}
            />
            {this.state.uploading && <div>Uploading picture</div>}
            {this.state.mediaUrl && (
              <img
                src={this.state.mediaUrl}
                className="uploaded-media"
                alt="uploaded-media"
              />
            )}
            <Button
              onClick={() => {
                if (this.isPostValid()) {
                  createPost();
                  this.props.close();
                }
              }}
            >
              Publish
            </Button>
          </StyledNewPost>
        )}
      </Mutation>
    );
  }
}

export default NewPost;
