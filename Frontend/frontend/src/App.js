import React from 'react';
import { Layout, Typography } from 'antd';
import RecipeTable from './components/RecipeTable';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ lineHeight: '64px' }}>Recipe Finder 🍽️</Title>
      </Header>
      <Content>
        <RecipeTable />
      </Content>
    </Layout>
  );
}

export default App;