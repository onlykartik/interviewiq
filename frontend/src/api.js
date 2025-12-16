const API_BASE = 'http://localhost:8080/api';

function getHeaders() {
    const token = localStorage.getItem('token');
    console.log('Front end get header ',token)
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
}

export async function getInterviews() {
    const res = await fetch(`${API_BASE}/interviews`, {
        headers: getHeaders()
    });
    
    if (!res.ok) {
        throw new Error('Failed to fetch interviews');
    }
    return res.json();
}

export async function getInterviewQuestions(interviewId) {
    const res = await fetch(`${API_BASE}/interviews/${interviewId}/questions`, {
        headers: getHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch questions');
    }
    return res.json();
}

export async function addQuestion(payload) {

/*    
    const res = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
*/
    const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
    });
    if (!res.ok) {
        throw new Error('Failed to add question');
    }

    return res.json();
}

export async function getDashboardUpcoming() {
    
    const res = await fetch(`${API_BASE}/dashboard/upcoming`, {
        headers: getHeaders()
    });

    return res.json();
    }
    export async function getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function signup(name,email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name , email, password })
    });

    return res.json();
}

export async function addInterview(interviewData) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE}/interviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(interviewData)
    });

    if (!res.ok) {
        throw new Error('Failed to add interview');
    }

    return res.json();
}

export async function getCompanies() {

    const res = await fetch(`${API_BASE}/companies`, {
        headers: getHeaders(),
    });

    return res.json();
    }

    export async function addCompany(name) {

    const res = await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers:getHeaders(),
        body: JSON.stringify({ name })
    });

    return res.json();
}

export async function getExplorePosts() {
    const res = await fetch(`${API_BASE}/explore/posts`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function createExplorePost(payload) {
    const res = await fetch(`${API_BASE}/explore/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    return res.json();
}

export async function toggleLike(postId) {
    const res = await fetch(
        `http://localhost:8080/api/explore/${postId}/like`,
        {
        method: 'POST',
        headers: getHeaders()
        }
    );

    return res.json();
}

export async function getPostComments(postId) {
    const res = await fetch(
        `${API_BASE}/explore/posts/${postId}/comments`
    );
    return res.json();
}

export async function addPostComment(postId, comment) {

    const res = await fetch(
        `${API_BASE}/explore/posts/${postId}/comments`,
        {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ comment })
        }
    );

    return res.json();
}


export async function getMe() {
    const res = await fetch(`${API_BASE}/users/me`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function updateName(name) {
    const res = await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ name })
    });
    return res.json();
}