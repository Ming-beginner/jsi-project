import React from 'react';
import {Post, ChatNotification, ProfileHeader} from '../components';
import defaultAvatar from '../assets/imgs/default-avatar.png';

const Profile = () => {
    const posts = [
        {
            id: 1,
            author: {
                id: '5oaPenCF1GhwBapGM5p3KvMON112',
                name: 'Lê minh',
                avatar: 'https://lh3.googleusercontent.com/a-/AFdZucq_svPlKTbaBEVvP7Hh23F6WfmvCInjBC9AupUj=s96-c',
            },
            likes: 1,
            comments: {
                count: 1,
                comments: [
                    {
                        authorName: 'Ming',
                        authorAvatar: defaultAvatar,
                        content: 'Hello',
                        answer: [],
                        likes: 1,
                    },
                ],
            },
            image: null,
            content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. `,
            createdAt: 'an hour ago',
        },
    ];

    return (
        <div
            className='d-flex justify-content-center align-items-center w-100'
            style={{marginTop: 106, marginLeft: 62}}
        >
            {posts.map((post) => {
                return (
                    <Post
                        author={post.author}
                        likes={post.likes}
                        comments={post.comments}
                        image={post.image}
                        content={post.content}
                        createdAt={post.createdAt}
                    />
                );
            })}
        </div>
    );
};

export default Profile;
