import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { Container, Title, Form, RepositoryList, Error } from './styled';

import logo from '../../assets/github-logo.svg';
import api from '../../services/api';

interface RepositoryDTO {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }

}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<RepositoryDTO[]>(() => {
    const storegedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storegedRepositories) {
      return JSON.parse(storegedRepositories);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o nome do repositório');
      return;
    }

    try {
      const response = await api.get(`repos/${newRepo}`);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório')
    }
  }

  return (
    <Container>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositórios no github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          placeholder="Digite o nome do repositório"
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      { inputError && <Error>{inputError}</Error> }

      <RepositoryList>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </RepositoryList>
    </Container>
  );
}

export default Dashboard;
