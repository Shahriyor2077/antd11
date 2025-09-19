import {
  Button,
  Typography,
  Table,
  Popconfirm,
  Modal,
  Form,
  Input,
  Checkbox,
} from "antd";
import { memo, useEffect, useState } from "react";
import type { FormProps, TableProps } from "antd";
import { api } from "../api";

interface DataType {
  name: string;
  age: number;
  createdAt: string;
  isMarried: boolean;
  id: string;
}

type FieldType = {
  name: string;
  age: number;
  isMarried: boolean;
};

const User = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [reload, setReload] = useState(false);
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      api.post("/user", values)
        handleCancel();
        form.resetFields();
        setReload((p) => !p);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user");
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [reload]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/user/${id}`);
      setReload((p) => !p);
    } catch (err) {}
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "No",
      key: "index",
      render: (_value, _item, index)=>{
        return index+1
      }
    },

    {
      title: "Ismi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Yoshi",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Oilalimi",
      dataIndex: "isMarried",
      key: "isMarried",
      render: (value) => {
        return <p>{value ? "Ha" : "Yo'q"}</p>;
      },
    },
    {
      title: "Sana",
      dataIndex: "createdAt",
      key: "createdAt",
    },

    {
      title: "Action",
      key: "action",
      render: (_value, item) => (
        <div>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(item.id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>

          <Button>Update</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="bg-slate-200 p-4 rounded-lg flex justify-between">
        <Typography.Title level={3}>User CRUD</Typography.Title>
        <Button onClick={showModal} type="primary">
          +
        </Button>
      </div>

      <div className="mt-6">
        <Table<DataType>
          columns={columns}
          rowKey={"id"}
          pagination={false}
          dataSource={data}
        />
      </div>

      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Typography.Title level={3}>Create User</Typography.Title>
        <Form
          name="basic"
          form={form}
          initialValues={{ isMarried: false }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Ismingiz"
            name="name"
            rules={[{ required: true, message: "Username kiriting" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="age"
            name="age"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="isMarried"
            name="isMarried"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item label={null}>
            <Button className="w-full" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(User);
