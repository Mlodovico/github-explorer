import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { Container, Title, Form, RepositoryList } from './styled';

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
  const [repositories, setRepositories] = useState<RepositoryDTO[]>([]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    console.log(newRepo);
    const response = await api.get(`repos/${newRepo}`);
    const repository = response.data;

    setRepositories([...repositories, repository]);
    setNewRepo('');
  }

  return (
    <Container>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositórios no github</Title>

      <Form onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          placeholder="Digite o nome do repositório"
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>
      <RepositoryList>
        {repositories.map(repository => (
          <a key={repository.full_name} href="teste">
          <img src={repository.owner.avatar_url} />
          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>
          <FiChevronRight size={20} />
        </a>
        ))}
      </RepositoryList>
    </Container>
  );
}

export default Dashboard;
