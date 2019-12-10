import React, { Component } from 'react';
import User from './User';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const userListQuery = gql`
    {
        users {
            id
            birthDate
            name
            type
        }
    }
`;

class UserList extends Component {

    render() {
        return (
            <Query query={userListQuery}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    const usersToRender = data.users;

                    return (
                        <div>
                            {usersToRender.map(user => <User key={user.id} user={user}/>)}
                        </div>
                    )
                }}
            </Query>
        )
    }
}


export default UserList;