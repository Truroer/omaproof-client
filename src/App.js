// @flow
import React, { Component } from 'react';
import { Router, Match } from '@reach/router';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from './styledComponents/globalStyles';
import UserContext from './contexts/userContext';
import Auth from './components/auth';
import NewPost from './components/newPost';
import NavBar from './components/navBar';
import OmaLogin from './components/omaLogin';
import GroupChooser from './components/groupChooser';
import Landing from './components/landing';
import Feed from './components/feed';
import { lightTheme, darkTheme } from './themes/themes';
import type { AppState } from './flow/types';
import CreateGroup from './components/createGroup/createGroup';

import './style.css';
import RegularLogin from './components/regularLogin';

class App extends Component<null, AppState> {
  state = {
    theme: true,
    user: {}
  };

  componentDidMount() {
    const lsUser = localStorage.getItem('user') || '{}';
    this.setState({
      user: JSON.parse(lsUser) || {
        id: '',
        name: 'Guest',
        picture: '',
        activeGroup: '',
        groups: []
      }
    });
  }

  toggleTheme = () => {
    this.setState({ theme: !this.state.theme });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          updateUser: user =>
            this.setState({ user: { ...this.state.user, ...user } }, () =>
              localStorage.setItem('user', JSON.stringify(this.state.user))
            )
        }}
      >
        <ThemeProvider theme={this.state.theme ? lightTheme : darkTheme}>
          <React.Fragment>
            <GlobalStyle />

            <Match path="/">
              {props =>
                props.match ? null : (
                  <NavBar
                    user={this.state.user}
                    theme={this.state.theme ? 'light' : 'dark'}
                    toggleTheme={this.toggleTheme}
                  />
                )
              }
            </Match>
            <Router>
              <Landing path="/" />
              <RegularLogin path="/regular-login" />
              <Feed path="/feed" />
              <Auth path="/login" />
              <CreateGroup path="/create-group" user={this.state.user} />
              <GroupChooser path="/group-chooser" />
              <NewPost path="/new-post" user={this.state.user} />
              <OmaLogin path="/oma-login" />
            </Router>
          </React.Fragment>
        </ThemeProvider>
      </UserContext.Provider>
    );
  }
}

export default App;
