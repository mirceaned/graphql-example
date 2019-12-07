import React, { Component } from 'react'
import User from './User'

class UserList extends Component {
    render() {
        const usersToRender = [
            {
                id: '1',
                name: 'John',
            },
            {
                id: '2',
                name: 'Mary'
            },
        ];

        return (
            <div>{usersToRender.map(user => <User user={user}/>)}</div>
        )
    }
}

export default UserList;