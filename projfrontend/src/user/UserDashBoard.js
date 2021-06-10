import {
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import Base from "../core/Base";
import styled from "styled-components";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";

const UserDashBoard = () => {
  return (
    <Base>
      <Container>
        <UserDashBoardMain>
          <Title>Admin Profile</Title>
          <Body>
            <Name>Name: {isAuthenticated().user.name}</Name>
            <Name>LastName: {isAuthenticated().user.lastname}</Name>
            <Name>Email: {isAuthenticated().user.email}</Name>
          </Body>
        </UserDashBoardMain>
      </Container>
    </Base>
  );
};

export default UserDashBoard;

const UserDashBoardMain = styled.div`
  margin: 70px 0px;
  text-align: center;
  border-radius: 6px;
  box-shadow: 2px 2px 9px 5px rgba(0, 0, 0, 0.2);
  height: 250px;
`;

const Title = styled.div`
  font-weight: 600;

  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  float: left;
  margin: 15px;
`;

const Name = styled.span`
  margin: 15px;
  display: block;
  font-size: 20px;
  font-weight: 600;
`;
