export type User = {
    id: string,
    photo_url: string,
    username: string,
    friends: Array<string>
}

export type Post = {
    author: string,
    comments: Array<string>,
    created_at: Date,
    desc: string,
    title: string
}

export type Message = {
    from: string,
    to: string,
    created_at: Date,
    text: string,
}

export type Comment = {
    author: string,
    text: string,
    created_at: Date,
    post: string,
}

export type Action<T, E> = {
    type: T,
    payload?: E
}

export type UserState = {
    user: User,
    isFetching: boolean,
    isLogged: boolean,
    isRegistered: boolean
}
