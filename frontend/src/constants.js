export const mockQuestions = [
  {
    id: 708,
    content: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  {
    id: 456,
    content: '가장 오래 통화해본 기억은?'
  },
  {
    id: 669,
    content: '내일이 생의 마지막 날이라면 오늘 무엇을 하겠는가?'
  },
  {
    id: 112,
    content: '나는 운이 좋은 편이라고 생각하는가?'
  },
  {
    id: 630,
    content: '지금까지의 올 한해에 대해 한 문장으로 표현한다면?'
  },
  {
    id: 35,
    content: '나에게 주고 싶은 선물이 있다면?'
  },
  {
    id: 78,
    content: '사람들의 무리한 부탁을 잘 거절하는 편인가?'
  },
  {
    id: 507,
    content: '나는 무엇에 목이 마른가?'
  }
];

export const mockPost = {
  id: 1,
  'content-type': 'Article',
  type: 'Article',
  is_admin_question: 'true',
  author_detail: {
    id: 1,
    username: 'admin',
    profile_pic: null
  },
  content: '사람들의 무리한 부탁을 잘 거절하는 편',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
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
    id: 134,
    type: 'Question',
    author: 'http://localhost:8000/api/user/1/',
    author_detail: {
      id: 123,
      username: 'curious'
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
  type: 'Article',
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
  type: 'Response',
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
  id: 23423423,
  'content-type': 'Question',
  type: 'Question',
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
  id: 23423423132,
  'content-type': 'Question',
  type: 'Question',
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
  type: 'Article',
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
  type: 'Response',
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

export const questionDetailPosts = {
  id: 5,
  type: 'Question',
  author: 'http://localhost:8000/api/user/5/',
  author_detail: {
    id: 3,
    username: 'adoor'
  },
  content: 'add',
  like_count: 1,
  current_user_liked: true,
  created_at: '2020-11-21T14:59:33.371909+09:00',
  updated_at: '2020-11-21T14:59:33.519895+09:00',
  selected_date: '2020-11-21T14:59:33.519774+09:00',
  is_admin_question: true,
  maxPage: 2,
  response_set: [
    {
      id: 10,
      type: 'Response',
      author: 'http://localhost:8000/api/user/10/',
      author_detail: {
        id: 1,
        username: 'hawkinscameron'
      },
      content: 'Something article true have.',
      like_count: 1,
      current_user_liked: true,
      created_at: '2020-11-21T14:59:33.628261+09:00',
      updated_at: '2020-11-21T14:59:33.628297+09:00',
      question_id: 5,
      share_with_friends: true,
      share_anonymously: true,
      question: {
        id: 5,
        type: 'Question',
        author: 'http://localhost:8000/api/user/5/',
        author_detail: {
          id: 3,
          username: 'adoor'
        },
        content: 'add',
        like_count: 1,
        current_user_liked: true,
        created_at: '2020-11-21T14:59:33.371909+09:00',
        updated_at: '2020-11-21T14:59:33.519895+09:00',
        selected_date: '2020-11-21T14:59:33.519774+09:00',
        is_admin_question: true
      }
    }
  ]
};
export const mockFriendList = [
  {
    id: 1,
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
    username: 'jaewon.kim'
  },
  {
    id: 2,
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
    username: 'jina.park'
  },
  {
    id: 3,
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
    username: 'jinsun.9'
  },
  {
    id: 4,
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
    username: 'curie.yoo'
  }
];

export const mockFriendRequestList = [
  {
    id: 1,
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
    username: 'byeongon.chun'
  },
  {
    id: 2,
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
    username: 'yunmo.koo'
  }
];

export const mockNotifications = [
  {
    count: 25,
    next: 'http://localhost:8000/api/notifications/?page=2',
    previous: null,
    results: [
      {
        id: 84,
        message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/84/',
        actor_detail: {
          color_hex: '#FA698A'
        },
        recipient: 'http://localhost:8000/api/user/84/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 49,
        origin_type: 'Comment',
        origin_id: 10,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:38.038238+09:00',
        updated_at: '2020-11-27T01:30:38.038265+09:00'
      },
      {
        id: 82,
        message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/82/',
        actor_detail: {
          color_hex: '#5C9469'
        },
        recipient: 'http://localhost:8000/api/user/82/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 47,
        origin_type: 'Question',
        origin_id: 10,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:38.028161+09:00',
        updated_at: '2020-11-27T01:30:38.028187+09:00'
      },
      {
        id: 79,
        message: 'adoor님이 회원님의 댓글을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/79/',
        actor_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        recipient: 'http://localhost:8000/api/user/79/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 44,
        origin_type: 'Comment',
        origin_id: 9,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:38.008712+09:00',
        updated_at: '2020-11-27T01:30:38.008739+09:00'
      },
      {
        id: 77,
        message: 'adoor님이 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/77/',
        actor_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        recipient: 'http://localhost:8000/api/user/77/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 42,
        origin_type: 'Question',
        origin_id: 9,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.998900+09:00',
        updated_at: '2020-11-27T01:30:37.998926+09:00'
      },
      {
        id: 76,
        message: 'adoor님이 회원님의 게시물을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/76/',
        actor_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        recipient: 'http://localhost:8000/api/user/76/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 41,
        origin_type: 'Article',
        origin_id: 9,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.993789+09:00',
        updated_at: '2020-11-27T01:30:37.993815+09:00'
      },
      {
        id: 74,
        message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/74/',
        actor_detail: {
          color_hex: '#338C79'
        },
        recipient: 'http://localhost:8000/api/user/74/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 39,
        origin_type: 'Comment',
        origin_id: 8,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.979199+09:00',
        updated_at: '2020-11-27T01:30:37.979225+09:00'
      },
      {
        id: 72,
        message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/72/',
        actor_detail: {
          color_hex: '#66A0FA'
        },
        recipient: 'http://localhost:8000/api/user/72/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 37,
        origin_type: 'Question',
        origin_id: 8,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.968519+09:00',
        updated_at: '2020-11-27T01:30:37.968549+09:00'
      },
      {
        id: 69,
        message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/69/',
        actor_detail: {
          color_hex: '#A02D59'
        },
        recipient: 'http://localhost:8000/api/user/69/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 34,
        origin_type: 'Comment',
        origin_id: 7,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.946757+09:00',
        updated_at: '2020-11-27T01:30:37.946783+09:00'
      },
      {
        id: 67,
        message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/67/',
        actor_detail: {
          color_hex: '#F4F526'
        },
        recipient: 'http://localhost:8000/api/user/67/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 32,
        origin_type: 'Question',
        origin_id: 7,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.936342+09:00',
        updated_at: '2020-11-27T01:30:37.936371+09:00'
      },
      {
        id: 57,
        message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/57/',
        actor_detail: {
          color_hex: '#55B770'
        },
        recipient: 'http://localhost:8000/api/user/57/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 22,
        origin_type: 'Question',
        origin_id: 5,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.876656+09:00',
        updated_at: '2020-11-27T01:30:37.876680+09:00'
      },
      {
        id: 56,
        message: '익명의 사용자가 회원님의 게시물을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/56/',
        actor_detail: {
          color_hex: '#012AE5'
        },
        recipient: 'http://localhost:8000/api/user/56/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 21,
        origin_type: 'Article',
        origin_id: 5,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.871425+09:00',
        updated_at: '2020-11-27T01:30:37.871449+09:00'
      },
      {
        id: 55,
        message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/55/',
        actor_detail: {
          color_hex: '#D69ABE'
        },
        recipient: 'http://localhost:8000/api/user/55/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 20,
        origin_type: 'Comment',
        origin_id: 24,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.862794+09:00',
        updated_at: '2020-11-27T01:30:37.862820+09:00'
      },
      {
        id: 52,
        message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/52/',
        actor_detail: {
          color_hex: '#1F2243'
        },
        recipient: 'http://localhost:8000/api/user/52/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'Like',
        target_id: 17,
        origin_type: 'Question',
        origin_id: 4,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.847300+09:00',
        updated_at: '2020-11-27T01:30:37.847327+09:00'
      },
      {
        id: 51,
        message: '익명의 사용자가 회원님의 게시물을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/51/',
        actor_detail: {
          color_hex: '#D1B1A0'
        },
        recipient: 'http://localhost:8000/api/user/51/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'ResponseRequest',
        target_id: 16,
        origin_type: 'Question',
        origin_id: 4,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.841983+09:00',
        updated_at: '2020-11-27T01:30:37.842009+09:00'
      },
      {
        id: 47,
        message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
        actor: 'http://localhost:8000/api/user/47/',
        actor_detail: {
          color_hex: '#1E9AE3'
        },
        recipient: 'http://localhost:8000/api/user/47/',
        recipient_detail: {
          id: 3,
          username: 'adoor',
          profile_pic: '#D088DF',
          url: 'http://localhost:8000/api/user/3/'
        },
        target_type: 'FriendRequest',
        target_id: 12,
        origin_type: 'User',
        origin_id: 3,
        is_visible: true,
        is_read: false,
        created_at: '2020-11-27T01:30:37.812678+09:00',
        updated_at: '2020-11-27T01:30:37.812704+09:00'
      }
    ]
  }
];

export const mockNotiArrays = [
  {
    id: 84,
    message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/84/',
    actor_detail: {
      color_hex: '#FA698A'
    },
    recipient: 'http://localhost:8000/api/user/84/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 49,
    origin_type: 'Comment',
    origin_id: 10,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:38.038238+09:00',
    updated_at: '2020-11-27T01:30:38.038265+09:00'
  },
  {
    id: 82,
    message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/82/',
    actor_detail: {
      color_hex: '#5C9469'
    },
    recipient: 'http://localhost:8000/api/user/82/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 47,
    origin_type: 'Question',
    origin_id: 10,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:38.028161+09:00',
    updated_at: '2020-11-27T01:30:38.028187+09:00'
  },
  {
    id: 79,
    message: 'adoor님이 회원님의 댓글을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/79/',
    actor_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    recipient: 'http://localhost:8000/api/user/79/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 44,
    origin_type: 'Comment',
    origin_id: 9,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:38.008712+09:00',
    updated_at: '2020-11-27T01:30:38.008739+09:00'
  },
  {
    id: 77,
    message: 'adoor님이 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/77/',
    actor_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    recipient: 'http://localhost:8000/api/user/77/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 42,
    origin_type: 'Question',
    origin_id: 9,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.998900+09:00',
    updated_at: '2020-11-27T01:30:37.998926+09:00'
  },
  {
    id: 76,
    message: 'adoor님이 회원님의 게시물을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/76/',
    actor_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    recipient: 'http://localhost:8000/api/user/76/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 41,
    origin_type: 'Article',
    origin_id: 9,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.993789+09:00',
    updated_at: '2020-11-27T01:30:37.993815+09:00'
  },
  {
    id: 74,
    message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/74/',
    actor_detail: {
      color_hex: '#338C79'
    },
    recipient: 'http://localhost:8000/api/user/74/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 39,
    origin_type: 'Comment',
    origin_id: 8,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.979199+09:00',
    updated_at: '2020-11-27T01:30:37.979225+09:00'
  },
  {
    id: 72,
    message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/72/',
    actor_detail: {
      color_hex: '#66A0FA'
    },
    recipient: 'http://localhost:8000/api/user/72/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 37,
    origin_type: 'Question',
    origin_id: 8,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.968519+09:00',
    updated_at: '2020-11-27T01:30:37.968549+09:00'
  },
  {
    id: 69,
    message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/69/',
    actor_detail: {
      color_hex: '#A02D59'
    },
    recipient: 'http://localhost:8000/api/user/69/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 34,
    origin_type: 'Comment',
    origin_id: 7,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.946757+09:00',
    updated_at: '2020-11-27T01:30:37.946783+09:00'
  },
  {
    id: 67,
    message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/67/',
    actor_detail: {
      color_hex: '#F4F526'
    },
    recipient: 'http://localhost:8000/api/user/67/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 32,
    origin_type: 'Question',
    origin_id: 7,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.936342+09:00',
    updated_at: '2020-11-27T01:30:37.936371+09:00'
  },
  {
    id: 57,
    message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/57/',
    actor_detail: {
      color_hex: '#55B770'
    },
    recipient: 'http://localhost:8000/api/user/57/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 22,
    origin_type: 'Question',
    origin_id: 5,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.876656+09:00',
    updated_at: '2020-11-27T01:30:37.876680+09:00'
  },
  {
    id: 56,
    message: '익명의 사용자가 회원님의 게시물을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/56/',
    actor_detail: {
      color_hex: '#012AE5'
    },
    recipient: 'http://localhost:8000/api/user/56/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 21,
    origin_type: 'Article',
    origin_id: 5,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.871425+09:00',
    updated_at: '2020-11-27T01:30:37.871449+09:00'
  },
  {
    id: 55,
    message: '익명의 사용자가 회원님의 댓글을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/55/',
    actor_detail: {
      color_hex: '#D69ABE'
    },
    recipient: 'http://localhost:8000/api/user/55/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 20,
    origin_type: 'Comment',
    origin_id: 24,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.862794+09:00',
    updated_at: '2020-11-27T01:30:37.862820+09:00'
  },
  {
    id: 52,
    message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/52/',
    actor_detail: {
      color_hex: '#1F2243'
    },
    recipient: 'http://localhost:8000/api/user/52/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'Like',
    target_id: 17,
    origin_type: 'Question',
    origin_id: 4,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.847300+09:00',
    updated_at: '2020-11-27T01:30:37.847327+09:00'
  },
  {
    id: 51,
    message: '익명의 사용자가 회원님의 게시물을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/51/',
    actor_detail: {
      color_hex: '#D1B1A0'
    },
    recipient: 'http://localhost:8000/api/user/51/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'ResponseRequest',
    target_id: 16,
    origin_type: 'Question',
    origin_id: 4,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.841983+09:00',
    updated_at: '2020-11-27T01:30:37.842009+09:00'
  },
  {
    id: 47,
    message: '익명의 사용자가 회원님의 질문을 좋아합니다.',
    actor: 'http://localhost:8000/api/user/47/',
    actor_detail: {
      color_hex: '#1E9AE3'
    },
    recipient: 'http://localhost:8000/api/user/47/',
    recipient_detail: {
      id: 3,
      username: 'adoor',
      profile_pic: '#D088DF',
      url: 'http://localhost:8000/api/user/3/'
    },
    target_type: 'FriendRequest',
    target_id: 12,
    origin_type: 'User',
    origin_id: 3,
    is_visible: true,
    is_read: false,
    created_at: '2020-11-27T01:30:37.812678+09:00',
    updated_at: '2020-11-27T01:30:37.812704+09:00'
  }
];
export const mockResponseRequests = [
  {
    id: 18,
    actor_id: 3,
    recipient_id: 1,
    question_id: 20
  },
  {
    id: 18,
    actor_id: 3,
    recipient_id: 2,
    question_id: 20
  }
];
export const mockLike = {
  id: 2,
  type: 'Like',
  target_type: 'Article',
  target_id: 13,
  user: 'http://localhost:8000/api/user/10/',
  user_detail: {
    id: 1,
    username: 'hawkinscameron'
  }
};
