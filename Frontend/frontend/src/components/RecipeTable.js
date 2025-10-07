import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Rate, Empty } from 'antd';
import { fetchRecipes } from '../services/api';
import RecipeDrawer from './RecipeDrawer';
import _ from 'lodash';

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15, 
    total: 0,
    pageSizeOptions: ['15', '20', '30', '50'],
    showSizeChanger: true,
  });
  const [filters, setFilters] = useState({});

  const debouncedFetch = useCallback(_.debounce((p, f) => {
    setLoading(true);
    fetchRecipes({ pagination: p, filters: f }).then(result => {
      setLoading(false);
      setRecipes(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
    });
  }, 500), []); 

  useEffect(() => {
    debouncedFetch(pagination, filters);
  }, [pagination.current, pagination.pageSize, filters, debouncedFetch]);

  const handleTableChange = (newPagination, newFilters) => {

    const formattedFilters = Object.keys(newFilters).reduce((acc, key) => {
        if (newFilters[key]) {
            acc[key] = newFilters[key][0];
        }
        return acc;
    }, {});
    
    setPagination(newPagination);
    setFilters(formattedFilters);
  };
  
  const handleRowClick = (record) => {
    setSelectedRecipe(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search title"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
    },
    {
      title: 'Cuisine',
      dataIndex: 'cuisine',
      key: 'cuisine',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
         <div style={{ padding: 8 }}>
          <Input
            placeholder="Search cuisine"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: rating => <Rate disabled allowHalf defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    { title: 'Total Time (mins)', dataIndex: 'total_time', key: 'total_time' },
    { title: 'Serves', dataIndex: 'serves', key: 'serves' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Table
        columns={columns}
        dataSource={recipes}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName="clickable-row"
        locale={{ emptyText: <Empty description="No Recipes Found. Try adjusting your search." /> }}
      />
      <RecipeDrawer
        recipe={selectedRecipe}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
};

export default RecipeTable;