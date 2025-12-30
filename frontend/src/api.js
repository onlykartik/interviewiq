const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

function getHeaders() {
    console.log('API:', import.meta.env.VITE_API_BASE_URL);
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
    console.log('adding question front end ',payload)
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

export async function signup(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password })
    });

    return res.json();
}

export async function addInterview(interviewData) {
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
        `${API_BASE}/explore/${postId}/like`,
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

export async function getDailyRecommendation() {
    console.log('Front end called for recommendation...')
    const res = await fetch(`${API_BASE}/dashboard/ai-recommendation`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function getDashboardRecommendations() {
    const res = await fetch(`${API_BASE}/dashboard/recommendations`, {
        headers: getHeaders()
    });
    const data = await res.json();
    return data;
}

export async function getTodayQuiz() {
    const res = await fetch(`${API_BASE}/quiz/today`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function refreshRecommendations() {
    const res = await fetch(`${API_BASE}/dashboard/recommendations/refresh`, {
        method: 'POST',
        headers: getHeaders()
    });

    return res.json();
}

export async function getExplorePostsPagenation(cursor = null) {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', 5);

    const res = await fetch(
        `${API_BASE}/explore/postspagenation?${params.toString()}`,
        { headers: getHeaders() }
    );

    console.log(res)

    return res.json();
}

export async function getUserProfile() {
    const res = await fetch(`${API_BASE}/users/profile`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function saveUserProfile(profile) {
    const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(profile)
    });
    return res.json();
}

// GET single interview by ID
export async function getInterviewById(interviewId) {
    const res = await fetch(`${API_BASE}/interviews/${interviewId}`, {
        headers: getHeaders()
    });

    return res.json();
}

export async function getInterviewPreparation(id) {
    const res = await fetch(`${API_BASE}/interviews/${id}/prepare`, {
        headers: getHeaders()
    });
    return res.json();
}

export async function generateInterviewPreparation(id, payload) {
    const res = await fetch(`${API_BASE}/interviews/${id}/prepare`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}


export async function markInterviewAsPast(interviewId) {
    const token = localStorage.getItem('token');
    const res = await fetch(
        `${API_BASE}/interviews/${interviewId}/mark-past`,
        {
        method: 'PATCH',
        headers: getHeaders()
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Failed to mark interview as past');
    }

    return data;
}

export async function loginUser(email, password) {
    const res = await fetch(  `${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Login failed');
    }

  return data; // contains token
}