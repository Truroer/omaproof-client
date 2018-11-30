import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledNavBar = styled.nav`
  display: flex;
  justify-content: flex-end;
  background-color: ${props => props.theme.colors.blue};
  color: white;
  height: 50px;
  padding: 0.5em 0;

  a,
  div {
    margin-right: 0.7em;
    color: white;
  }
`;

class NavBar extends React.Component {
  render() {
    return (
      <StyledNavBar>
        <div>{this.props.user.name}</div>
        <Link to="/">Feed</Link>
        <Link to="/login">Login</Link>
      </StyledNavBar>
    );
  }
}

export default NavBar;
