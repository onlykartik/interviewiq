--
-- PostgreSQL database dump
--

\restrict xMBOJkSvQXpNbGMpWSpy1bchDnL6aAd7nxWCReur9DrqxaLf174pBg8Z2VV7OmG

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.companies OWNER TO karterreddy;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.companies_id_seq OWNER TO karterreddy;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.interviews (
    id integer NOT NULL,
    company_id integer NOT NULL,
    role character varying(100) NOT NULL,
    interview_date date NOT NULL,
    result character varying(20) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    user_id integer NOT NULL
);


ALTER TABLE public.interviews OWNER TO karterreddy;

--
-- Name: interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.interviews_id_seq OWNER TO karterreddy;

--
-- Name: interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.interviews_id_seq OWNED BY public.interviews.id;


--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.post_comments (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.post_comments OWNER TO karterreddy;

--
-- Name: post_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.post_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_comments_id_seq OWNER TO karterreddy;

--
-- Name: post_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.post_comments_id_seq OWNED BY public.post_comments.id;


--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.post_likes (
    id integer NOT NULL,
    post_id integer,
    user_id integer
);


ALTER TABLE public.post_likes OWNER TO karterreddy;

--
-- Name: post_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.post_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_likes_id_seq OWNER TO karterreddy;

--
-- Name: post_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.post_likes_id_seq OWNED BY public.post_likes.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer,
    content text NOT NULL,
    media_url text,
    media_type character varying(20),
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.posts OWNER TO karterreddy;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO karterreddy;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    interview_id integer NOT NULL,
    question_text text NOT NULL,
    topic character varying(100),
    difficulty character varying(20),
    round character varying(50),
    user_answer text,
    created_at timestamp without time zone DEFAULT now(),
    user_id integer NOT NULL
);


ALTER TABLE public.questions OWNER TO karterreddy;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_id_seq OWNER TO karterreddy;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: karterreddy
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(150) NOT NULL,
    password_hash text,
    auth_provider character varying(20) DEFAULT 'local'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO karterreddy;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: karterreddy
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO karterreddy;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: karterreddy
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: interviews id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.interviews ALTER COLUMN id SET DEFAULT nextval('public.interviews_id_seq'::regclass);


--
-- Name: post_comments id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_comments ALTER COLUMN id SET DEFAULT nextval('public.post_comments_id_seq'::regclass);


--
-- Name: post_likes id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_likes ALTER COLUMN id SET DEFAULT nextval('public.post_likes_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_user_id_key UNIQUE (post_id, user_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: interviews fk_company; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE RESTRICT;


--
-- Name: questions fk_interview; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_interview FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;


--
-- Name: interviews fk_interviews_user; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: questions fk_questions_user; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_questions_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karterreddy
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict xMBOJkSvQXpNbGMpWSpy1bchDnL6aAd7nxWCReur9DrqxaLf174pBg8Z2VV7OmG

