export const mockQuestions = [
  {
    id: 0,
    content: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  {
    id: 1,
    content: '가장 오래 통화해본 기억은?'
  },
  {
    id: 3,
    content: '내일이 생의 마지막 날이라면 오늘 무엇을 하겠는가?'
  },
  {
    id: 4,
    content: '나는 운이 좋은 편이라고 생각하는가?'
  },
  {
    id: 5,
    content: '지금까지의 올 한해에 대해 한 문장으로 표현한다면?'
  },
  {
    id: 6,
    content: '나에게 주고 싶은 선물이 있다면?'
  },
  {
    id: 8,
    content: '사람들의 무리한 부탁을 잘 거절하는 편인가?'
  },
  {
    id: 9,
    content: '나는 무엇에 목이 마른가?'
  }
];

export const mockPost = {
  id: 1,
  content: '사람들의 무리한 부탁을 잘 거절하는 편'
};

export const mockData = [];

export const mockRecommendQuestions = [
  {
    id: 1,
    'content-type': 'Question',
    is_admin_question: 'true',
    author_detail: {
      id: 1,
      username: 'admin',
      profile_pic:
        'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
    },
    content: '어디서 마시는 커피를 가장 좋아하는가?',
    created_at: '2020-11-05T14:16:13.801119+08:00',
    updated_at: null
  },
  {
    id: 2,
    'content-type': 'Question',
    is_admin_question: 'true',
    author_detail: {
      id: 1,
      username: 'admin',
      profile_pic:
        'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
    },
    content: '가장 오래 통화해본 기억은?',
    created_at: '2020-11-05T14:16:13.801119+08:00',
    updated_at: null
  },
  {
    id: 3,
    'content-type': 'Question',
    is_admin_question: 'false',
    author_detail: {
      id: 123,
      username: 'curious',
      profile_pic:
        'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
    },
    content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
    created_at: '2020-11-05T14:16:13.801119+08:00',
    updated_at: null
  },
  {
    id: 4,
    'content-type': 'Question',
    is_admin_question: 'true',
    author_detail: {
      id: 1,
      username: 'admin',
      profile_pic:
        'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
    },
    content: '나는 운이 좋은 편이라고 생각하는가?',
    created_at: '2020-11-05T14:16:13.801119+08:00',
    updated_at: null
  },
  {
    id: 5,
    'content-type': 'Question',
    is_admin_question: 'true',
    author_detail: {
      id: 1,
      username: 'admin',
      profile_pic:
        'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
    },
    content: '사람들의 무리한 부탁을 잘 거절하는 편인가?',
    created_at: '2020-11-05T14:16:13.801119+08:00',
    updated_at: null
  }
];

export const mockQuestionFeed = [
  {
    id: 1,
    type: 'Question',
    author: 'http://localhost:8000/api/user/1/',
    author_detail: {
      id: 1,
      username: 'admin'
    },
    content: 'Republican',
    like_count: 33,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.786164+09:00',
    updated_at: '2020-11-15T14:52:52.380141+09:00',
    selected_date: '2020-11-15T14:52:52.380046+09:00',
    is_admin_question: true
  },
  {
    id: 3,
    type: 'Question',
    author: 'http://localhost:8000/api/user/3/',
    author_detail: {
      id: 2,
      username: 'catherine28'
    },
    content: 'myself',
    like_count: 1,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.805998+09:00',
    updated_at: '2020-11-15T14:52:52.321095+09:00',
    selected_date: '2020-11-15T14:52:52.321007+09:00',
    is_admin_question: false
  },
  {
    id: 4,
    type: 'Question',
    author: 'http://localhost:8000/api/user/4/',
    author_detail: {
      id: 3,
      username: 'adoor'
    },
    content: 'under',
    like_count: 26,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.813969+09:00',
    updated_at: '2020-11-15T14:52:52.316095+09:00',
    selected_date: '2020-11-15T14:52:52.315995+09:00',
    is_admin_question: false
  },
  {
    id: 5,
    type: 'Question',
    author: 'http://localhost:8000/api/user/5/',
    author_detail: {
      id: 1,
      username: 'stephanie16'
    },
    content: 'bar',
    like_count: 45,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.821841+09:00',
    updated_at: '2020-11-15T14:52:52.325322+09:00',
    selected_date: '2020-11-15T14:52:52.325223+09:00',
    is_admin_question: false
  },
  {
    id: 6,
    type: 'Question',
    author: 'http://localhost:8000/api/user/6/',
    author_detail: {
      id: 2,
      username: 'catherine28'
    },
    content: 'contain',
    like_count: 33,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.829792+09:00',
    updated_at: '2020-11-15T14:52:52.269344+09:00',
    selected_date: '2020-11-15T14:52:52.269255+09:00',
    is_admin_question: false
  },
  {
    id: 8,
    type: 'Question',
    author: 'http://localhost:8000/api/user/8/',
    author_detail: {
      id: 2,
      username: 'catherine28'
    },
    content: 'mention',
    like_count: 25,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.846281+09:00',
    updated_at: '2020-11-15T14:52:52.369598+09:00',
    selected_date: '2020-11-15T14:52:52.369499+09:00',
    is_admin_question: false
  },
  {
    id: 9,
    type: 'Question',
    author: 'http://localhost:8000/api/user/9/',
    author_detail: {
      id: 1,
      username: 'stephanie16'
    },
    content: 'research',
    like_count: 33,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.853724+09:00',
    updated_at: '2020-11-15T14:52:52.344145+09:00',
    selected_date: '2020-11-15T14:52:52.344050+09:00',
    is_admin_question: false
  },
  {
    id: 10,
    type: 'Question',
    author: 'http://localhost:8000/api/user/10/',
    author_detail: {
      id: 0,
      username: 'adoor'
    },
    content: 'social',
    like_count: 37,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.862356+09:00',
    updated_at: '2020-11-15T14:52:52.348892+09:00',
    selected_date: '2020-11-15T14:52:52.348812+09:00',
    is_admin_question: false
  },
  {
    id: 12,
    type: 'Question',
    author: 'http://localhost:8000/api/user/12/',
    author_detail: {
      id: 1,
      username: 'stephanie16'
    },
    content: 'fish',
    like_count: 22,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.878559+09:00',
    updated_at: '2020-11-15T14:52:52.390150+09:00',
    selected_date: '2020-11-15T14:52:52.390054+09:00',
    is_admin_question: false
  },
  {
    id: 13,
    type: 'Question',
    author: 'http://localhost:8000/api/user/13/',
    author_detail: {
      id: 1,
      username: 'stephanie16'
    },
    content: 'event',
    like_count: 26,
    current_user_liked: true,
    created_at: '2020-11-15T14:52:51.887629+09:00',
    updated_at: '2020-11-15T14:52:52.394600+09:00',
    selected_date: '2020-11-15T14:52:52.394508+09:00',
    is_admin_question: false
  }
];

export const mockArticle = {
  id: 4756,
  'content-type': 'Article', // or const int e.g. (1: Article, 2: Response...)
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  }, // blank or null if anonymous
  created_at: '2020-09-23T10:38:47.975019+08:00',
  content:
    '안녕하세요 반가워요 잘있어요 다시만나요 이거는 질문없이 쓰는 그냥 뻘글이에요 이쁘죠?????',
  comments: [
    {
      id: 1272,
      post_id: 383,
      content: '재밌네요',
      author: 1,
      author_detail: {
        id: 123,
        username: 'curious',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      },
      referenced_comments: 1272,
      is_reply: false,
      replies: [
        {
          id: 1273,
          post_id: 383,
          content: '같이하고싶어요',
          author: 2,
          author_detail: {
            id: 2,
            profile_pic:
              'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
            username: '아이폰'
          },
          is_poster_owner: false,
          referenced_comments: 1272,
          is_reply: true,
          is_private: false,
          create_dt: '2020-09-23T10:40:24.421000+08:00',
          update_dt: '2020-09-23T10:40:24.428734+08:00'
        }
      ],
      is_private: false,
      create_dt: '2020-09-23T10:38:47.975019+08:00',
      update_dt: '2020-09-23T10:39:35.849029+08:00'
    },

    {
      id: 1274,
      post_id: 383,
      content: '퍼가요!!!!',
      author: 3,
      author_detail: {
        id: 2,
        profile_pic:
          'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png',
        username: '아이폰'
      },
      referenced_comments: 1274,
      is_reply: false,
      is_private: true,
      create_dt: '2020-09-23T10:40:42.268355+08:00',
      update_dt: '2020-09-23T10:40:42.268384+08:00'
    }
  ]
};
export const mockResponse = {
  id: 5999,
  'content-type': 'Response',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  question: 1244,
  question_detail: {
    id: 1244,
    content: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  content:
    '스타벅스에서 먹는 바닐라크림콜드브루! 시럽은 1번만 넣고 에스프레소휩을 올리면 행복~',
  comments: [
    {
      id: 1274,
      post_id: 383,
      content: '오 마져 맛이써!!!!',
      author: 3,
      author_detail: {
        id: 2,
        profile_pic:
          'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png',
        username: '아이폰'
      },
      referenced_comments: 1274,
      is_reply: false,
      is_private: true,
      create_dt: '2020-09-23T10:40:42.268355+08:00',
      update_dt: '2020-09-23T10:40:42.268384+08:00'
    }
  ],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export const mockCustomQuestion = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'true',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export const mockResponse2 = {
  id: 4757,
  'content-type': 'Response',
  author_detail: {
    id: 124,
    username: 'jina.park',
    profile_pic:
      'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png'
  },
  question: 1244,
  question_detail: {
    id: 1244,
    content: '나는 운이 좋은 편이라고 생각하는가?'
  },
  content: '예쓰 아임 어 럭키 걸 지나~',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export const mockFriendFeed = [
  mockArticle,
  mockResponse,
  mockCustomQuestion,
  mockResponse2
];

export const mockAnonCustomQuestion = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'true',
  author_detail: {
    id: -1
    // username: '익명',
    // profile_pic:
    //   'https://i.guim.co.uk/img/media/d0105731685e5b2b3daecf2fa00c9affaba832f1/0_0_2560_1536/master/2560.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8c7cd83e84ab106b0f522125757603a0'
  },
  content: '다들 유튜브 없이 얼마나 버틸 수 있을 것 같아?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export const mockAnonCustomQuestion2 = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'true',
  author_detail: {
    id: -1
    // username: '익명',
    // profile_pic:
    //   'https://i.guim.co.uk/img/media/d0105731685e5b2b3daecf2fa00c9affaba832f1/0_0_2560_1536/master/2560.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8c7cd83e84ab106b0f522125757603a0'
  },
  content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export const mockAnonArticle = {
  id: 4756,
  'content-type': 'Article', // or const int e.g. (1: Article, 2: Response...)
  author_detail: {
    id: -1
    // username: '익명',
    // profile_pic:
    //   'https://i.guim.co.uk/img/media/d0105731685e5b2b3daecf2fa00c9affaba832f1/0_0_2560_1536/master/2560.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8c7cd83e84ab106b0f522125757603a0'
  }, // blank or null if anonymous
  created_at: '2020-11-12T10:38:47.975019+08:00',
  content: '다들 내가 누군지 절대 모르겠지?!!!!'
};

export const mockAnonResponse = {
  id: 4757,
  'content-type': 'Response',
  author_detail: {
    id: -1
    // username: '익명',
    // profile_pic:
    //   'https://i.guim.co.uk/img/media/d0105731685e5b2b3daecf2fa00c9affaba832f1/0_0_2560_1536/master/2560.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8c7cd83e84ab106b0f522125757603a0'
  },
  question: 1244,
  question_detail: {
    id: 1244,
    content: '나는 운이 좋은 편이라고 생각하는가?'
  },
  content:
    '나는 내가 운이 좋을때는 진짜 좋은데 아닐땐 진짜 아닌 것 같다고 생각해. 너무 당연한 소리를 한 것 같군.',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export const mockAnonymousFeed = [
  mockAnonCustomQuestion,
  mockAnonArticle,
  mockAnonCustomQuestion2,
  mockAnonResponse
];
