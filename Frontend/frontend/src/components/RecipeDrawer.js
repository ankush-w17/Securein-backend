import { Drawer, Typography, Descriptions, Table, Tag } from 'antd';

const { Title, Text } = Typography;

const RecipeDrawer = ({ recipe, visible, onClose }) => {
  if (!recipe) return null;

  const nutritionData = recipe.nutrients ? Object.entries(recipe.nutrients).map(([key, value]) => ({ key, value })) : [];
  const nutritionColumns = [
    { title: 'Nutrient', dataIndex: 'key', key: 'key' },
    { title: 'Amount', dataIndex: 'value', key: 'value' },
  ];

  return (
    <Drawer width={600} placement="right" onClose={onClose} open={visible}>
      <Title level={3}>{recipe.title}</Title>
      <Tag color="blue">{recipe.cuisine}</Tag>

      <Descriptions bordered column={2} style={{ marginTop: 24 }}>
        <Descriptions.Item label="Rating">{recipe.rating} / 5</Descriptions.Item>
        <Descriptions.Item label="Serves">{recipe.serves}</Descriptions.Item>
        <Descriptions.Item label="Prep Time">{recipe.prep_time} mins</Descriptions.Item>
        <Descriptions.Item label="Cook Time">{recipe.cook_time} mins</Descriptions.Item>
        <Descriptions.Item label="Total Time" span={2}>{recipe.total_time} mins</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 24 }}>Description</Title>
      <Text>{recipe.description}</Text>

      <Title level={4} style={{ marginTop: 24 }}>Nutritional Information</Title>
      <Table
        columns={nutritionColumns}
        dataSource={nutritionData}
        pagination={false}
        size="small"
      />
    </Drawer>
  );
};

export default RecipeDrawer;