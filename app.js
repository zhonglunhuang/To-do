import axios from 'axios';

let token = localStorage.getItem('todotoken');

const form = document.querySelector('#form');
console.log('hello');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const Email = document.querySelector('#email');
    const NickName = document.querySelector('#nickname');
    const Password = document.querySelector('#password');

    if (Email.value.trim() !== '' && Password.value.trim() !== '') {
        let userData = {
            user: {
                email: Email.value,
                nickname: NickName.value,
                password: Password.value,
            },
        };
        axios
            .post('https://todoo.5xcamp.us/users', userData)
            .then(({ data }) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });

        // fetch('https://todoo.5xcamp.us/users', {
        //     method: 'POST',
        //     body: JSON.stringify(userData),
        //     headers: new Headers({
        //         'Content-Type': 'application/json',
        //     }),
        // })
        //     .then((resp) => {
        //         return resp.json();
        //     })
        //     .then((data) => {
        //         console.log(data);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }
});

const login = document.querySelector('#login');
const tokenText = document.querySelector('#token-text');
login.addEventListener('submit', (e) => {
    e.preventDefault();
    const Email = document.querySelector('#email-login');
    const Password = document.querySelector('#password-login');

    if (Email.value.trim() !== '' && Password.value.trim() !== '') {
        let userData = {
            user: {
                email: Email.value,
                password: Password.value,
            },
        };
        // console.log(userData);
        axios
            .post('https://todoo.5xcamp.us/users/sign_in', userData)
            .then((data) => {
                // console.log(data);
                token = data.headers.authorization;
                tokenText.textContent = token;
                localStorage.setItem('todotoken', token);
                console.log('登入成功');
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

const checkform = document.querySelector('#checkform');

checkform.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = localStorage.getItem('todotoken');
    axios
        .get('https://todoo.5xcamp.us/check', {
            headers: {
                authorization: key,
            },
        })
        .then((data) => {
            // console.log(data);
            document.querySelector('#result').textContent = data.data.message;
        })
        .catch((err) => {
            // console.log(token);
            console.log(err);
        });
});
const logout = document.querySelector('#logout');

logout.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = localStorage.getItem('todotoken');
    axios
        .delete('https://todoo.5xcamp.us/users/sign_out', {
            headers: {
                authorization: key,
            },
        })
        .then((data) => {
            console.log(data);
            document.querySelector('#result2').textContent = data.data.message;
        })
        .catch((err) => {
            // console.log(token);
            console.log(err);
        });
    localStorage.removeItem('todotoken');
});
const addForm = document.querySelector('#addForm');
const ul = document.querySelector('ul');
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = localStorage.getItem('todotoken');
    const input = document.querySelector('#addForm > input');
    const todoData = {
        todo: {
            content: `${input.value}`,
        },
    };
    axios
        .post('https://todoo.5xcamp.us/todos', todoData, {
            headers: {
                authorization: key,
            },
        })
        .then(({ data }) => {
            addForm.reset();
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
});

function refresh() {
    while (ul.lastChild) {
        ul.lastChild.remove();
    }
    if (token) {
        axios
            .get('https://todoo.5xcamp.us/todos', {
                headers: {
                    authorization: token,
                },
            })
            .then(({ data }) => {
                // console.log(data.todos);
                data.todos.forEach((todo) => {
                    if (todo.completed_at != null) {
                        let li = `<li data-id="${todo.id}"><input type="checkbox"  checked><button id="delete">X</button><span>${todo.content}</span></li>`;
                        ul.insertAdjacentHTML('beforeend', li);
                    } else {
                        let li = `<li data-id="${todo.id}"><input type="checkbox"  ><button id="delete">X</button><span>${todo.content}</span></li>`;
                        ul.insertAdjacentHTML('beforeend', li);
                    }
                });
            });
    }
}
refresh();

ul.addEventListener('click', (e) => {
    let token = localStorage.getItem('todotoken');
    const id = e.target.closest('li').dataset.id;
    if (e.target.nodeName == 'BUTTON') {
        // console.log(e.target.closest('li').dataset.id);
        e.target.closest('li').remove();
        console.log(token);
        axios
            .delete(`https://todoo.5xcamp.us/todos/${id}`, {
                headers: {
                    authorization: token,
                },
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    if (e.target.nodeName == 'INPUT') {
        console.log(id);
        console.log(token);
        axios
            .patch(`https://todoo.5xcamp.us/todos/${id}/toggle`, '', {
                headers: {
                    authorization: token,
                },
                content: {},
            })
            .then(({ data }) => {
                console.log('更改成功' + data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    if (e.target.nodeName == 'SPAN') {
        let input = document.createElement('input');
        let span = e.target.closest('li').querySelector('span');
        input.value = span.textContent;
        e.target.closest('li').querySelector('span').replaceWith(input);
    }
});
