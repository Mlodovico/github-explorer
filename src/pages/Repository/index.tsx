import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouteMatch, Link } from 'react-router-dom';

import { Header, RepositoryInfo, Issues } from './styles';
import logoImg from '../../assets/github-logo.svg';
import api from '../../services/api';

interface RepositoryParams {
  reponame: string
};

interface RepositoryDTO {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  }
};

interface IssuesDTO {
  id: string;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
};

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<RepositoryDTO | null>(null);
  const [issues, setIssues] = useState<IssuesDTO[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    api.get(`repos/${params.reponame}`).then(response => {
      setRepository(response.data);
    });

    api.get(`repos/${params.reponame}/issues`).then(response => {
      setIssues(response.data);
    });
  }, [params.reponame]);
  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{repository.stargazers_count}</strong>
            <span>Stars</span>
          </li>
          <li>
            <strong>{repository.forks_count}</strong>
            <span>Forks</span>
          </li>
          <li>
            <strong>{repository.open_issues_count}</strong>
            <span>Issues Abertas</span>
          </li>
        </ul>
      </RepositoryInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url}>
          <div>
            <strong>{issue.title}</strong>
            <p>{issue.user.login}</p>
          </div>
          <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>


  );
};

export default Repository;
